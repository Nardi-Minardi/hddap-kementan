<?php

namespace App\Models;

use App\Models\Relations\CastBelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poktan extends Model
{
    protected $table = 'm_poktan';

    public $timestamps = false;

    protected $fillable = [
        'kode_kota',
        'kode_cluster',
        'nama_poktan',
        'ketua',
        'telp',
        'alamat',
    ];

    protected $casts = [
        'kode_kota' => 'integer',
        'kode_cluster' => 'integer',
    ];

    public function cluster(): BelongsTo
    {
        return $this->belongsTo(Cluster::class, 'kode_cluster');
    }

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

    public function petani(): HasMany
    {
        return $this->hasMany(Petani::class, 'kode_poktan');
    }
}
