<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('m_pendamping') || Schema::hasTable('pendamping')) {
            return;
        }

        Schema::create('m_pendamping', function (Blueprint $table) {
            $table->increments('no');
            $table->string('nama_fasilitator', 150);
            $table->string('gender', 20)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('domisili', 100)->nullable();
            $table->text('alamat')->nullable();
            $table->string('pendidikan_terakhir', 150)->nullable();
            $table->string('kode_kota', 20)->nullable()->index();
            $table->string('bidang', 100)->nullable();
            $table->string('pendamping', 100)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('m_pendamping');
    }
};
