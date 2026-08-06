<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Cluster extends Model
{
    protected $table = 'm_cluster';

    public $timestamps = false;

    protected $fillable = [
        'kode_kota',
        'nama_kota',
        'nama_cluster',
        'kode_kumoditas',
    ];

    protected $casts = [
        'kode_kota' => 'integer',
        'kode_kumoditas' => 'integer',
    ];

    public function kumoditas(): BelongsTo
    {
        return $this->belongsTo(Kumoditas::class, 'kode_kumoditas');
    }

    public function jenisKumoditas(): HasOneThrough
    {
        return $this->hasOneThrough(
            JnsKumoditas::class,
            Kumoditas::class,
            'id',
            'id',
            'kode_kumoditas',
            'kodejns',
        );
    }
}
