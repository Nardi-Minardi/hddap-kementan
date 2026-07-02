<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logframe extends Model
{
    protected $table = 'tr_logframe';

    protected $fillable = [
        'tingkat',
        'component',
        'nama_indikator',
        'definisi_indikator',
        'nilai_dasar',
        'target_pertengahan_proyek',
        'target_akhir_proyek',
        'realisasi',
        'sumber_data',
        'data_yg_dikumpulkan',
    ];
}
