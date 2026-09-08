<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cluster;
use App\Models\KabKota;
use App\Models\Kumoditas;
use App\Models\Poktan;
use App\Models\Provinsi;
use App\Services\UserScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClusterController extends Controller
{
    public function index(Request $request): RedirectResponse
    {
        return redirect()->route('admin.data-petani.index', array_merge(
            ['tab' => 'cluster'],
            $request->query(),
        ));
    }

    /**
     * @return array<string, mixed>
     */
    public function indexProps(Request $request): array
    {
        $scope = UserScopeService::current();
        $query = Cluster::query()
            ->select([
                'id',
                'kode_kota',
                'nama_kota',
                'nama_cluster',
                'kode_kumoditas',
            ])
            ->with([
                'kabKota:id,code,name,provinsi_code',
                'kabKota.provinsi:id,code,name',
                'kumoditas:id,kumoditas',
            ])
            ->withCount('poktan as jumlah_poktan')
            ->orderBy('nama_cluster');

        $scope->applyKabKotaScope($query);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_cluster', 'ilike', "%{$search}%")
                    ->orWhere('nama_kota', 'ilike', "%{$search}%")
                    ->orWhereHas('kabKota', fn ($kabQuery) => $kabQuery
                        ->where('name', 'ilike', "%{$search}%")
                        ->orWhereHas('provinsi', fn ($provQuery) => $provQuery
                            ->where('name', 'ilike', "%{$search}%")))
                    ->orWhereHas('kumoditas', fn ($kumoditasQuery) => $kumoditasQuery
                        ->where('kumoditas', 'ilike', "%{$search}%"));
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
            'clusters' => $query->paginate(20)->withQueryString(),
            'provinsis' => $provinsis,
            'kabKotas' => $kabKotas,
            'filters' => $request->only('search', 'provinsi_code', 'kode_kota'),
        ];
    }

    public function poktan(Cluster $cluster): JsonResponse
    {
        UserScopeService::current()->ensureCanAccessKabKota($cluster->kode_kota);

        $cluster->load([
            'kabKota:id,code,name',
            'kumoditas:id,kumoditas',
        ]);

        $poktanList = Poktan::query()
            ->where('kode_cluster', $cluster->id)
            ->withCount('petani as jumlah_anggota')
            ->orderBy('nama_poktan')
            ->get([
                'id',
                'nama_poktan',
                'ketua',
                'telp',
                'alamat',
            ]);

        return response()->json([
            'cluster' => [
                'id' => $cluster->id,
                'nama_cluster' => $cluster->nama_cluster,
                'nama_kota' => $cluster->kabKota?->name ?? $cluster->nama_kota,
                'komoditas' => $cluster->kumoditas?->kumoditas,
            ],
            'poktan' => $poktanList,
        ]);
    }

    public function create(): Response
    {
        $scope = UserScopeService::current();

        return Inertia::render('Admin/Cluster/Create', [
            'kabKotaOptions' => $scope->kabKotaOptions(),
            'kumoditasOptions' => $this->kumoditasOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateCluster($request);

        Cluster::create($validated);

        return redirect()->route('admin.data-petani.index', ['tab' => 'cluster'])
            ->with('success', 'Kluster petani berhasil ditambahkan.');
    }

    public function edit(Cluster $cluster): Response
    {
        UserScopeService::current()->ensureCanAccessKabKota($cluster->kode_kota);

        $cluster->load([
            'kabKota:id,code,name,provinsi_code',
            'kabKota.provinsi:id,code,name',
            'kumoditas:id,kumoditas',
        ]);

        $scope = UserScopeService::current();

        return Inertia::render('Admin/Cluster/Edit', [
            'cluster' => $cluster,
            'kabKotaOptions' => $scope->kabKotaOptions(),
            'kumoditasOptions' => $this->kumoditasOptions(),
        ]);
    }

    public function update(Request $request, Cluster $cluster): RedirectResponse
    {
        UserScopeService::current()->ensureCanAccessKabKota($cluster->kode_kota);

        $validated = $this->validateCluster($request);

        $cluster->update($validated);

        return redirect()->route('admin.data-petani.index', ['tab' => 'cluster'])
            ->with('success', 'Kluster petani berhasil diperbarui.');
    }

    public function destroy(Cluster $cluster): RedirectResponse
    {
        UserScopeService::current()->ensureCanAccessKabKota($cluster->kode_kota);

        if ($cluster->poktan()->exists()) {
            return redirect()->route('admin.data-petani.index', ['tab' => 'cluster'])
                ->with('error', 'Kluster petani tidak dapat dihapus karena masih memiliki kelompok petani.');
        }

        $cluster->delete();

        return redirect()->route('admin.data-petani.index', ['tab' => 'cluster'])
            ->with('success', 'Kluster petani berhasil dihapus.');
    }

    private function validateCluster(Request $request): array
    {
        $validated = $request->validate([
            'kode_kota' => 'required|integer|exists:m_kab_kota,code',
            'nama_cluster' => 'required|string|max:255',
            'kode_kumoditas' => 'nullable|integer|exists:m_kumoditas,id',
        ]);

        UserScopeService::current()->ensureCanAccessKabKota((int) $validated['kode_kota']);

        $kabKota = KabKota::query()
            ->where('code', (string) $validated['kode_kota'])
            ->first();

        $validated['nama_kota'] = $kabKota?->name;

        return $validated;
    }

    private function kumoditasOptions(): array
    {
        return Kumoditas::query()
            ->orderBy('kumoditas')
            ->get(['id', 'kumoditas'])
            ->map(fn (Kumoditas $item) => [
                'value' => $item->id,
                'label' => $item->kumoditas,
            ])
            ->values()
            ->all();
    }
}
