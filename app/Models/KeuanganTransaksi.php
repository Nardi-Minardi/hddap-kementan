<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class KeuanganTransaksi extends Model
{
    protected $table = 'tr_keuangan_transaksi';

    protected $fillable = [
        'kode_transaksi',
        'keuangan_awp_id',
        'no_spm',
        'tgl_spm',
        'nilai_spm',
        'no_sp2d',
        'tgl_sp2d',
        'nilai_sp2d',
        'mekanisme_pembayaran',
        'nilai_realisasi',
        'keterangan',
    ];

    protected function casts(): array
    {
        return [
            'tgl_spm' => 'date',
            'tgl_sp2d' => 'date',
            'nilai_spm' => 'decimal:2',
            'nilai_sp2d' => 'decimal:2',
            'nilai_realisasi' => 'decimal:2',
        ];
    }

    public function awp(): BelongsTo
    {
        return $this->belongsTo(KeuanganAwp::class, 'keuangan_awp_id');
    }

    public function rekonsiliasi(): HasOne
    {
        return $this->hasOne(KeuanganRekonsiliasi::class, 'keuangan_transaksi_id');
    }

    /** Nilai yang dipakai untuk monitoring realisasi = nilai SP2D. */
    public function nilaiRealisasiMonitoring(): float
    {
        return (float) $this->nilai_sp2d;
    }
}
