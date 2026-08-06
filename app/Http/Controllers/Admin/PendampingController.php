<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendamping;
use App\Services\ActivityLogger;
use App\Services\UserScopeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PendampingController extends Controller
{
    public function index(Request $request): Response
    {
        $scope = UserScopeService::current();
        $query = Pendamping::query()
            ->with('kabKota')
            ->orderByDesc('no');

        if (! $scope->isPusat()) {
            $query->whereIn('kode_kota', $scope->allowedKabKotaCodes());
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_fasilitator', 'ilike', "%{$search}%")
                    ->orWhere('domisili', 'ilike', "%{$search}%")
                    ->orWhere('bidang', 'ilike', "%{$search}%")
                    ->orWhere('pendamping', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('kode_kota')) {
            $scope->ensureCanAccessKabKota($request->kode_kota);
            $query->where('kode_kota', $request->kode_kota);
        }

        if ($request->filled('bidang')) {
            $query->where('bidang', $request->bidang);
        }

        if ($request->filled('pendamping')) {
            $query->where('pendamping', $request->pendamping);
        }

        return Inertia::render('Admin/Pendamping/Index', [
            'pendampingList' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only('search', 'kode_kota', 'bidang', 'pendamping'),
            'kabKotaOptions' => $scope->kabKotaOptions(),
            'bidangOptions' => $this->bidangOptions(),
            'pendampingOptions' => $this->pendampingOptions(),
        ]);
    }

    public function create(): Response
    {
        $scope = UserScopeService::current();

        return Inertia::render('Admin/Pendamping/Create', [
            'kabKotaOptions' => $scope->kabKotaOptions(),
            'bidangOptions' => $this->bidangOptions(),
            'pendampingOptions' => $this->pendampingOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedData($request);
        Pendamping::create($validated);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat data pendamping: {$validated['nama_fasilitator']}",
            metadata: $validated,
        );

        return redirect()->route('admin.pendamping.index')
            ->with('success', 'Data pendamping berhasil dibuat.');
    }

    public function edit(Pendamping $pendamping): Response
    {
        $scope = UserScopeService::current();
        $scope->ensureCanAccessKabKota($pendamping->kode_kota);

        $pendamping->load('kabKota');

        return Inertia::render('Admin/Pendamping/Edit', [
            'pendamping' => $pendamping,
            'kabKotaOptions' => $scope->kabKotaOptions(),
            'bidangOptions' => $this->bidangOptions(),
            'pendampingOptions' => $this->pendampingOptions(),
        ]);
    }

    public function update(Request $request, Pendamping $pendamping): RedirectResponse
    {
        UserScopeService::current()->ensureCanAccessKabKota($pendamping->kode_kota);

        $validated = $this->validatedData($request);
        $pendamping->update($validated);

        ActivityLogger::log(
            aksi: 'update',
            deskripsi: "Memperbarui data pendamping: {$pendamping->nama_fasilitator}",
            subject: $pendamping,
        );

        return redirect()->route('admin.pendamping.index')
            ->with('success', 'Data pendamping berhasil diperbarui.');
    }

    public function destroy(Pendamping $pendamping): RedirectResponse
    {
        UserScopeService::current()->ensureCanAccessKabKota($pendamping->kode_kota);

        $nama = $pendamping->nama_fasilitator;
        $no = $pendamping->no;

        $pendamping->delete();

        ActivityLogger::log(
            aksi: 'delete',
            deskripsi: "Menghapus data pendamping: {$nama}",
            metadata: ['deleted_pendamping_no' => $no],
        );

        return redirect()->route('admin.pendamping.index')
            ->with('success', 'Data pendamping berhasil dihapus.');
    }

    private function validatedData(Request $request): array
    {
        $allowedKabCodes = UserScopeService::current()->allowedKabKotaCodeRules();

        return $request->validate([
            'nama_fasilitator' => 'required|string|max:150',
            'gender' => 'nullable|in:L,P',
            'tanggal_lahir' => 'nullable|date',
            'domisili' => 'nullable|string|max:100',
            'alamat' => 'nullable|string',
            'pendidikan_terakhir' => 'nullable|string|max:150',
            'kode_kota' => ['required', 'string', Rule::in($allowedKabCodes), 'exists:m_kab_kota,code'],
            'bidang' => ['required', 'string', Rule::in(['Pertanian', 'Sipil'])],
            'pendamping' => ['required', 'string', Rule::in(['PMC', 'DIT', 'Fasilitator'])],
        ]);
    }

    private function bidangOptions(): array
    {
        return [
            ['value' => 'Pertanian', 'label' => 'Pertanian'],
            ['value' => 'Sipil', 'label' => 'Sipil'],
        ];
    }

    private function pendampingOptions(): array
    {
        return [
            ['value' => 'PMC', 'label' => 'PMC'],
            ['value' => 'DIT', 'label' => 'DIT'],
            ['value' => 'Fasilitator', 'label' => 'Fasilitator'],
        ];
    }
}
