<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DokumenKegiatan;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DokumenKegiatanController extends Controller
{
    public function index(Request $request): Response
    {
        $query = DokumenKegiatan::query()
            ->orderByDesc('urutan')
            ->orderByDesc('published_at')
            ->orderByDesc('id');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'ilike', "%{$search}%")
                    ->orWhere('deskripsi', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('is_published')) {
            $query->where('is_published', $request->is_published === '1');
        }

        return Inertia::render('Admin/DokumenKegiatan/Index', [
            'dokumen' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only('search', 'is_published'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/DokumenKegiatan/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateDokumen($request);
        unset($validated['file'], $validated['cover']);

        $validated['slug'] = $this->uniqueSlug($validated['judul']);
        $validated['file_path'] = $request->file('file')->store('dokumen-kegiatan', 'public');
        $validated['cover_path'] = $this->storeCover($request);
        $validated['user_id'] = $request->user()?->id;

        $dokumen = DokumenKegiatan::create($validated);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat dokumen kegiatan: {$dokumen->judul}",
            subject: $dokumen,
        );

        return redirect()->route('admin.dokumen-kegiatan.index')
            ->with('success', 'Dokumen kegiatan berhasil ditambahkan.');
    }

    public function edit(DokumenKegiatan $dokumenKegiatan): Response
    {
        return Inertia::render('Admin/DokumenKegiatan/Edit', [
            'dokumen' => $dokumenKegiatan,
        ]);
    }

    public function update(Request $request, DokumenKegiatan $dokumenKegiatan): RedirectResponse
    {
        $validated = $this->validateDokumen($request, $dokumenKegiatan);
        unset($validated['file'], $validated['cover']);

        if ($validated['judul'] !== $dokumenKegiatan->judul) {
            $validated['slug'] = $this->uniqueSlug($validated['judul'], $dokumenKegiatan->id);
        }

        if ($request->hasFile('file')) {
            $this->deleteStoredFile($dokumenKegiatan->file_path);
            $validated['file_path'] = $request->file('file')->store('dokumen-kegiatan', 'public');
        }

        if ($request->hasFile('cover')) {
            $this->deleteStoredFile($dokumenKegiatan->cover_path);
            $validated['cover_path'] = $this->storeCover($request);
        }

        $dokumenKegiatan->update($validated);

        ActivityLogger::log(
            aksi: 'update',
            deskripsi: "Memperbarui dokumen kegiatan: {$dokumenKegiatan->judul}",
            subject: $dokumenKegiatan,
        );

        return redirect()->route('admin.dokumen-kegiatan.index')
            ->with('success', 'Dokumen kegiatan berhasil diperbarui.');
    }

    public function destroy(DokumenKegiatan $dokumenKegiatan): RedirectResponse
    {
        $judul = $dokumenKegiatan->judul;
        $this->deleteStoredFile($dokumenKegiatan->file_path);
        $this->deleteStoredFile($dokumenKegiatan->cover_path);
        $dokumenKegiatan->delete();

        ActivityLogger::log(
            aksi: 'delete',
            deskripsi: "Menghapus dokumen kegiatan: {$judul}",
        );

        return redirect()->route('admin.dokumen-kegiatan.index')
            ->with('success', 'Dokumen kegiatan berhasil dihapus.');
    }

    /** @return array<string, mixed> */
    private function validateDokumen(Request $request, ?DokumenKegiatan $dokumen = null): array
    {
        $fileRule = $dokumen
            ? 'nullable|file|mimes:pdf|max:20480'
            : 'required|file|mimes:pdf|max:20480';

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:1000',
            'file' => $fileRule,
            'cover' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
            'urutan' => 'nullable|integer|min:0|max:9999',
        ], [
            'file.required' => 'File PDF wajib diupload.',
            'file.mimes' => 'File harus berformat PDF.',
            'file.max' => 'Ukuran file PDF maksimal 20 MB.',
        ]);

        $validated['is_published'] = (bool) ($validated['is_published'] ?? false);
        $validated['urutan'] = (int) ($validated['urutan'] ?? 0);

        return $validated;
    }

    private function storeCover(Request $request): ?string
    {
        if (! $request->hasFile('cover')) {
            return null;
        }

        return $request->file('cover')->store('dokumen-kegiatan/covers', 'public');
    }

    private function uniqueSlug(string $judul, ?int $ignoreId = null): string
    {
        $base = Str::slug($judul) ?: 'dokumen';
        $slug = $base;
        $counter = 1;

        while (DokumenKegiatan::query()
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    private function deleteStoredFile(?string $path): void
    {
        if ($path === null) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
