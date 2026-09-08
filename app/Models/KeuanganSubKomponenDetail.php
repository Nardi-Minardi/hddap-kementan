<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KeuanganSubKomponenDetail extends Model
{
    protected $table = 'tr_keuangan_sub_kom_d';

    protected $fillable = [
        'kode_pok',
        'kode_owp',
        'nama_komponen_detail',
    ];

    public function subKomponen(): BelongsTo
    {
        return $this->belongsTo(KeuanganSubKomponen::class, 'kode_pok', 'kode_pok');
    }
}
