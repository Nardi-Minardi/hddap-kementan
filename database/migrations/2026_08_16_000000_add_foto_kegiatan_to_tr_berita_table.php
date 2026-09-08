<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_berita', function (Blueprint $table) {
            if (! Schema::hasColumn('tr_berita', 'foto_kegiatan')) {
                $table->json('foto_kegiatan')->nullable()->after('image_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tr_berita', function (Blueprint $table) {
            if (Schema::hasColumn('tr_berita', 'foto_kegiatan')) {
                $table->dropColumn('foto_kegiatan');
            }
        });
    }
};
