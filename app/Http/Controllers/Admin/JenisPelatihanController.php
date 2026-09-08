<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cluster;
use App\Models\JenisPelatihan;
use App\Models\KabKota;
use App\Models\Pelatihan;
use App\Models\PesertaJenisPelatihan;
use App\Models\Petani;
use App\Models\Poktan;
use App\Services\ActivityLogger;
use App\Services\UserScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JenisPelatihanController extends Controller
{
    public function index(Request $request): Response
    {
        $scope = UserScopeService::current();

        $query = JenisPelatihan::query()
            ->with([
                'kabKota:id,code,name',
                'pelatihanTopik:kd_pelatihan,komponen,nama_kegiatan,kode_owp',
            ])
            ->withCount([
                'peserta as jumlah_peserta',
                'peserta as jumlah_laki_laki' => fn ($pesertaQuery) => $pesertaQuery->where('jenis_kelamin', 'L'),
                'peserta as jumlah_perempuan' => fn ($pesertaQuery) => $pesertaQuery->where('jenis_kelamin', 'P'),
            ])
            ->orderByDesc('tanggal_mulai')
            ->orderBy('kdjenis');

        $scope->applyKabKotaScope($query);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kdjenis', 'ilike', "%{$search}%")
                    ->orWhere('jenis_pelatihan', 'ilike', "%{$search}%")
                    ->orWhere('nama_pelatihan', 'ilike', "%{$search}%")
                    ->orWhere('metode_acara', 'ilike', "%{$search}%")
                    ->orWhere('kategori', 'ilike', "%{$search}%")
                    ->orWhere('topik', 'ilike', "%{$search}%");
            });
        }

        return Inertia::render('Admin/DataVerval/JenisPelatihan/Index', [
            'jenisPelatihan' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        $scope = UserScopeService::current();

        return Inertia::render('Admin/DataVerval/JenisPelatihan/Create', [
            'provinsis' => $scope->provinsiOptions(),
            'topikOptions' => $this->topikOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->prepareValidated($request->validate($this->validationRules()));

        $jenisPelatihan = JenisPelatihan::create($validated);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat jenis pelatihan: {$validated['nama_pelatihan']}",
            metadata: $validated,
        );

        return redirect()->route('admin.data-verval.jenis-pelatihan.edit', $jenisPelatihan)
            ->with('success', 'Event berhasil dibuat. Silakan tambahkan peserta pelatihan.')
            ->with('focus_peserta', true);
    }

    public function edit(JenisPelatihan $jenisPelatihan): Response
    {
        $this->ensureCanAccessJenisPelatihan($jenisPelatihan);

        $jenisPelatihan->load([
            'peserta' => fn ($query) => $query->with('petani:id,nama_petani'),
        ]);

        return Inertia::render('Admin/DataVerval/JenisPelatihan/Edit', [
            'jenisPelatihan' => $jenisPelatihan,
            'provinsis' => UserScopeService::current()->provinsiOptions(),
            'topikOptions' => $this->topikOptions(),
            'peserta' => $jenisPelatihan->peserta,
        ]);
    }

    public function update(Request $request, JenisPelatihan $jenisPelatihan): RedirectResponse
    {
        $this->ensureCanAccessJenisPelatihan($jenisPelatihan);

        $validated = $this->prepareValidated($request->validate($this->validationRules()));

        $jenisPelatihan->update($validated);

        ActivityLogger::log(
            aksi: 'update',
            deskripsi: "Memperbarui jenis pelatihan: {$jenisPelatihan->nama_pelatihan}",
            subject: $jenisPelatihan,
        );

        return redirect()->route('admin.data-verval.jenis-pelatihan.edit', $jenisPelatihan)
            ->with('success', 'Event berhasil diperbarui.');
    }

    public function destroy(JenisPelatihan $jenisPelatihan): RedirectResponse
    {
        $this->ensureCanAccessJenisPelatihan($jenisPelatihan);

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

    public function searchPetani(Request $request, JenisPelatihan $jenisPelatihan): JsonResponse
    {
        $this->ensureCanAccessJenisPelatihan($jenisPelatihan);

        $request->validate([
            'search' => 'nullable|string|max:100',
            'provinsi_code' => 'nullable|string|exists:m_provinsi,code',
            'kode_kota' => 'nullable|integer|exists:m_kab_kota,code',
            'kode_cluster' => 'nullable|integer|exists:m_cluster,id',
            'kode_poktan' => 'nullable|integer|exists:m_poktan,id',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:5|max:50',
        ]);

        $scope = UserScopeService::current();
        $query = Petani::query()
            ->dukunganProyek()
            ->with([
                'kabKota:id,code,name,provinsi_code',
                'kabKota.provinsi:id,code,name',
                'poktan:id,kode_kota',
                'poktan.kabKota:id,code,name,provinsi_code',
                'poktan.kabKota.provinsi:id,code,name',
            ])
            ->orderBy('nama_petani');

        $scope->applyHddapPetaniScope($query);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_petani', 'ilike', "%{$search}%")
                    ->orWhere('nik_petani', 'ilike', "%{$search}%")
                    ->orWhere('no_hp_petani', 'ilike', "%{$search}%");

                if (is_numeric($search)) {
                    $q->orWhere('id', (int) $search);
                }
            });
        }

        if ($request->filled('kode_kota')) {
            $kodeKota = (int) $request->kode_kota;
            $scope->ensureCanAccessKabKota($kodeKota);

            $query->where(function ($q) use ($kodeKota) {
                $q->where('kode_kota', $kodeKota)
                    ->orWhere(function ($inner) use ($kodeKota) {
                        $inner->whereNull('kode_kota')
                            ->whereHas('poktan', fn ($poktanQuery) => $poktanQuery->where('kode_kota', $kodeKota));
                    });
            });
        } elseif ($request->filled('provinsi_code')) {
            $kabKotaCodes = KabKota::query()
                ->where('provinsi_code', $request->provinsi_code)
                ->whereIn('code', $scope->allowedKabKotaCodes())
                ->pluck('code');

            if ($kabKotaCodes->isEmpty()) {
                return response()->json([
                    'data' => [],
                    'meta' => [
                        'current_page' => 1,
                        'last_page' => 1,
                        'per_page' => (int) ($request->per_page ?? 50),
                        'total' => 0,
                    ],
                ]);
            }

            $query->where(function ($q) use ($kabKotaCodes) {
                $q->whereIn('kode_kota', $kabKotaCodes)
                    ->orWhere(function ($inner) use ($kabKotaCodes) {
                        $inner->whereNull('kode_kota')
                            ->whereHas('poktan', fn ($poktanQuery) => $poktanQuery->whereIn('kode_kota', $kabKotaCodes));
                    });
            });
        }

        if ($request->filled('kode_poktan')) {
            $query->where('kode_poktan', (int) $request->kode_poktan);
        } elseif ($request->filled('kode_cluster')) {
            $query->whereHas('poktan', fn ($poktanQuery) => $poktanQuery->where('kode_cluster', (int) $request->kode_cluster));
        }

        $registeredPetaniIds = PesertaJenisPelatihan::query()
            ->where('kdjenis', $jenisPelatihan->kdjenis)
            ->where('tipe_peserta', PesertaJenisPelatihan::TIPE_PETANI)
            ->whereNotNull('m_petani_id')
            ->pluck('m_petani_id');

        if ($registeredPetaniIds->isNotEmpty()) {
            $query->whereNotIn('id', $registeredPetaniIds);
        }

        $perPage = (int) ($request->per_page ?? 50);
        $paginator = $query->paginate($perPage);

        $data = $paginator->getCollection()->map(function (Petani $petani) {
            $kabKota = $petani->kabKota ?? $petani->poktan?->kabKota;

            return [
                'id' => $petani->id,
                'nik' => $petani->nik_petani ?: '-',
                'nama' => $petani->nama_petani,
                'jenis_kelamin' => $petani->gender_petani,
                'umur' => $petani->usia_petani,
                'kabupaten' => $kabKota?->name ?: '-',
            ];
        });

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
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

    public function poktanByFilters(Request $request): JsonResponse
    {
        $request->validate([
            'kode_kota' => 'nullable|integer|exists:m_kab_kota,code',
            'kode_cluster' => 'nullable|integer|exists:m_cluster,id',
        ]);

        $scope = UserScopeService::current();
        $query = Poktan::query()->orderBy('nama_poktan');

        if ($request->filled('kode_kota')) {
            $scope->ensureCanAccessKabKota((int) $request->kode_kota);
            $query->where('kode_kota', (int) $request->kode_kota);
        } else {
            $scope->applyKabKotaScope($query);
        }

        if ($request->filled('kode_cluster')) {
            $query->where('kode_cluster', (int) $request->kode_cluster);
        }

        $data = $query->get(['id', 'nama_poktan']);

        return response()->json($data);
    }

    public function storePeserta(Request $request, JenisPelatihan $jenisPelatihan): RedirectResponse
    {
        $this->ensureCanAccessJenisPelatihan($jenisPelatihan);

        $validated = $request->validate([
            'tipe_peserta' => 'required|in:'.implode(',', array_keys(PesertaJenisPelatihan::TIPE_OPTIONS)),
            'm_petani_id' => 'nullable|integer|exists:m_petani,id',
            'm_petani_ids' => 'nullable|array|min:1',
            'm_petani_ids.*' => 'integer|exists:m_petani,id',
            'nama' => 'nullable|string|max:150',
            'nik' => 'nullable|string|max:16',
            'alamat' => 'nullable|string|max:500',
            'umur' => 'nullable|integer|min:1|max:120',
            'jenis_kelamin' => 'nullable|in:L,P',
            'no_hp' => 'nullable|string|max:20',
        ]);

        if ($validated['tipe_peserta'] === PesertaJenisPelatihan::TIPE_PETANI) {
            if ($request->filled('m_petani_ids')) {
                $bulkValidated = $request->validate([
                    'm_petani_ids' => 'required|array|min:1',
                    'm_petani_ids.*' => 'integer|exists:m_petani,id',
                ]);

                $added = 0;

                foreach ($bulkValidated['m_petani_ids'] as $petaniId) {
                    $exists = PesertaJenisPelatihan::query()
                        ->where('kdjenis', $jenisPelatihan->kdjenis)
                        ->where('m_petani_id', $petaniId)
                        ->exists();

                    if ($exists) {
                        continue;
                    }

                    $petani = Petani::findOrFail($petaniId);

                    PesertaJenisPelatihan::create([
                        'kdjenis' => $jenisPelatihan->kdjenis,
                        'tipe_peserta' => PesertaJenisPelatihan::TIPE_PETANI,
                        'm_petani_id' => $petani->id,
                        'nama' => $petani->nama_petani,
                        'nik' => $petani->nik_petani,
                        'alamat' => $petani->alamat_petani,
                        'umur' => $petani->usia_petani,
                        'jenis_kelamin' => $petani->gender_petani,
                        'no_hp' => $petani->no_hp_petani,
                    ]);

                    $added++;
                }

                if ($added === 0) {
                    return back()->withErrors(['m_petani_ids' => 'Petani yang dipilih sudah terdaftar sebagai peserta.']);
                }

                ActivityLogger::log(
                    aksi: 'create',
                    deskripsi: "Menambah {$added} peserta petani pada jenis pelatihan: {$jenisPelatihan->nama_pelatihan}",
                    subject: $jenisPelatihan,
                );

                return back()->with('success', "{$added} peserta petani berhasil ditambahkan.");
            }

            $request->validate([
                'm_petani_id' => 'required|integer|exists:m_petani,id',
            ]);

            $exists = PesertaJenisPelatihan::query()
                ->where('kdjenis', $jenisPelatihan->kdjenis)
                ->where('m_petani_id', $validated['m_petani_id'])
                ->exists();

            if ($exists) {
                return back()->withErrors(['m_petani_id' => 'Petani ini sudah terdaftar sebagai peserta.']);
            }

            $petani = Petani::findOrFail($validated['m_petani_id']);

            PesertaJenisPelatihan::create([
                'kdjenis' => $jenisPelatihan->kdjenis,
                'tipe_peserta' => PesertaJenisPelatihan::TIPE_PETANI,
                'm_petani_id' => $petani->id,
                'nama' => $petani->nama_petani,
                'nik' => $petani->nik_petani,
                'alamat' => $petani->alamat_petani,
                'umur' => $petani->usia_petani,
                'jenis_kelamin' => $petani->gender_petani,
                'no_hp' => $petani->no_hp_petani,
            ]);
        } else {
            $manualData = $request->validate([
                'nama' => 'required|string|max:150',
                'nik' => 'nullable|string|max:16',
                'alamat' => 'nullable|string|max:500',
                'umur' => 'nullable|integer|min:1|max:120',
                'jenis_kelamin' => 'nullable|in:L,P',
                'no_hp' => 'nullable|string|max:20',
            ]);

            PesertaJenisPelatihan::create([
                'kdjenis' => $jenisPelatihan->kdjenis,
                'tipe_peserta' => $validated['tipe_peserta'],
                'nama' => $manualData['nama'],
                'nik' => $manualData['nik'] ?? null,
                'alamat' => $manualData['alamat'] ?? null,
                'umur' => $manualData['umur'] ?? null,
                'jenis_kelamin' => $manualData['jenis_kelamin'] ?? null,
                'no_hp' => $manualData['no_hp'] ?? null,
            ]);
        }

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Menambah peserta jenis pelatihan: {$jenisPelatihan->nama_pelatihan}",
            subject: $jenisPelatihan,
        );

        return back()->with('success', 'Peserta berhasil ditambahkan.');
    }

    public function destroyPeserta(JenisPelatihan $jenisPelatihan, PesertaJenisPelatihan $peserta): RedirectResponse
    {
        $this->ensureCanAccessJenisPelatihan($jenisPelatihan);

        if ($peserta->kdjenis !== $jenisPelatihan->kdjenis) {
            abort(404);
        }

        $namaPeserta = $peserta->nama;
        $peserta->delete();

        ActivityLogger::log(
            aksi: 'delete',
            deskripsi: "Menghapus peserta {$namaPeserta} dari jenis pelatihan: {$jenisPelatihan->nama_pelatihan}",
            subject: $jenisPelatihan,
        );

        return back()->with('success', 'Peserta berhasil dihapus.');
    }

    /**
     * @return array<string, string>
     */
    private function validationRules(): array
    {
        return [
            'kd_pelatihan' => 'required|integer|exists:tr_pelatihan,kd_pelatihan',
            'nama_pelatihan' => 'required|string|max:100',
            'metode_acara' => 'required|string|max:50',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'provinsi_code' => 'nullable|string|max:10|exists:m_provinsi,code',
            'kode_kota' => 'nullable|integer|exists:m_kab_kota,code',
            'gedung' => 'nullable|string|max:150',
            'kategori' => 'nullable|string|max:100',
            'topik' => 'nullable|string|max:100',
            'subtopik' => 'nullable|string|max:100',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_berakhir' => 'nullable|date|after_or_equal:tanggal_mulai',
            'waktu_mulai' => 'nullable|string|max:5',
            'waktu_berakhir' => 'nullable|string|max:5',
        ];
    }

    private function topikOptions(): array
    {
        return Pelatihan::query()
            ->orderBy('kode_owp')
            ->get(['kd_pelatihan', 'komponen', 'nama_kegiatan', 'kode_owp'])
            ->map(fn (Pelatihan $item) => [
                'value' => $item->kd_pelatihan,
                'label' => "{$item->kode_owp} — {$item->nama_kegiatan}",
                'komponen' => $item->komponen,
                'kode_owp' => $item->kode_owp,
            ])
            ->values()
            ->all();
    }

    private function prepareValidated(array $validated): array
    {
        if (! empty($validated['kode_kota'])) {
            UserScopeService::current()->ensureCanAccessKabKota($validated['kode_kota']);
        }

        $pelatihan = Pelatihan::query()->find($validated['kd_pelatihan']);

        if ($pelatihan !== null) {
            $validated['jenis_pelatihan'] = mb_substr($pelatihan->nama_kegiatan, 0, 100);
            $validated['topik'] = $pelatihan->kode_owp;
            $validated['kategori'] = $pelatihan->komponen;
        }

        return $validated;
    }

    private function ensureCanAccessJenisPelatihan(JenisPelatihan $jenisPelatihan): void
    {
        if ($jenisPelatihan->kode_kota === null) {
            return;
        }

        UserScopeService::current()->ensureCanAccessKabKota($jenisPelatihan->kode_kota);
    }
}
