<?php

namespace App\Models;

use App\Models\Relations\CastBelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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

    public function kabKota(): CastBelongsTo
    {
        return new CastBelongsTo(
            (new KabKota())->newQuery(),
            $this,
            'kode_kota',
            'code',
            'kabKota',
        );
    }

    public function poktan(): HasMany
    {
        return $this->hasMany(Poktan::class, 'kode_cluster');
    }

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
