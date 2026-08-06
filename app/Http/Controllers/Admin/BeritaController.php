<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Berita::query()
            ->orderByDesc('urutan')
            ->orderByDesc('published_at')
            ->orderByDesc('id');

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
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateBerita($request);
        unset($validated['image']);
        $validated['slug'] = $this->uniqueSlug($validated['judul']);
        $validated['image_url'] = $this->resolveImageUrl($request);
        $validated['user_id'] = $request->user()?->id;

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
        return Inertia::render('Admin/Berita/Edit', [
            'berita' => $berita,
            'tipeOptions' => $this->tipeOptions(),
        ]);
    }

    public function update(Request $request, Berita $berita): RedirectResponse
    {
        $validated = $this->validateBerita($request, $berita);
        unset($validated['image']);

        if ($validated['judul'] !== $berita->judul) {
            $validated['slug'] = $this->uniqueSlug($validated['judul'], $berita->id);
        }

        if ($request->hasFile('image')) {
            $this->deleteStoredImage($berita->image_url);
            $validated['image_url'] = $this->resolveImageUrl($request);
        } else {
            unset($validated['image_url']);
        }

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
        $judul = $berita->judul;
        $this->deleteStoredImage($berita->image_url);
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

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'tipe' => 'required|in:berita,agenda',
            'ringkasan' => 'nullable|string|max:500',
            'konten' => 'nullable|string',
            'image' => $imageRule,
            'image_url' => 'nullable|url|max:500',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
            'urutan' => 'nullable|integer|min:0|max:9999',
        ], [
            'image.required_without' => 'Upload gambar atau isi URL gambar.',
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
            $path = $request->file('image')->store('berita', 'public');

            return '/storage/'.$path;
        }

        return (string) $request->input('image_url');
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
}
