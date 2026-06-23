<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('m_provinsi', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('m_kab_kota', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('name');
            $table->string('provinsi_code', 10);
            $table->timestamps();

            $table->index('provinsi_code');
        });

        Schema::create('m_kecamatan', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('name');
            $table->string('kab_kota_code', 10);
            $table->timestamps();

            $table->index('kab_kota_code');
        });

        Schema::create('m_kel_des', function (Blueprint $table) {
            $table->id();
            $table->string('code', 15)->unique();
            $table->string('name');
            $table->string('kecamatan_code', 10);
            $table->timestamps();

            $table->index('kecamatan_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('m_kel_des');
        Schema::dropIfExists('m_kecamatan');
        Schema::dropIfExists('m_kab_kota');
        Schema::dropIfExists('m_provinsi');
    }
};
