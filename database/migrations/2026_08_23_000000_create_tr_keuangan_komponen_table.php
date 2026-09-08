<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr_keuangan_komponen', function (Blueprint $table) {
            $table->id();
            $table->string('kode_componen', 10);
            $table->string('kode_sub', 20)->unique();
            $table->string('nama_sub_komponen');
            $table->timestamps();

            $table->index('kode_componen');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_keuangan_komponen');
    }
};
