<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('tr_pelatihan')) {
            return;
        }

        Schema::create('tr_pelatihan', function (Blueprint $table) {
            $table->integer('kd_pelatihan')->primary();
            $table->integer('kdjenis');
            $table->date('tanggal');
            $table->string('lokasi', 100);
            $table->integer('jumlah_jpl');
            $table->integer('laki_laki');
            $table->integer('perempuan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_pelatihan');
    }
};
