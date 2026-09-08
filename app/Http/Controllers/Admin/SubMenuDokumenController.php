<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubMenuDokumen;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SubMenuDokumenController extends Controller
{
    public function index(Request $request): Response
    {
        $query = SubMenuDokumen::query()
            ->withCount('dokumen')
            ->orderByDesc('urutan')
            ->orderBy('nama');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nama', 'ilike', "%{$search}%");
        }

        return Inertia::render('Admin/SubMenuDokumen/Index', [
            'subMenus' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/SubMenuDokumen/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateSubMenu($request);
        $validated['slug'] = $this->uniqueSlug($validated['nama']);

        $subMenu = SubMenuDokumen::create($validated);

        ActivityLogger::log(
            aksi: 'create',
            deskripsi: "Membuat sub menu dokumen: {$subMenu->nama}",
            subject: $subMenu,
        );

        return redirect()->route('admin.sub-menu-dokumen.index')
            ->with('success', 'Sub menu dokumen berhasil ditambahkan.');
    }

    public function edit(SubMenuDokumen $subMenuDokuman): Response
    {
        return Inertia::render('Admin/SubMenuDokumen/Edit', [
            'subMenu' => $subMenuDokuman,
        ]);
    }

    public function update(Request $request, SubMenuDokumen $subMenuDokuman): RedirectResponse
    {
        $validated = $this->validateSubMenu($request);

        if ($validated['nama'] !== $subMenuDokuman->nama) {
            $validated['slug'] = $this->uniqueSlug($validated['nama'], $subMenuDokuman->id);
        }

        $subMenuDokuman->update($validated);

        ActivityLogger::log(
            aksi: 'update',
            deskripsi: "Memperbarui sub menu dokumen: {$subMenuDokuman->nama}",
            subject: $subMenuDokuman,
        );

        return redirect()->route('admin.sub-menu-dokumen.index')
            ->with('success', 'Sub menu dokumen berhasil diperbarui.');
    }

    public function destroy(SubMenuDokumen $subMenuDokuman): RedirectResponse
    {
        if ($subMenuDokuman->dokumen()->exists()) {
            return redirect()->route('admin.sub-menu-dokumen.index')
                ->with('error', 'Sub menu masih memiliki dokumen. Pindahkan atau hapus dokumen terlebih dahulu.');
        }

        $nama = $subMenuDokuman->nama;
        $subMenuDokuman->delete();

        ActivityLogger::log(
            aksi: 'delete',
            deskripsi: "Menghapus sub menu dokumen: {$nama}",
        );

        return redirect()->route('admin.sub-menu-dokumen.index')
            ->with('success', 'Sub menu dokumen berhasil dihapus.');
    }

    /** @return array<string, mixed> */
    private function validateSubMenu(Request $request): array
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'urutan' => 'nullable|integer|min:0|max:9999',
            'is_active' => 'boolean',
        ]);

        $validated['urutan'] = (int) ($validated['urutan'] ?? 0);
        $validated['is_active'] = (bool) ($validated['is_active'] ?? true);

        return $validated;
    }

    private function uniqueSlug(string $nama, ?int $ignoreId = null): string
    {
        $base = Str::slug($nama) ?: 'sub-menu';
        $slug = $base;
        $counter = 1;

        while (SubMenuDokumen::query()
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
