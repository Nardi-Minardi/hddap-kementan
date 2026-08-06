<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPelatihan extends Model
{
    protected $table = 'tr_jns_pelatihan';

    protected $primaryKey = 'kdjenis';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'jenis_pelatihan',
        'nama_pelatihan',
    ];
}
