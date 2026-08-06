<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\DokumenKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DokumenKegiatanController extends Controller
{
    public function index(Request $request): Response
    {
        $dokumen = DokumenKegiatan::published()
            ->get(['id', 'judul', 'slug', 'deskripsi', 'file_path', 'cover_path', 'published_at'])
            ->map(fn (DokumenKegiatan $item) => [
                'id' => $item->id,
                'judul' => $item->judul,
                'slug' => $item->slug,
                'deskripsi' => $item->deskripsi,
                'published_at' => $item->published_at,
                'cover_url' => $item->cover_url,
                'file_url' => route('dokumen-kegiatan.file', $item->slug),
            ]);

        $selectedSlug = $request->query('dokumen');
        $selected = $selectedSlug
            ? $dokumen->firstWhere('slug', $selectedSlug)
            : $dokumen->first();

        return Inertia::render('Frontend/DokumenKegiatan/Index', [
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
