<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JnsKumoditas extends Model
{
    protected $table = 'm_jns_kumoditas';

    public $timestamps = false;

    protected $fillable = [
        'jenis_kumoditas',
    ];

    public function kumoditas(): HasMany
    {
        return $this->hasMany(Kumoditas::class, 'kodejns');
    }
}
