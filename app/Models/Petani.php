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
        'kode_kota',
        'kode_poktan',
        'jmlah_petani',
        'Tahap',
    ];

    protected $casts = [
        'difabel' => 'boolean',
        'kode_kota' => 'integer',
        'kode_poktan' => 'integer',
        'jmlah_petani' => 'integer',
    ];

    public function kkPetani(): HasMany
    {
        return $this->hasMany(KkPetani::class, 'm_petani_id');
    }

    public function poktan(): BelongsTo
    {
        return $this->belongsTo(Poktan::class, 'kode_poktan');
    }

    public function scopeWithCoordinates($query)
    {
        return $query
            ->whereNotNull('Latitude')
            ->whereNotNull('Longitude');
    }

    public function scopeDukunganProyek($query)
    {
        return $query->where('jmlah_petani', 1);
    }
}
