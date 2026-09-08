<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr_keuangan_transaksi', function (Blueprint $table) {
            $table->id();
            $table->string('kode_transaksi', 20)->unique();
            $table->foreignId('keuangan_awp_id')
                ->constrained('tr_keuangan_awp')
                ->cascadeOnDelete();
            $table->string('no_spm', 100);
            $table->date('tgl_spm');
            $table->decimal('nilai_spm', 18, 2);
            $table->string('no_sp2d', 100)->nullable();
            $table->date('tgl_sp2d')->nullable();
            $table->decimal('nilai_sp2d', 18, 2)->default(0);
            $table->string('mekanisme_pembayaran', 50);
            $table->decimal('nilai_realisasi', 18, 2)->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_keuangan_transaksi');
    }
};
