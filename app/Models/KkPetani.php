<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KkPetani extends Model
{
    protected $table = 'm_kk_petani';

    protected $fillable = [
        'm_petani_id',
        'nama',
        'nik',
        'gender',
        'usia',
        'status',
    ];

    public function petani(): BelongsTo
    {
        return $this->belongsTo(Petani::class, 'm_petani_id');
    }
}
