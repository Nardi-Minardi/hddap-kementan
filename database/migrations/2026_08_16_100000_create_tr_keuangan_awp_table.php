<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr_keuangan_awp', function (Blueprint $table) {
            $table->id();
            $table->string('kode_awp', 20)->unique();
            $table->string('nama_awp');
            $table->string('component', 50);
            $table->string('sub_component', 50)->nullable();
            $table->string('kode_pok', 50);
            $table->string('uraian_kegiatan')->nullable();
            $table->string('kode_akun', 50)->nullable();
            $table->decimal('pagu', 18, 2);
            $table->string('sumber_dana', 20);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_keuangan_awp');
    }
};
