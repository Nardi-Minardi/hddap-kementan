<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Database\Eloquent\Collection;

class BeritaController extends Controller
{
    public function published(): Collection
    {
        return Berita::query()
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->get(['id', 'judul', 'slug', 'ringkasan', 'konten', 'image_url', 'published_at']);
    }
}
