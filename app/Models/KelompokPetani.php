<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelompokPetani extends Model
{
    protected $table = 'm_kelompok_petani';

    protected $fillable = [
        'provinsi_name', 'provinsi_id',
        'kab_kota_name', 'kab_kota_id',
        'kecamatan_name', 'kecamatan_id',
        'kel_des_name', 'kel_des_id',
        'nama_poktan',
        'luas_layanan_poktan',
        'tahun_pembentukan',
        'diketahui_pic',
        'sk_bupati',
        'akte_notaris',
        'ket_terdaftar_pengadilan',
        'nama_ketua_poktan',
        'no_hp_ketua_poktan',
        'gender_ketua_poktan',
        'gender_wakil_poktan',
        'gender_sekretaris_poktan',
        'gender_bendahara_poktan',
        'jumlah_pengurus_poktan',
        'jumlah_anggota_poktan',
        'jumlah_anggota_pria_poktan',
        'jumlah_anggota_wanita_poktan',
        'ad_art',
        'alamat_kantor_sekretariat',
        'pengisian_buku',
        'iuran',
        'keterangan',
    ];
}
