<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cluster;
use App\Models\KabKota;
use App\Models\Petani;
use App\Models\Poktan;
use App\Models\Provinsi;
use App\Services\UserScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class KelompokPetaniController extends Controller
{
    public function index(Request $request): RedirectResponse
    {
        return redirect()->route('admin.data-petani.index', array_merge(
            ['tab' => 'kelompok-petani'],
            $request->query(),
        ));
    }

    /**
     * @return array<string, mixed>
     */
    public function indexProps(Request $request): array
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

        return [
            'poktan' => $query->paginate(20)->withQueryString(),
            'provinsis' => $provinsis,
            'kabKotas' => $kabKotas,
            'filters' => $request->only('search', 'provinsi_code', 'kode_kota'),
        ];
    }

    public function create(): Response
    {
        return Inertia::render('Admin/KelompokPetani/Create', [
            'provinsis' => $this->scopedProvinsis(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePoktan($request);

        Poktan::create([
            'kode_kota' => $validated['kode_kota'],
            'kode_cluster' => $validated['kode_cluster'],
            'nama_poktan' => $validated['nama_poktan'],
            'ketua' => $validated['ketua'] ?? null,
            'telp' => $validated['telp'] ?? null,
            'alamat' => $validated['alamat'] ?? null,
        ]);

        return redirect()->route('admin.data-petani.index', ['tab' => 'kelompok-petani'])
            ->with('success', 'Kelompok petani berhasil ditambahkan.');
    }

    public function edit(Poktan $kelompokPetani): Response
    {
        UserScopeService::current()->ensureCanAccessKabKota($kelompokPetani->kode_kota);

        $kelompokPetani->load([
            'cluster:id,nama_cluster,kode_kota',
            'kabKota:id,code,name,provinsi_code',
            'kabKota.provinsi:id,code,name',
        ]);

        return Inertia::render('Admin/KelompokPetani/Edit', [
            'poktan' => $kelompokPetani,
            'provinsis' => $this->scopedProvinsis(),
        ]);
    }

    public function update(Request $request, Poktan $kelompokPetani): RedirectResponse
    {
        UserScopeService::current()->ensureCanAccessKabKota($kelompokPetani->kode_kota);

        $validated = $this->validatePoktan($request);

        $kelompokPetani->update([
            'kode_kota' => $validated['kode_kota'],
            'kode_cluster' => $validated['kode_cluster'],
            'nama_poktan' => $validated['nama_poktan'],
            'ketua' => $validated['ketua'] ?? null,
            'telp' => $validated['telp'] ?? null,
            'alamat' => $validated['alamat'] ?? null,
        ]);

        return redirect()->route('admin.data-petani.index', ['tab' => 'kelompok-petani'])
            ->with('success', 'Kelompok petani berhasil diperbarui.');
    }

    public function destroy(Poktan $kelompokPetani): RedirectResponse
    {
        UserScopeService::current()->ensureCanAccessKabKota($kelompokPetani->kode_kota);

        if ($kelompokPetani->petani()->exists()) {
            return redirect()->route('admin.data-petani.index', ['tab' => 'kelompok-petani'])
                ->with('error', 'Kelompok petani tidak dapat dihapus karena masih memiliki anggota petani.');
        }

        $kelompokPetani->delete();

        return redirect()->route('admin.data-petani.index', ['tab' => 'kelompok-petani'])
            ->with('success', 'Kelompok petani berhasil dihapus.');
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

    public function kabKotaByProvinsi(Request $request): JsonResponse
    {
        $scope = UserScopeService::current();

        $query = KabKota::query()
            ->whereIn('code', $scope->allowedKabKotaCodes())
            ->orderBy('name');

        if ($request->filled('provinsi_code')) {
            $request->validate([
                'provinsi_code' => 'required|string|exists:m_provinsi,code',
            ]);

            $query->where('provinsi_code', $request->provinsi_code);
        }

        return response()->json($query->get(['code', 'name']));
    }

    public function clustersByKabKota(Request $request): JsonResponse
    {
        $request->validate([
            'kode_kota' => 'required|integer|exists:m_kab_kota,code',
        ]);

        UserScopeService::current()->ensureCanAccessKabKota((int) $request->kode_kota);

        $data = Cluster::query()
            ->where('kode_kota', (int) $request->kode_kota)
            ->orderBy('nama_cluster')
            ->get(['id', 'nama_cluster']);

        return response()->json($data);
    }

    private function scopedProvinsis()
    {
        $scope = UserScopeService::current();
        $hddapKabCodes = $scope->allowedKabKotaCodes();

        return Provinsi::query()
            ->whereIn('code', KabKota::query()
                ->whereIn('code', $hddapKabCodes)
                ->distinct()
                ->pluck('provinsi_code'))
            ->orderBy('name')
            ->get(['code', 'name']);
    }

    private function validatePoktan(Request $request): array
    {
        $validated = $request->validate([
            'kode_kota' => 'required|integer|exists:m_kab_kota,code',
            'kode_cluster' => 'required|integer|exists:m_cluster,id',
            'nama_poktan' => 'required|string|max:255',
            'ketua' => 'nullable|string|max:255',
            'telp' => 'nullable|string|max:30',
            'alamat' => 'nullable|string|max:500',
        ]);

        UserScopeService::current()->ensureCanAccessKabKota((int) $validated['kode_kota']);

        $cluster = Cluster::find($validated['kode_cluster']);

        if (!$cluster || (int) $cluster->kode_kota !== (int) $validated['kode_kota']) {
            throw ValidationException::withMessages([
                'kode_cluster' => 'Cluster tidak sesuai dengan Kab/Kota yang dipilih.',
            ]);
        }

        return $validated;
    }
}
