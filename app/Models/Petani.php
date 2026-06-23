<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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
    ];

    protected $casts = [
        'difabel' => 'boolean',
    ];

    public function kkPetani(): HasMany
    {
        return $this->hasMany(KkPetani::class, 'm_petani_id');
    }
}
