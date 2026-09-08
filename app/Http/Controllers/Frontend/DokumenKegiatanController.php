<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\DokumenKegiatan;
use App\Models\SubMenuDokumen;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DokumenKegiatanController extends Controller
{
    public function index(Request $request): Response
    {
        $subMenus = SubMenuDokumen::query()
            ->active()
            ->orderByDesc('urutan')
            ->orderBy('nama')
            ->get(['id', 'nama', 'slug']);

        $activeSubMenuSlug = $request->query('kategori');
        $activeSubMenu = $activeSubMenuSlug
            ? $subMenus->firstWhere('slug', $activeSubMenuSlug)
            : $subMenus->first();

        $dokumenQuery = DokumenKegiatan::published()
            ->with('subMenu:id,nama,slug');

        if ($activeSubMenu) {
            $dokumenQuery->where('sub_menu_dokumen_id', $activeSubMenu->id);
        }

        $dokumen = $dokumenQuery
            ->get(['id', 'judul', 'slug', 'deskripsi', 'file_path', 'cover_path', 'published_at', 'sub_menu_dokumen_id'])
            ->map(fn (DokumenKegiatan $item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'slug' => $item->slug,
                'deskripsi' => $item->deskripsi,
                'published_at' => $item->published_at,
                'cover_url' => $item->cover_url,
                'file_url' => route('dokumen-kegiatan.file', $item->slug),
                'sub_menu' => $item->subMenu ? [
                    'id' => $item->subMenu->id,
                    'nama' => $item->subMenu->nama,
                    'slug' => $item->subMenu->slug,
                ] : null,
            ]);

        $selectedSlug = $request->query('dokumen');
        $selected = $selectedSlug
            ? $dokumen->firstWhere('slug', $selectedSlug)
            : $dokumen->first();

        return Inertia::render('Frontend/DokumenKegiatan/Index', [
            'subMenus' => $subMenus,
            'activeSubMenu' => $activeSubMenu,
            'dokumen' => $dokumen->values(),
            'selected' => $selected,
        ]);
    }

    public function file(string $slug)
    {
        $dokumen = DokumenKegiatan::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $path = storage_path('app/public/'.$dokumen->file_path);

        if (! is_file($path)) {
            abort(404, 'File PDF tidak ditemukan.');
        }

        $filename = Str::slug($dokumen->judul).'.pdf';

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$filename.'"',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
