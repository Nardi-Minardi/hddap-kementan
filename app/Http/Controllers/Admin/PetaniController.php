<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cluster;
use App\Models\KkPetani;
use App\Models\Petani;
use App\Models\Poktan;
use App\Services\UserScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PetaniController extends Controller
{
    public function index(Request $request): RedirectResponse
    {
        return redirect()->route('admin.data-petani.index', array_merge(
            ['tab' => 'petani'],
            $request->query(),
        ));
    }

    /**
     * @return array<string, mixed>
     */
    public function indexProps(Request $request): array
    {
        $scope = UserScopeService::current();
        $query = Petani::query()->orderBy('id');
        $scope->applyKabKotaScope($query);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_petani', 'ilike', "%{$search}%")
                  ->orWhere('nik_petani', 'ilike', "%{$search}%")
                  ->orWhere('no_hp_petani', 'ilike', "%{$search}%")
                  ->orWhere('alamat_petani', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('gender')) {
            $query->where('gender_petani', $request->gender);
        }

        if ($request->filled('kode_kota')) {
            $scope->ensureCanAccessKabKota($request->kode_kota);
            $query->where('kode_kota', (int) $request->kode_kota);
        }

        if ($request->filled('difabel')) {
            $query->where('difabel', $request->difabel === '1');
        }

        return [
            'petanis' => $query->withCount('kkPetani')->paginate(20)->withQueryString(),
            'filters' => $request->only('search', 'gender', 'kode_kota', 'difabel'),
            'kabKotaOptions' => $scope->kabKotaOptions(),
        ];
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Petani/Create', $this->formScopeProps());
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePetani($request);

        if ($request->hasFile('foto_lahan')) {
            $validated['foto_lahan'] = $request->file('foto_lahan')->store('petani/foto-lahan', 'public');
        } else {
            unset($validated['foto_lahan']);
        }

        Petani::create($validated);

        return redirect()->route('admin.data-petani.index', ['tab' => 'petani'])
            ->with('success', 'Data petani berhasil ditambahkan.');
    }

    public function edit(Petani $petani): Response
    {
        $this->ensureCanAccessPetani($petani);

        $petani->load('poktan:id,kode_cluster,kode_kota,nama_poktan');

        return Inertia::render('Admin/Petani/Edit', [
            'petani' => $petani,
            ...$this->formScopeProps(),
        ]);
    }

    public function update(Request $request, Petani $petani): RedirectResponse
    {
        $this->ensureCanAccessPetani($petani);

        $validated = $this->validatePetani($request);

        if ($request->hasFile('foto_lahan')) {
            $this->deleteFotoLahan($petani->foto_lahan);
            $validated['foto_lahan'] = $request->file('foto_lahan')->store('petani/foto-lahan', 'public');
        } else {
            unset($validated['foto_lahan']);
        }

        $petani->update($validated);

        return redirect()->route('admin.data-petani.index', ['tab' => 'petani'])
            ->with('success', 'Data petani berhasil diperbarui.');
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

    public function poktanByCluster(Request $request): JsonResponse
    {
        $request->validate([
            'kode_cluster' => 'required|integer|exists:m_cluster,id',
        ]);

        $cluster = Cluster::findOrFail((int) $request->kode_cluster);
        UserScopeService::current()->ensureCanAccessKabKota($cluster->kode_kota);

        $data = Poktan::query()
            ->where('kode_cluster', $cluster->id)
            ->orderBy('nama_poktan')
            ->get(['id', 'nama_poktan']);

        return response()->json($data);
    }

    public function destroy(Petani $petani): RedirectResponse
    {
        $this->ensureCanAccessPetani($petani);

        $this->deleteFotoLahan($petani->foto_lahan);
        $petani->delete();

        return redirect()->route('admin.data-petani.index', ['tab' => 'petani'])
            ->with('success', 'Data petani berhasil dihapus.');
    }

    public function keluarga(Petani $petani): Response
    {
        $this->ensureCanAccessPetani($petani);

        $keluarga = KkPetani::where('m_petani_id', $petani->id)->orderBy('id')->get();

        return Inertia::render('Admin/Petani/Keluarga', [
            'petani'   => $petani,
            'keluarga' => $keluarga,
            'statusOptions' => $this->keluargaStatusOptions(),
        ]);
    }

    public function storeKeluarga(Request $request, Petani $petani): RedirectResponse
    {
        $this->ensureCanAccessPetani($petani);

        $validated = $request->validate($this->keluargaValidationRules());

        $petani->kkPetani()->create($validated);

        return redirect()->route('admin.petani.keluarga', $petani)
            ->with('success', 'Anggota keluarga berhasil ditambahkan.');
    }

    public function updateKeluarga(Request $request, Petani $petani, KkPetani $kkPetani): RedirectResponse
    {
        $this->ensureCanAccessPetani($petani);
        $this->ensureKeluargaBelongsToPetani($petani, $kkPetani);

        $validated = $request->validate($this->keluargaValidationRules());

        $kkPetani->update($validated);

        return redirect()->route('admin.petani.keluarga', $petani)
            ->with('success', 'Data anggota keluarga berhasil diperbarui.');
    }

    public function destroyKeluarga(Petani $petani, KkPetani $kkPetani): RedirectResponse
    {
        $this->ensureCanAccessPetani($petani);
        $this->ensureKeluargaBelongsToPetani($petani, $kkPetani);

        $kkPetani->delete();

        return redirect()->route('admin.petani.keluarga', $petani)
            ->with('success', 'Anggota keluarga berhasil dihapus.');
    }

    /**
     * @return array<string, string>
     */
    private function keluargaValidationRules(): array
    {
        return [
            'nama'   => 'required|string|max:255',
            'nik'    => 'nullable|string|max:16',
            'gender' => 'nullable|in:L,P',
            'usia'   => 'nullable|integer|min:0|max:120',
            'status' => 'nullable|string|max:50',
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function keluargaStatusOptions(): array
    {
        return [
            ['value' => 'Suami', 'label' => 'Suami'],
            ['value' => 'Istri', 'label' => 'Istri'],
            ['value' => 'Anak', 'label' => 'Anak'],
            ['value' => 'Orang Tua', 'label' => 'Orang Tua'],
            ['value' => 'Saudara', 'label' => 'Saudara'],
            ['value' => 'Lainnya', 'label' => 'Lainnya'],
        ];
    }

    private function ensureKeluargaBelongsToPetani(Petani $petani, KkPetani $kkPetani): void
    {
        if ((int) $kkPetani->m_petani_id !== (int) $petani->id) {
            abort(404);
        }
    }

    private function deleteFotoLahan(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }

    private function ensureCanAccessPetani(Petani $petani): void
    {
        if ($petani->kode_kota !== null) {
            UserScopeService::current()->ensureCanAccessKabKota($petani->kode_kota);
        }
    }

    /**
     * @return array{showKabKota: bool, kabKotaOptions: list<array{value: string, label: string}>, defaultKodeKota: int|null}
     */
    private function formScopeProps(): array
    {
        $scope = UserScopeService::current();
        $codes = $scope->allowedKabKotaIntCodes();

        return [
            'showKabKota' => $scope->isPusat() || count($codes) > 1,
            'kabKotaOptions' => $scope->kabKotaOptions(),
            'defaultKodeKota' => ! $scope->isPusat() && count($codes) === 1 ? $codes[0] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePetani(Request $request): array
    {
        $scope = UserScopeService::current();

        $validated = $request->validate([
            'nama_petani'   => 'required|string|max:255',
            'nik_petani'    => 'nullable|string|max:16',
            'no_hp_petani'  => 'nullable|string|max:20',
            'gender_petani' => 'nullable|in:L,P',
            'usia_petani'   => 'nullable|integer|min:1|max:120',
            'difabel'       => 'boolean',
            'alamat_petani' => 'nullable|string',
            'kode_kota'     => ($scope->isPusat() ? 'required' : 'nullable').'|integer|exists:m_kab_kota,code',
            'kode_cluster'  => 'required|integer|exists:m_cluster,id',
            'kode_poktan'   => 'required|integer|exists:m_poktan,id',
            'latitude'      => 'nullable|numeric|between:-90,90',
            'longitude'     => 'nullable|numeric|between:-180,180',
            'foto_lahan'    => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096',
        ]);

        $cluster = Cluster::find($validated['kode_cluster']);
        $poktan = Poktan::find($validated['kode_poktan']);

        if (! $cluster || ! $poktan) {
            throw ValidationException::withMessages([
                'kode_poktan' => 'Kelompok tani tidak valid.',
            ]);
        }

        $scope->ensureCanAccessKabKota($cluster->kode_kota);

        if ($scope->isPusat()) {
            if ((int) $cluster->kode_kota !== (int) $validated['kode_kota']) {
                throw ValidationException::withMessages([
                    'kode_cluster' => 'Kluster tidak sesuai dengan Kab/Kota yang dipilih.',
                ]);
            }
        } elseif ($request->filled('kode_kota') && (int) $validated['kode_kota'] !== (int) $cluster->kode_kota) {
            throw ValidationException::withMessages([
                'kode_kota' => 'Kab/Kota tidak sesuai dengan kluster yang dipilih.',
            ]);
        }

        if ((int) $poktan->kode_cluster !== (int) $validated['kode_cluster']) {
            throw ValidationException::withMessages([
                'kode_poktan' => 'Kelompok tani tidak sesuai dengan kluster yang dipilih.',
            ]);
        }

        if ((int) $poktan->kode_kota !== (int) $cluster->kode_kota) {
            throw ValidationException::withMessages([
                'kode_poktan' => 'Kelompok tani tidak sesuai dengan Kab/Kota kluster.',
            ]);
        }

        $validated['kode_kota'] = (int) $poktan->kode_kota;
        unset($validated['kode_cluster']);

        return $validated;
    }
}
