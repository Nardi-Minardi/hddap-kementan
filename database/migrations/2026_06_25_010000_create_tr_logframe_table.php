<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr_logframe', function (Blueprint $table) {
            $table->id();
            $table->text('tingkat')->nullable();
            $table->text('nama_indikator')->nullable();
            $table->text('definisi_indikator')->nullable();
            $table->text('nilai_dasar')->nullable();
            $table->text('target_pertengahan_proyek')->nullable();
            $table->text('target_akhir_proyek')->nullable();
            $table->text('realisasi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_logframe');
    }
};
