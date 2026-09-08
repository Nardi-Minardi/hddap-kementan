<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubMenuDokumen extends Model
{
    protected $table = 'm_sub_menu_dokumen';

    protected $fillable = [
        'nama',
        'slug',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'urutan' => 'integer',
        'is_active' => 'boolean',
    ];

    public function dokumen(): HasMany
    {
        return $this->hasMany(DokumenKegiatan::class, 'sub_menu_dokumen_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
