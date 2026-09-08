<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesertaJenisPelatihan extends Model
{
    public const TIPE_PETANI = 'petani';

    public const TIPE_FASILITATOR = 'fasilitator';

    public const TIPE_DIT = 'dit';

    public const TIPE_DINAS = 'dinas';

    public const TIPE_TIDAK_TERDAFTAR = 'tidak_terdaftar';

    public const TIPE_OPTIONS = [
        self::TIPE_PETANI => 'Petani',
        self::TIPE_FASILITATOR => 'Fasilitator',
        self::TIPE_DIT => 'DIT',
        self::TIPE_DINAS => 'Dinas',
        self::TIPE_TIDAK_TERDAFTAR => 'Tidak Terdaftar',
    ];

    protected $table = 'tr_peserta_jenis_pelatihan';

    protected $fillable = [
        'kdjenis',
        'tipe_peserta',
        'm_petani_id',
        'nama',
        'nik',
        'alamat',
        'umur',
        'jenis_kelamin',
        'no_hp',
    ];

    protected $casts = [
        'kdjenis' => 'integer',
        'umur' => 'integer',
        'm_petani_id' => 'integer',
    ];

    protected $appends = [
        'tipe_peserta_label',
    ];

    public function getTipePesertaLabelAttribute(): string
    {
        return self::TIPE_OPTIONS[$this->tipe_peserta] ?? $this->tipe_peserta;
    }

    public function jenisPelatihan(): BelongsTo
    {
        return $this->belongsTo(JenisPelatihan::class, 'kdjenis', 'kdjenis');
    }

    public function petani(): BelongsTo
    {
        return $this->belongsTo(Petani::class, 'm_petani_id');
    }
}
