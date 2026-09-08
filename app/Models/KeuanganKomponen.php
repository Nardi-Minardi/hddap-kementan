<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KeuanganKomponen extends Model
{
    protected $table = 'tr_keuangan_komponen';

    protected $fillable = [
        'kode_componen',
        'kode_sub',
        'nama_sub_komponen',
    ];

    public function subKomponen(): HasMany
    {
        return $this->hasMany(KeuanganSubKomponen::class, 'kode_sub', 'kode_sub');
    }
}
