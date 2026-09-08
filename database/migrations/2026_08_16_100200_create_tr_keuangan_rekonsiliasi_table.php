<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tr_keuangan_rekonsiliasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('keuangan_transaksi_id')
                ->unique()
                ->constrained('tr_keuangan_transaksi')
                ->cascadeOnDelete();
            $table->decimal('nilai_hddap', 18, 2);
            $table->decimal('nilai_sakti', 18, 2);
            $table->decimal('nilai_omspan', 18, 2);
            $table->decimal('nilai_bank', 18, 2);
            $table->decimal('selisih', 18, 2)->default(0);
            $table->string('status', 30);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_keuangan_rekonsiliasi');
    }
};
