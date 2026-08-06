<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisPelatihan;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JenisPelatihanController extends Controller
{
    public function index(Request $request): Response
    {
        $query = JenisPelatihan::query()->orderBy('kdjenis');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kdjenis', 'ilike', "%{$search}%")
                    ->orWhere('jenis_pelatihan', 'ilike', "%{$search}%")
                    ->orWhere('nama_pelatihan', 'ilike', "%{$search}%");
            });
        }

        return Inertia::render('Admin/DataVerval/JenisPelatihan/Index', [
            'jenisPelatihan' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/DataVerval/JenisPelatihan/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_pelatihan' => 'required|string|max:100',
            'nama_pelatihan' => 'required|string|max:100',
        ]);

        $jenisPelatihan = JenisPelatihan::create($validated);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat jenis pelatihan: {$validated['nama_pelatihan']}",
            metadata: $validated,
        );

        return redirect()->route('admin.data-verval.jenis-pelatihan.index')
            ->with('success', 'Jenis pelatihan berhasil dibuat.');
    }

    public function edit(JenisPelatihan $jenisPelatihan): Response
    {
        return Inertia::render('Admin/DataVerval/JenisPelatihan/Edit', [
            'jenisPelatihan' => $jenisPelatihan,
        ]);
    }

    public function update(Request $request, JenisPelatihan $jenisPelatihan): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_pelatihan' => 'required|string|max:100',
            'nama_pelatihan' => 'required|string|max:100',
        ]);

        $jenisPelatihan->update($validated);

        ActivityLogger::log(
            aksi: 'update',
            deskripsi: "Memperbarui jenis pelatihan: {$jenisPelatihan->nama_pelatihan}",
            subject: $jenisPelatihan,
        );

        return redirect()->route('admin.data-verval.jenis-pelatihan.index')
            ->with('success', 'Jenis pelatihan berhasil diperbarui.');
    }

    public function destroy(JenisPelatihan $jenisPelatihan): RedirectResponse
    {
        $namaPelatihan = $jenisPelatihan->nama_pelatihan;
        $kdjenis = $jenisPelatihan->kdjenis;

        $jenisPelatihan->delete();

        ActivityLogger::log(
            aksi: 'delete',
            deskripsi: "Menghapus jenis pelatihan: {$namaPelatihan}",
            metadata: ['deleted_jenis_pelatihan_kdjenis' => $kdjenis],
        );

        return redirect()->route('admin.data-verval.jenis-pelatihan.index')
            ->with('success', 'Jenis pelatihan berhasil dihapus.');
    }
}
