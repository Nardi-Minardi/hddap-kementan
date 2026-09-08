<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KeuanganAwp extends Model
{
    protected $table = 'tr_keuangan_awp';

    protected $fillable = [
        'kode_awp',
        'nama_awp',
        'component',
        'sub_component',
        'kode_owp',
        'kode_pok',
        'uraian_kegiatan',
        'kode_akun',
        'pagu',
        'sumber_dana',
    ];

    protected function casts(): array
    {
        return [
            'pagu' => 'decimal:2',
        ];
    }

    public function transaksi(): HasMany
    {
        return $this->hasMany(KeuanganTransaksi::class, 'keuangan_awp_id');
    }
}
