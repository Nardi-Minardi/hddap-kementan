<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KeuanganRekonsiliasi extends Model
{
    protected $table = 'tr_keuangan_rekonsiliasi';

    protected $fillable = [
        'keuangan_transaksi_id',
        'nilai_hddap',
        'nilai_sakti',
        'nilai_omspan',
        'nilai_bank',
        'selisih',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'nilai_hddap' => 'decimal:2',
            'nilai_sakti' => 'decimal:2',
            'nilai_omspan' => 'decimal:2',
            'nilai_bank' => 'decimal:2',
            'selisih' => 'decimal:2',
        ];
    }

    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(KeuanganTransaksi::class, 'keuangan_transaksi_id');
    }
}
