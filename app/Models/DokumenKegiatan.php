<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DokumenKegiatan extends Model
{
    protected $table = 'tr_dokumen_kegiatan';

    protected $fillable = [
        'judul',
        'slug',
        'deskripsi',
        'file_path',
        'cover_path',
        'published_at',
        'is_published',
        'urutan',
        'user_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_published' => 'boolean',
        'urutan' => 'integer',
    ];

    protected $appends = ['file_url', 'cover_url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_published', true)
            ->orderByDesc('urutan')
            ->orderByDesc('published_at')
            ->orderByDesc('id');
    }

    public function getFileUrlAttribute(): string
    {
        return '/storage/'.$this->file_path;
    }

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_path ? '/storage/'.$this->cover_path : null;
    }
}
