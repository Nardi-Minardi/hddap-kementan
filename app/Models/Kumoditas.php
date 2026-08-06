<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kumoditas extends Model
{
    protected $table = 'm_kumoditas';

    public $timestamps = false;

    protected $fillable = [
        'kodejns',
        'kumoditas',
        'keterangan',
    ];

    protected $casts = [
        'kodejns' => 'integer',
    ];

    public function jenisKumoditas(): BelongsTo
    {
        return $this->belongsTo(JnsKumoditas::class, 'kodejns');
    }
}
