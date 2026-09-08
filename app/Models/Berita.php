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
        'kode_kota',
        'ringkasan',
        'konten',
        'image_url',
        'foto_kegiatan',
        'published_at',
        'is_published',
        'user_id',
        'urutan',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_published' => 'boolean',
        'urutan' => 'integer',
        'kode_kota' => 'integer',
        'foto_kegiatan' => 'array',
    ];

    public function kabKota(): BelongsTo
    {
        return $this->belongsTo(KabKota::class, 'kode_kota', 'code');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isAgenda(): bool
    {
        return $this->tipe === self::TIPE_AGENDA;
    }
}
