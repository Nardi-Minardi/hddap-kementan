<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('m_petani', function (Blueprint $table) {
            $table->id();
            $table->string('nama_petani');
            $table->string('nik_petani', 16)->nullable();
            $table->string('no_hp_petani', 20)->nullable();
            $table->string('gender_petani', 1)->nullable()->comment('L / P');
            $table->integer('usia_petani')->nullable();
            $table->boolean('difabel')->default(false);
            $table->text('alamat_petani')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_petani');
    }
};
