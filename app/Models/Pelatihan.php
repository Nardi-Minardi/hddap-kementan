<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pelatihan extends Model
{
    protected $table = 'tr_pelatihan';

    protected $primaryKey = 'kd_pelatihan';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
        'kdjenis',
        'tanggal',
        'lokasi',
        'jumlah_jpl',
        'laki_laki',
        'perempuan',
    ];

    protected $appends = [
        'total_peserta',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'kdjenis' => 'integer',
            'jumlah_jpl' => 'integer',
            'laki_laki' => 'integer',
            'perempuan' => 'integer',
        ];
    }

    public function getTotalPesertaAttribute(): int
    {
        return (int) $this->laki_laki + (int) $this->perempuan;
    }

    public function jenisPelatihan(): BelongsTo
    {
        return $this->belongsTo(JenisPelatihan::class, 'kdjenis', 'kdjenis');
    }
}
