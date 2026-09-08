<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Services\ActivityLogger;
use App\Services\UserScopeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class BeritaController extends Controller
{
    private const FOTO_KEGIATAN_SLOTS = 5;

    public function index(Request $request): Response
    {
        $scope = UserScopeService::current();

        $query = Berita::query()
            ->with('kabKota:id,code,name')
            ->orderByDesc('urutan')
            ->orderByDesc('published_at')
            ->orderByDesc('id');

        $scope->applyKabKotaScope($query);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'ilike', "%{$search}%")
                    ->orWhere('ringkasan', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('is_published')) {
            $query->where('is_published', $request->is_published === '1');
        }

        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }

        return Inertia::render('Admin/Berita/Index', [
            'berita' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only('search', 'is_published', 'tipe'),
            'tipeOptions' => $this->tipeOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Berita/Create', [
            'tipeOptions' => $this->tipeOptions(),
            ...$this->formScopeProps(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateBerita($request);
        unset($validated['image']);
        $validated['slug'] = $this->uniqueSlug($validated['judul']);
        $validated['image_url'] = $this->resolveImageUrl($request);
        $validated['foto_kegiatan'] = $this->syncFotoKegiatan($request);
        $validated['user_id'] = $request->user()?->id;
        $validated['kode_kota'] = $this->resolveKodeKota($validated['kode_kota'] ?? null);

        $berita = Berita::create($validated);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat berita: {$berita->judul}",
            subject: $berita,
        );

        return redirect()->route('admin.berita.index')
            ->with('success', 'Berita berhasil ditambahkan.');
    }

    public function edit(Berita $berita): Response
    {
        $this->ensureCanAccessBerita($berita);

        return Inertia::render('Admin/Berita/Edit', [
            'berita' => $berita->load('kabKota:id,code,name'),
            'tipeOptions' => $this->tipeOptions(),
            ...$this->formScopeProps(),
        ]);
    }

    public function update(Request $request, Berita $berita): RedirectResponse
    {
        $this->ensureCanAccessBerita($berita);

        $validated = $this->validateBerita($request, $berita);
        unset($validated['image']);
        $validated['kode_kota'] = $this->resolveKodeKota($validated['kode_kota'] ?? null);

        if ($validated['judul'] !== $berita->judul) {
            $validated['slug'] = $this->uniqueSlug($validated['judul'], $berita->id);
        }

        if ($request->hasFile('image')) {
            $this->deleteStoredImage($berita->image_url);
            $validated['image_url'] = $this->resolveImageUrl($request);
        } else {
            unset($validated['image_url']);
        }

        $validated['foto_kegiatan'] = $this->syncFotoKegiatan($request, $berita);

        $berita->update($validated);

        ActivityLogger::log(
            aksi: 'update',
            deskripsi: "Memperbarui berita: {$berita->judul}",
            subject: $berita,
        );

        return redirect()->route('admin.berita.index')
            ->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Berita $berita): RedirectResponse
    {
        $this->ensureCanAccessBerita($berita);

        $judul = $berita->judul;
        $this->deleteStoredImage($berita->image_url);
        $this->deleteFotoKegiatan($berita->foto_kegiatan);
        $berita->delete();

        ActivityLogger::log(
            aksi: 'delete',
            deskripsi: "Menghapus berita: {$judul}",
        );

        return redirect()->route('admin.berita.index')
            ->with('success', 'Berita berhasil dihapus.');
    }

    /** @return array<string, mixed> */
    private function validateBerita(Request $request, ?Berita $berita = null): array
    {
        $imageRule = $berita
            ? 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096'
            : 'required_without:image_url|nullable|image|mimes:jpeg,jpg,png,webp|max:4096';

        $rules = [
            'judul' => 'required|string|max:255',
            'tipe' => 'required|in:berita,agenda',
            'kode_kota' => [
                Rule::requiredIf(fn () => ! UserScopeService::current()->isPusat()),
                'nullable',
                'integer',
                'exists:m_kab_kota,code',
            ],
            'ringkasan' => 'nullable|string|max:500',
            'konten' => 'nullable|string',
            'image' => $imageRule,
            'image_url' => 'nullable|url|max:500',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
            'urutan' => 'nullable|integer|min:0|max:9999',
            'foto_kegiatan_remove' => 'nullable|array|max:5',
            'foto_kegiatan_remove.*' => 'nullable|boolean',
        ];

        for ($i = 0; $i < self::FOTO_KEGIATAN_SLOTS; $i++) {
            $rules["foto_kegiatan.{$i}"] = 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096';
        }

        $validated = $request->validate($rules, [
            'image.required_without' => 'Upload gambar cover atau isi URL gambar.',
            'kode_kota.required' => 'Kab/Kota wajib dipilih.',
        ]);

        $validated['is_published'] = (bool) ($validated['is_published'] ?? false);
        $validated['urutan'] = (int) ($validated['urutan'] ?? 0);
        $validated['tipe'] = $validated['tipe'] ?? Berita::TIPE_BERITA;

        return $validated;
    }

    /** @return list<array{value: string, label: string}> */
    private function tipeOptions(): array
    {
        return [
            ['value' => Berita::TIPE_BERITA, 'label' => 'Berita'],
            ['value' => Berita::TIPE_AGENDA, 'label' => 'Agenda'],
        ];
    }

    private function resolveImageUrl(Request $request): string
    {
        if ($request->hasFile('image')) {
            return $this->storePublicImage($request->file('image'));
        }

        return (string) $request->input('image_url');
    }

    /** @return array<int, string|null> */
    private function syncFotoKegiatan(Request $request, ?Berita $berita = null): array
    {
        $slots = $this->normalizeFotoKegiatanSlots($berita?->foto_kegiatan);
        $removeFlags = $request->input('foto_kegiatan_remove', []);

        for ($i = 0; $i < self::FOTO_KEGIATAN_SLOTS; $i++) {
            if (filter_var($removeFlags[$i] ?? false, FILTER_VALIDATE_BOOLEAN)) {
                $this->deleteStoredImage($slots[$i]);
                $slots[$i] = null;
            }

            $uploaded = $request->file("foto_kegiatan.{$i}")
                ?? ($request->file('foto_kegiatan')[$i] ?? null);

            if ($uploaded) {
                $this->deleteStoredImage($slots[$i]);
                $slots[$i] = $this->storePublicImage($uploaded);
            }
        }

        return $slots;
    }

    /** @param array<int, string|null>|null $fotoKegiatan */
    private function normalizeFotoKegiatanSlots(?array $fotoKegiatan): array
    {
        $slots = array_values($fotoKegiatan ?? []);
        $slots = array_pad($slots, self::FOTO_KEGIATAN_SLOTS, null);

        return array_slice($slots, 0, self::FOTO_KEGIATAN_SLOTS);
    }

    /** @param array<int, string|null>|null $fotoKegiatan */
    private function deleteFotoKegiatan(?array $fotoKegiatan): void
    {
        foreach ($this->normalizeFotoKegiatanSlots($fotoKegiatan) as $url) {
            $this->deleteStoredImage($url);
        }
    }

    private function storePublicImage(UploadedFile $file): string
    {
        $path = $file->store('berita', 'public');

        return '/storage/'.$path;
    }

    private function uniqueSlug(string $judul, ?int $ignoreId = null): string
    {
        $base = Str::slug($judul) ?: 'berita';
        $slug = $base;
        $counter = 1;

        while (Berita::query()
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    private function deleteStoredImage(?string $imageUrl): void
    {
        if ($imageUrl === null || ! str_starts_with($imageUrl, '/storage/')) {
            return;
        }

        $path = Str::after($imageUrl, '/storage/');
        Storage::disk('public')->delete($path);
    }

    /**
     * @return array{showKabKota: bool, kabKotaOptions: list<array{value: int, label: string}>, defaultKodeKota: int|null}
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

    private function resolveKodeKota(int|string|null $kodeKota): ?int
    {
        $scope = UserScopeService::current();
        $props = $this->formScopeProps();

        if ($kodeKota === null || $kodeKota === '') {
            if ($props['defaultKodeKota'] !== null) {
                return $props['defaultKodeKota'];
            }

            if ($scope->isPusat()) {
                return null;
            }

            throw new AccessDeniedHttpException('Kab/Kota wajib dipilih.');
        }

        $scope->ensureCanAccessKabKota($kodeKota);

        return (int) $kodeKota;
    }

    private function ensureCanAccessBerita(Berita $berita): void
    {
        if ($berita->kode_kota === null) {
            if (UserScopeService::current()->isPusat()) {
                return;
            }

            throw new AccessDeniedHttpException('Anda tidak memiliki akses ke berita/agenda ini.');
        }

        UserScopeService::current()->ensureCanAccessKabKota($berita->kode_kota);
    }
}
