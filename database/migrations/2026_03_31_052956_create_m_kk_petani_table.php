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
        Schema::create('m_kk_petani', function (Blueprint $table) {
            $table->id();
            $table->foreignId('m_petani_id')->constrained('m_petani')->cascadeOnDelete();
            $table->string('nama');
            $table->string('nik', 16)->nullable();
            $table->string('gender', 1)->nullable()->comment('L / P');
            $table->unsignedTinyInteger('usia')->nullable();
            $table->string('status')->nullable()->comment('Suami / Istri / Anak / dll');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_kk_petani');
    }
};
