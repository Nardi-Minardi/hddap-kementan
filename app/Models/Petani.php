<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Petani extends Model
{
    protected $table = 'm_petani';

    protected $fillable = [
        'nama_petani',
        'nik_petani',
        'no_hp_petani',
        'gender_petani',
        'usia_petani',
        'difabel',
        'alamat_petani',
        'jmlah_petani',
        'luas_lahan_ha',
        'latitude',
        'longitude',
        'kelas_lereng',
        'kemiringan',
        'fungsi_kws_hutan',
        'tahap',
        'kode_poktan',
        'kode_kota',
        'foto_lahan'
    ];

    protected $casts = [
        'difabel' => 'boolean',
        'kode_kota' => 'integer',
        'kode_poktan' => 'integer',
        'jmlah_petani' => 'integer',
        'luas_lahan_ha' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function kkPetani(): HasMany
    {
        return $this->hasMany(KkPetani::class, 'm_petani_id');
    }

    public function poktan(): BelongsTo
    {
        return $this->belongsTo(Poktan::class, 'kode_poktan');
    }

    public function kabKota(): BelongsTo
    {
        return $this->belongsTo(KabKota::class, 'kode_kota', 'code');
    }

    public function scopeWithCoordinates($query)
    {
        return $query
            ->whereNotNull('latitude')
            ->whereNotNull('longitude');
    }

    public function scopeDukunganProyek($query)
    {
        return $query->where('jmlah_petani', 1);
    }
}
