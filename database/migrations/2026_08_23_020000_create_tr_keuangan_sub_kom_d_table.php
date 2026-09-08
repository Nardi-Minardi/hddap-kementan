<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr_keuangan_sub_kom_d', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pok', 30);
            $table->string('kode_owp', 30)->unique();
            $table->string('nama_komponen_detail');
            $table->timestamps();

            $table->foreign('kode_pok')
                ->references('kode_pok')
                ->on('tr_keuangan_sub_komponen')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->index('kode_pok');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_keuangan_sub_kom_d');
    }
};
