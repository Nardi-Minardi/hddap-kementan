<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Logframe;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogframeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Logframe::query()->orderBy('id');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tingkat', 'ilike', "%{$search}%")
                    ->orWhere('component', 'ilike', "%{$search}%")
                    ->orWhere('nama_indikator', 'ilike', "%{$search}%")
                    ->orWhere('definisi_indikator', 'ilike', "%{$search}%")
                    ->orWhere('nilai_dasar', 'ilike', "%{$search}%")
                    ->orWhere('target_pertengahan_proyek', 'ilike', "%{$search}%")
                    ->orWhere('target_akhir_proyek', 'ilike', "%{$search}%")
                    ->orWhere('realisasi', 'ilike', "%{$search}%")
                    ->orWhere('sumber_data', 'ilike', "%{$search}%")
                    ->orWhere('data_yg_dikumpulkan', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('component')) {
            $query->where('component', (string) $request->component);
        }

        return Inertia::render('Admin/Logframe/Index', [
            'logframes' => $query->paginate(5)->withQueryString(),
            'filters' => $request->only('search', 'component'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Logframe/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedData($request);
        $logframe = Logframe::create($validated);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat data logframe: {$logframe->nama_indikator}",
            subject: $logframe,
        );

        return redirect()->route('admin.logframe.index')
            ->with('success', 'Data logframe berhasil dibuat.');
    }

    public function edit(Logframe $logframe): Response
    {
        return Inertia::render('Admin/Logframe/Edit', [
            'logframe' => $logframe,
        ]);
    }

    public function update(Request $request, Logframe $logframe): RedirectResponse
    {
        $validated = $this->validatedData($request);
        $logframe->update($validated);

        ActivityLogger::log(
            aksi: 'update',
            deskripsi: "Memperbarui data logframe: {$logframe->nama_indikator}",
            subject: $logframe,
        );

        return redirect()->route('admin.logframe.index')
            ->with('success', 'Data logframe berhasil diperbarui.');
    }

    public function destroy(Logframe $logframe): RedirectResponse
    {
        $namaIndikator = $logframe->nama_indikator;
        $logframeId = $logframe->id;

        $logframe->delete();

        ActivityLogger::log(
            aksi: 'delete',
            deskripsi: "Menghapus data logframe: {$namaIndikator}",
            metadata: ['deleted_logframe_id' => $logframeId],
        );

        return redirect()->route('admin.logframe.index')
            ->with('success', 'Data logframe berhasil dihapus.');
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'tingkat' => 'nullable|string',
            'component' => 'nullable|string',
            'nama_indikator' => 'required|string',
            'definisi_indikator' => 'nullable|string',
            'nilai_dasar' => 'nullable|string',
            'target_pertengahan_proyek' => 'nullable|string',
            'target_akhir_proyek' => 'nullable|string',
            'realisasi' => 'nullable|string',
            'sumber_data' => 'nullable|string',
            'data_yg_dikumpulkan' => 'nullable|string',
        ]);
    }
}
