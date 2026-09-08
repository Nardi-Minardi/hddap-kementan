<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr_keuangan_sub_komponen', function (Blueprint $table) {
            $table->id();
            $table->string('kode_sub', 20);
            $table->string('kode_pok', 30)->unique();
            $table->string('nama_kegiatan_pok');
            $table->timestamps();

            $table->foreign('kode_sub')
                ->references('kode_sub')
                ->on('tr_keuangan_komponen')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->index('kode_sub');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_keuangan_sub_komponen');
    }
};
