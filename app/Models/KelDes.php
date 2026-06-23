<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelDes extends Model
{
    protected $table = 'm_kel_des';
    protected $fillable = ['code', 'name', 'kecamatan_code'];

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_code', 'code');
    }
}
