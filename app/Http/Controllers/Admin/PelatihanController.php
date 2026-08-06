<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisPelatihan;
use App\Models\Pelatihan;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PelatihanController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Pelatihan::query()
            ->with('jenisPelatihan')
            ->orderByDesc('kd_pelatihan');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('lokasi', 'ilike', "%{$search}%")
                    ->orWhereHas('jenisPelatihan', function ($jenisQuery) use ($search) {
                        $jenisQuery->where('jenis_pelatihan', 'ilike', "%{$search}%")
                            ->orWhere('nama_pelatihan', 'ilike', "%{$search}%");
                    });
            });
        }

        return Inertia::render('Admin/DataVerval/Pelatihan/Index', [
            'pelatihan' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/DataVerval/Pelatihan/Create', [
            'jenisPelatihanOptions' => $this->jenisPelatihanOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedData($request);
        Pelatihan::create($validated);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat data pelatihan: {$validated['lokasi']}",
            metadata: $validated,
        );

        return redirect()->route('admin.data-verval.pelatihan.index')
            ->with('success', 'Data pelatihan berhasil dibuat.');
    }

    public function edit(Pelatihan $pelatihan): Response
    {
        $pelatihan->load('jenisPelatihan');

        return Inertia::render('Admin/DataVerval/Pelatihan/Edit', [
            'pelatihan' => $pelatihan,
            'jenisPelatihanOptions' => $this->jenisPelatihanOptions(),
        ]);
    }

    public function update(Request $request, Pelatihan $pelatihan): RedirectResponse
    {
        $validated = $this->validatedData($request);
        $pelatihan->update($validated);

        ActivityLogger::log(
            aksi: 'update',
            deskripsi: "Memperbarui data pelatihan: {$pelatihan->lokasi}",
            subject: $pelatihan,
        );

        return redirect()->route('admin.data-verval.pelatihan.index')
            ->with('success', 'Data pelatihan berhasil diperbarui.');
    }

    public function destroy(Pelatihan $pelatihan): RedirectResponse
    {
        $lokasi = $pelatihan->lokasi;
        $kdPelatihan = $pelatihan->kd_pelatihan;

        $pelatihan->delete();

        ActivityLogger::log(
            aksi: 'delete',
            deskripsi: "Menghapus data pelatihan: {$lokasi}",
            metadata: ['deleted_pelatihan_kd_pelatihan' => $kdPelatihan],
        );

        return redirect()->route('admin.data-verval.pelatihan.index')
            ->with('success', 'Data pelatihan berhasil dihapus.');
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'kdjenis' => 'required|exists:tr_jns_pelatihan,kdjenis',
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:100',
            'jumlah_jpl' => 'required|integer|min:0',
            'laki_laki' => 'required|integer|min:0',
            'perempuan' => 'required|integer|min:0',
        ]);
    }

    private function jenisPelatihanOptions(): array
    {
        return JenisPelatihan::query()
            ->orderBy('kdjenis')
            ->get(['kdjenis', 'jenis_pelatihan', 'nama_pelatihan'])
            ->map(fn (JenisPelatihan $item) => [
                'value' => $item->kdjenis,
                'label' => "{$item->jenis_pelatihan} — {$item->nama_pelatihan}",
            ])
            ->values()
            ->all();
    }
}
