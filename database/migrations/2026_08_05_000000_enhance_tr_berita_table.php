<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_berita', function (Blueprint $table) {
            $table->string('tipe', 20)->default('berita')->after('slug');
            $table->foreignId('user_id')->nullable()->after('is_published')->constrained('m_users')->nullOnDelete();
            $table->unsignedSmallInteger('urutan')->default(0)->after('user_id');
        });

        Schema::table('tr_berita', function (Blueprint $table) {
            $table->index(['is_published', 'published_at'], 'tr_berita_publish_index');
            $table->index('tipe', 'tr_berita_tipe_index');
        });
    }

    public function down(): void
    {
        Schema::table('tr_berita', function (Blueprint $table) {
            $table->dropIndex('tr_berita_publish_index');
            $table->dropIndex('tr_berita_tipe_index');
            $table->dropForeign(['user_id']);
            $table->dropColumn(['tipe', 'user_id', 'urutan']);
        });
    }
};
