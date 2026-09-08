<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use App\Services\DatabaseBackupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Throwable;

class DatabaseBackupController extends Controller
{
    public function __construct(
        private readonly DatabaseBackupService $backupService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/DatabaseBackup/Index', [
            'connection' => $this->backupService->connectionInfo(),
            'backups' => $this->backupService->listBackups(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        try {
            $backup = $this->backupService->createBackup();

            ActivityLogger::log(
                aksi: 'backup',
                deskripsi: "Membuat backup database: {$backup['filename']}",
                metadata: [
                    'filename' => $backup['filename'],
                    'size' => $backup['size'],
                ],
            );

            return redirect()->route('admin.database-backup.index')
                ->with('success', "Backup database berhasil dibuat ({$backup['filename']}).");
        } catch (Throwable $exception) {
            return redirect()->route('admin.database-backup.index')
                ->with('error', $exception->getMessage());
        }
    }

    public function download(string $filename): BinaryFileResponse|RedirectResponse
    {
        try {
            $path = $this->backupService->resolveBackupPath($filename);

            ActivityLogger::log(
                aksi: 'download',
                deskripsi: "Mengunduh backup database: {$filename}",
            );

            return response()->download($path, basename($path));
        } catch (Throwable $exception) {
            return redirect()->route('admin.database-backup.index')
                ->with('error', $exception->getMessage());
        }
    }

    public function restore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'confirm' => 'required|in:RESTORE',
            'admin_password' => ['required', 'string', 'current_password'],
            'backup_file' => 'nullable|string|max:255',
            'upload' => 'nullable|file|max:' . (int) config('database_backup.max_upload_kb', 512000),
        ], [
            'admin_password.current_password' => 'Password admin tidak valid.',
        ]);

        if (empty($validated['backup_file']) && ! $request->hasFile('upload')) {
            return redirect()->route('admin.database-backup.index')
                ->with('error', 'Pilih file backup yang ada atau unggah file backup.');
        }

        try {
            if ($request->hasFile('upload')) {
                $upload = $request->file('upload');
                $extension = strtolower($upload->getClientOriginalExtension() ?: 'sql');
                $tempPath = $upload->storeAs(
                    config('database_backup.directory', 'database-backups'),
                    'restore_' . now()->format('Ymd_His') . '.' . $extension,
                );
                $absolutePath = storage_path('app/' . $tempPath);

                $this->backupService->restoreUploadedFile($absolutePath, $extension);
                File::delete($absolutePath);

                ActivityLogger::log(
                    aksi: 'restore',
                    deskripsi: 'Restore database dari file upload',
                    metadata: ['original_name' => $upload->getClientOriginalName()],
                );
            } else {
                $filename = basename((string) $validated['backup_file']);
                $this->backupService->restoreBackup($filename);

                ActivityLogger::log(
                    aksi: 'restore',
                    deskripsi: "Restore database dari backup: {$filename}",
                    metadata: ['filename' => $filename],
                );
            }

            return redirect()->route('admin.database-backup.index')
                ->with('success', 'Database berhasil di-restore.');
        } catch (Throwable $exception) {
            return redirect()->route('admin.database-backup.index')
                ->with('error', $exception->getMessage());
        }
    }

    public function destroy(string $filename): RedirectResponse
    {
        try {
            $safeName = basename($filename);
            $this->backupService->deleteBackup($safeName);

            ActivityLogger::log(
                aksi: 'delete',
                deskripsi: "Menghapus file backup database: {$safeName}",
            );

            return redirect()->route('admin.database-backup.index')
                ->with('success', 'File backup berhasil dihapus.');
        } catch (Throwable $exception) {
            return redirect()->route('admin.database-backup.index')
                ->with('error', $exception->getMessage());
        }
    }
}
