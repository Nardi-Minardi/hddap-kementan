<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KeuanganSubKomponen extends Model
{
    protected $table = 'tr_keuangan_sub_komponen';

    protected $fillable = [
        'kode_sub',
        'kode_pok',
        'nama_kegiatan_pok',
    ];

    public function komponen(): BelongsTo
    {
        return $this->belongsTo(KeuanganKomponen::class, 'kode_sub', 'kode_sub');
    }

    public function details(): HasMany
    {
        return $this->hasMany(KeuanganSubKomponenDetail::class, 'kode_pok', 'kode_pok');
    }
}
