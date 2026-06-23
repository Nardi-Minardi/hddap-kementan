<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provinsi extends Model
{
    protected $table = 'm_provinsi';
    protected $fillable = ['code', 'name'];

    public function kabKota()
    {
        return $this->hasMany(KabKota::class, 'provinsi_code', 'code');
    }
}
