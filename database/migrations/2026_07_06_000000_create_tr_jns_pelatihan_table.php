<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('tr_jns_pelatihan')) {
            return;
        }

        Schema::create('tr_jns_pelatihan', function (Blueprint $table) {
            $table->increments('kdjenis');
            $table->string('jenis_pelatihan', 100);
            $table->string('nama_pelatihan', 100);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tr_jns_pelatihan');
    }
};
