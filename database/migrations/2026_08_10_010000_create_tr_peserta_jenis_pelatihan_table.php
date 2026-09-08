<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('tr_peserta_jenis_pelatihan')) {
            Schema::drop('tr_peserta_jenis_pelatihan');
        }

        Schema::create('tr_peserta_jenis_pelatihan', function (Blueprint $table) {
            $table->id();
            $table->integer('kdjenis');
            $table->string('tipe_peserta', 30);
            $table->unsignedBigInteger('m_petani_id')->nullable();
            $table->string('nama', 150);
            $table->string('nik', 16)->nullable();
            $table->text('alamat')->nullable();
            $table->unsignedTinyInteger('umur')->nullable();
            $table->string('jenis_kelamin', 1)->nullable();
            $table->string('no_hp', 20)->nullable();
            $table->timestamps();

            $table->foreign('kdjenis')
                ->references('kdjenis')
                ->on('tr_jns_pelatihan')
                ->cascadeOnDelete();

            $table->foreign('m_petani_id')
                ->references('id')
                ->on('m_petani')
                ->nullOnDelete();

            $table->unique(['kdjenis', 'm_petani_id'], 'peserta_jenis_pelatihan_petani_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_peserta_jenis_pelatihan');
    }
};
