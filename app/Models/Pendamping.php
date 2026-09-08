<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pendamping extends Model
{
    protected $table = 'm_pendamping';

    protected $primaryKey = 'no';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
        'nama_fasilitator',
        'gender',
        'tanggal_lahir',
        'domisili',
        'alamat',
        'pendidikan_terakhir',
        'kode_kota',
        'bidang',
        'pendamping',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
        ];
    }

    public static function normalizeGender(?string $gender): ?string
    {
        if ($gender === null || trim($gender) === '') {
            return null;
        }

        $normalized = strtolower(trim($gender));

        if (in_array($normalized, ['l', 'laki-laki', 'laki laki'], true)) {
            return 'L';
        }

        if (in_array($normalized, ['p', 'perempuan'], true)) {
            return 'P';
        }

        return in_array(strtoupper($gender), ['L', 'P'], true) ? strtoupper($gender) : null;
    }

    public function getGenderAttribute(?string $value): ?string
    {
        return self::normalizeGender($value);
    }

    public function setGenderAttribute(?string $value): void
    {
        $this->attributes['gender'] = self::normalizeGender($value);
    }

    public function kabKota(): BelongsTo
    {
        return $this->belongsTo(KabKota::class, 'kode_kota', 'code');
    }
}
