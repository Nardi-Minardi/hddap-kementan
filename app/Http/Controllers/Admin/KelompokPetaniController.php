<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use App\Models\KelompokPetani;
use App\Models\Kecamatan;
use App\Models\KelDes;
use App\Models\Petani;
use App\Models\Poktan;
use App\Models\Provinsi;
use App\Services\UserScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KelompokPetaniController extends Controller
{
    public function index(Request $request): Response
    {
        $scope = UserScopeService::current();
        $query = Poktan::query()
            ->select([
                'id',
                'kode_kota',
                'kode_cluster',
                'nama_poktan',
                'ketua',
                'telp',
            ])
            ->with([
                'cluster:id,nama_cluster',
                'kabKota:id,code,name,provinsi_code',
                'kabKota.provinsi:id,code,name',
            ])
            ->withCount('petani as jumlah_anggota')
            ->orderBy('id');

        $scope->applyKabKotaScope($query);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_poktan', 'ilike', "%{$search}%")
                    ->orWhere('ketua', 'ilike', "%{$search}%")
                    ->orWhere('telp', 'ilike', "%{$search}%")
                    ->orWhere('alamat', 'ilike', "%{$search}%")
                    ->orWhereHas('cluster', fn ($clusterQuery) => $clusterQuery
                        ->where('nama_cluster', 'ilike', "%{$search}%"))
                    ->orWhereHas('kabKota', fn ($kabQuery) => $kabQuery
                        ->where('name', 'ilike', "%{$search}%")
                        ->orWhereHas('provinsi', fn ($provQuery) => $provQuery
                            ->where('name', 'ilike', "%{$search}%")));
            });
        }

        if ($request->filled('provinsi_code')) {
            $query->whereHas('kabKota', fn ($kabQuery) => $kabQuery
                ->where('provinsi_code', (string) $request->provinsi_code));
        }

        if ($request->filled('kode_kota')) {
            $scope->ensureCanAccessKabKota($request->kode_kota);
            $query->where('kode_kota', (int) $request->kode_kota);
        }

        $hddapKabCodes = $scope->allowedKabKotaCodes();

        $provinsis = Provinsi::query()
            ->whereIn('code', KabKota::query()
                ->whereIn('code', $hddapKabCodes)
                ->distinct()
                ->pluck('provinsi_code'))
            ->orderBy('name')
            ->get(['code', 'name']);

        $kabKotas = $request->filled('provinsi_code')
            ? KabKota::query()
                ->where('provinsi_code', (string) $request->provinsi_code)
                ->whereIn('code', $hddapKabCodes)
                ->orderBy('name')
                ->get(['code', 'name'])
            : collect();

        return Inertia::render('Admin/KelompokPetani/Index', [
            'poktan' => $query->paginate(20)->withQueryString(),
            'provinsis' => $provinsis,
            'kabKotas' => $kabKotas,
            'filters' => $request->only('search', 'provinsi_code', 'kode_kota'),
        ]);
    }

    public function anggota(Poktan $poktan): JsonResponse
    {
        UserScopeService::current()->ensureCanAccessKabKota($poktan->kode_kota);

        $poktan->load('cluster:id,nama_cluster');

        $anggota = Petani::query()
            ->where('kode_poktan', $poktan->id)
            ->orderBy('nama_petani')
            ->get([
                'id',
                'nama_petani',
                'nik_petani',
                'no_hp_petani',
                'gender_petani',
                'usia_petani',
                'alamat_petani',
            ]);

        return response()->json([
            'poktan' => [
                'id' => $poktan->id,
                'nama_poktan' => $poktan->nama_poktan,
                'ketua' => $poktan->ketua,
                'nama_cluster' => $poktan->cluster?->nama_cluster,
            ],
            'anggota' => $anggota,
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