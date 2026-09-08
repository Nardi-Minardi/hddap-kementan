<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_berita', function (Blueprint $table) {
            $table->unsignedInteger('kode_kota')->nullable()->after('tipe');
            $table->index('kode_kota', 'tr_berita_kode_kota_index');
        });
    }

    public function down(): void
    {
        Schema::table('tr_berita', function (Blueprint $table) {
            $table->dropIndex('tr_berita_kode_kota_index');
            $table->dropColumn('kode_kota');
        });
    }
};
