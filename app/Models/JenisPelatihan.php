<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisPelatihan extends Model
{
    protected $table = 'tr_jns_pelatihan';

    protected $primaryKey = 'kdjenis';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'kdjenis',
        'kd_pelatihan',
        'jenis_pelatihan',
        'nama_pelatihan',
        'metode_acara',
        'latitude',
        'longitude',
        'provinsi_code',
        'kode_kota',
        'gedung',
        'kategori',
        'topik',
        'subtopik',
        'tanggal_mulai',
        'tanggal_berakhir',
        'waktu_mulai',
        'waktu_berakhir',
    ];

    protected $casts = [
        'kd_pelatihan' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
        'kode_kota' => 'integer',
        'tanggal_mulai' => 'date:Y-m-d',
        'tanggal_berakhir' => 'date:Y-m-d',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (! empty($model->kdjenis)) {
                return;
            }

            $lastCode = static::query()
                ->selectRaw("MAX(CAST(kdjenis AS INTEGER)) as max_code")
                ->value('max_code');

            $next = ((int) ($lastCode ?? 0)) + 1;
            $model->kdjenis = str_pad((string) $next, 10, '0', STR_PAD_LEFT);
        });
    }

    public function pelatihanTopik(): BelongsTo
    {
        return $this->belongsTo(Pelatihan::class, 'kd_pelatihan', 'kd_pelatihan');
    }

    public function kabKota(): BelongsTo
    {
        return $this->belongsTo(KabKota::class, 'kode_kota', 'code');
    }

    public function provinsi(): BelongsTo
    {
        return $this->belongsTo(Provinsi::class, 'provinsi_code', 'code');
    }

    public function peserta(): HasMany
    {
        return $this->hasMany(PesertaJenisPelatihan::class, 'kdjenis', 'kdjenis')
            ->orderBy('id');
    }
}
