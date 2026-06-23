<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KelompokPetani;
use App\Models\Provinsi;
use App\Models\KabKota;
use App\Models\Kecamatan;
use App\Models\KelDes;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class KelompokPetaniController extends Controller
{
    public function index(Request $request): Response
    {
        $query = KelompokPetani::query()->orderBy('id');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_poktan', 'ilike', "%{$search}%")
                  ->orWhere('nama_ketua_poktan', 'ilike', "%{$search}%")
                  ->orWhere('provinsi_name', 'ilike', "%{$search}%")
                  ->orWhere('kab_kota_name', 'ilike', "%{$search}%")
                  ->orWhere('kecamatan_name', 'ilike', "%{$search}%")
                  ->orWhere('kel_des_name', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('provinsi_id')) {
            $query->where('provinsi_id', $request->provinsi_id);
        }

        if ($request->filled('kab_kota_id')) {
            $query->where('kab_kota_id', $request->kab_kota_id);
        }

        return Inertia::render('Admin/KelompokPetani/Index', [
            'poktan'    => $query->paginate(20)->withQueryString(),
            'provinsis' => Provinsi::orderBy('name')->get(['id', 'name']),
            'kabKotas'  => $request->filled('provinsi_id')
                ? KabKota::where('provinsi_code', function ($q) use ($request) {
                    $q->select('code')->from('m_provinsi')->where('id', $request->provinsi_id);
                })->orderBy('name')->get(['id', 'name'])
                : [],
            'filters'   => $request->only('search', 'provinsi_id', 'kab_kota_id'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/KelompokPetani/Create', [
            'provinsis' => Provinsi::orderBy('name')->get(['id', 'code', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'provinsi_id'                  => 'nullable|exists:m_provinsi,id',
            'kab_kota_id'                  => 'nullable|exists:m_kab_kota,id',
            'kecamatan_id'                 => 'nullable|exists:m_kecamatan,id',
            'kel_des_id'                   => 'nullable|exists:m_kel_des,id',
            'nama_poktan'                  => 'required|string|max:255',
            'luas_layanan_poktan'          => 'nullable|numeric|min:0',
            'tahun_pembentukan'            => 'nullable|integer|min:1900|max:' . now()->year,
            'diketahui_pic'                => 'nullable|string|max:255',
            'sk_bupati'                    => 'nullable|string|max:255',
            'akte_notaris'                 => 'nullable|string|max:255',
            'ket_terdaftar_pengadilan'     => 'nullable|string|max:255',
            'nama_ketua_poktan'            => 'nullable|string|max:255',
            'no_hp_ketua_poktan'           => 'nullable|string|max:20',
            'gender_ketua_poktan'          => 'nullable|in:L,P',
            'gender_wakil_poktan'          => 'nullable|in:L,P',
            'gender_sekretaris_poktan'     => 'nullable|in:L,P',
            'gender_bendahara_poktan'      => 'nullable|in:L,P',
            'jumlah_pengurus_poktan'       => 'nullable|integer|min:0',
            'jumlah_anggota_poktan'        => 'nullable|integer|min:0',
            'jumlah_anggota_pria_poktan'   => 'nullable|integer|min:0',
            'jumlah_anggota_wanita_poktan' => 'nullable|integer|min:0',
            'ad_art'                       => 'nullable|string|max:255',
            'alamat_kantor_sekretariat'    => 'nullable|string',
            'pengisian_buku'               => 'nullable|string|max:255',
            'iuran'                        => 'nullable|string|max:255',
            'keterangan'                   => 'nullable|string',
        ]);

        // Resolve name fields from selected IDs
        if (!empty($validated['provinsi_id'])) {
            $provinsi = Provinsi::find($validated['provinsi_id']);
            $validated['provinsi_name'] = $provinsi?->name;
        }
        if (!empty($validated['kab_kota_id'])) {
            $kabKota = KabKota::find($validated['kab_kota_id']);
            $validated['kab_kota_name'] = $kabKota?->name;
        }
        if (!empty($validated['kecamatan_id'])) {
            $kecamatan = Kecamatan::find($validated['kecamatan_id']);
            $validated['kecamatan_name'] = $kecamatan?->name;
        }
        if (!empty($validated['kel_des_id'])) {
            $kelDes = KelDes::find($validated['kel_des_id']);
            $validated['kel_des_name'] = $kelDes?->name;
        }

        KelompokPetani::create($validated);

        return redirect()->route('admin.kelompok-petani.index')
            ->with('success', 'Kelompok petani berhasil ditambahkan.');
    }

    public function edit(KelompokPetani $kelompokPetani): Response
    {
        return Inertia::render('Admin/KelompokPetani/Edit', [
            'poktan'    => $kelompokPetani,
            'provinsis' => Provinsi::orderBy('name')->get(['id', 'code', 'name']),
        ]);
    }

    public function update(Request $request, KelompokPetani $kelompokPetani): RedirectResponse
    {
        $validated = $request->validate([
            'provinsi_id'                  => 'nullable|exists:m_provinsi,id',
            'kab_kota_id'                  => 'nullable|exists:m_kab_kota,id',
            'kecamatan_id'                 => 'nullable|exists:m_kecamatan,id',
            'kel_des_id'                   => 'nullable|exists:m_kel_des,id',
            'nama_poktan'                  => 'required|string|max:255',
            'luas_layanan_poktan'          => 'nullable|numeric|min:0',
            'tahun_pembentukan'            => 'nullable|integer|min:1900|max:' . now()->year,
            'diketahui_pic'                => 'nullable|string|max:255',
            'sk_bupati'                    => 'nullable|string|max:255',
            'akte_notaris'                 => 'nullable|string|max:255',
            'ket_terdaftar_pengadilan'     => 'nullable|string|max:255',
            'nama_ketua_poktan'            => 'nullable|string|max:255',
            'no_hp_ketua_poktan'           => 'nullable|string|max:20',
            'gender_ketua_poktan'          => 'nullable|in:L,P',
            'gender_wakil_poktan'          => 'nullable|in:L,P',
            'gender_sekretaris_poktan'     => 'nullable|in:L,P',
            'gender_bendahara_poktan'      => 'nullable|in:L,P',
            'jumlah_pengurus_poktan'       => 'nullable|integer|min:0',
            'jumlah_anggota_poktan'        => 'nullable|integer|min:0',
            'jumlah_anggota_pria_poktan'   => 'nullable|integer|min:0',
            'jumlah_anggota_wanita_poktan' => 'nullable|integer|min:0',
            'ad_art'                       => 'nullable|string|max:255',
            'alamat_kantor_sekretariat'    => 'nullable|string',
            'pengisian_buku'               => 'nullable|string|max:255',
            'iuran'                        => 'nullable|string|max:255',
            'keterangan'                   => 'nullable|string',
        ]);

        if (!empty($validated['provinsi_id'])) {
            $validated['provinsi_name'] = Provinsi::find($validated['provinsi_id'])?->name;
        }
        if (!empty($validated['kab_kota_id'])) {
            $validated['kab_kota_name'] = KabKota::find($validated['kab_kota_id'])?->name;
        }
        if (!empty($validated['kecamatan_id'])) {
            $validated['kecamatan_name'] = Kecamatan::find($validated['kecamatan_id'])?->name;
        }
        if (!empty($validated['kel_des_id'])) {
            $validated['kel_des_name'] = KelDes::find($validated['kel_des_id'])?->name;
        }

        $kelompokPetani->update($validated);

        return redirect()->route('admin.kelompok-petani.index')
            ->with('success', 'Kelompok petani berhasil diperbarui.');
    }

    public function destroy(KelompokPetani $kelompokPetani): RedirectResponse
    {
        $kelompokPetani->delete();

        return redirect()->route('admin.kelompok-petani.index')
            ->with('success', 'Kelompok petani berhasil dihapus.');
    }

    // === Dynamic dropdown APIs ===

    public function kabKotaByProvinsi(Request $request): JsonResponse
    {
        $provinsi = Provinsi::findOrFail($request->provinsi_id);
        $data = KabKota::where('provinsi_code', $provinsi->code)->orderBy('name')->get(['id', 'name']);
        return response()->json($data);
    }

    public function kecamatanByKabKota(Request $request): JsonResponse
    {
        $kabKota = KabKota::findOrFail($request->kab_kota_id);
        $data = Kecamatan::where('kab_kota_code', $kabKota->code)->orderBy('name')->get(['id', 'name']);
        return response()->json($data);
    }

    public function kelDesByKecamatan(Request $request): JsonResponse
    {
        $kecamatan = Kecamatan::findOrFail($request->kecamatan_id);
        $data = KelDes::where('kecamatan_code', $kecamatan->code)->orderBy('name')->get(['id', 'name']);
        return response()->json($data);
    }
}
