<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    protected $table = 'm_kecamatan';
    protected $fillable = ['code', 'name', 'kab_kota_code'];

    public function kabKota()
    {
        return $this->belongsTo(KabKota::class, 'kab_kota_code', 'code');
    }

    public function kelDes()
    {
        return $this->hasMany(KelDes::class, 'kecamatan_code', 'code');
    }
}
