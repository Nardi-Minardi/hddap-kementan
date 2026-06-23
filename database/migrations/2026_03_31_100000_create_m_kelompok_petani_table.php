<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('m_kelompok_petani', function (Blueprint $table) {
            $table->id();
            $table->string('provinsi_name')->nullable();
            $table->unsignedBigInteger('provinsi_id')->nullable();
            $table->string('kab_kota_name')->nullable();
            $table->unsignedBigInteger('kab_kota_id')->nullable();
            $table->string('kecamatan_name')->nullable();
            $table->unsignedBigInteger('kecamatan_id')->nullable();
            $table->string('kel_des_name')->nullable();
            $table->unsignedBigInteger('kel_des_id')->nullable();
            $table->string('nama_poktan')->nullable();
            $table->decimal('luas_layanan_poktan', 10, 2)->nullable()->comment('hektar');
            $table->integer('tahun_pembentukan')->nullable();
            $table->string('diketahui_pic')->nullable();
            $table->string('sk_bupati')->nullable();
            $table->string('akte_notaris')->nullable();
            $table->string('ket_terdaftar_pengadilan')->nullable();
            $table->string('nama_ketua_poktan')->nullable();
            $table->string('no_hp_ketua_poktan')->nullable();
            $table->string('gender_ketua_poktan')->nullable();
            $table->string('gender_wakil_poktan')->nullable();
            $table->string('gender_sekretaris_poktan')->nullable();
            $table->string('gender_bendahara_poktan')->nullable();
            $table->integer('jumlah_pengurus_poktan')->nullable();
            $table->integer('jumlah_anggota_poktan')->nullable();
            $table->integer('jumlah_anggota_pria_poktan')->nullable();
            $table->integer('jumlah_anggota_wanita_poktan')->nullable();
            $table->string('ad_art')->nullable();
            $table->text('alamat_kantor_sekretariat')->nullable();
            $table->string('pengisian_buku')->nullable();
            $table->string('iuran')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('m_kelompok_petani');
    }
};
