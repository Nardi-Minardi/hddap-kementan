<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KabKota extends Model
{
    protected $table = 'm_kab_kota';
    protected $fillable = ['code', 'name', 'provinsi_code'];

    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'provinsi_code', 'code');
    }

    public function kecamatan()
    {
        return $this->hasMany(Kecamatan::class, 'kab_kota_code', 'code');
    }
}
