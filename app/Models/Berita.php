<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Berita extends Model
{
    public const TIPE_BERITA = 'berita';

    public const TIPE_AGENDA = 'agenda';

    protected $table = 'tr_berita';

    protected $fillable = [
        'judul',
        'slug',
        'tipe',
        'ringkasan',
        'konten',
        'image_url',
        'published_at',
        'is_published',
        'user_id',
        'urutan',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_published' => 'boolean',
        'urutan' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isAgenda(): bool
    {
        return $this->tipe === self::TIPE_AGENDA;
    }
}
