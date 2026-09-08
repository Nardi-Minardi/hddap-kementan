<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_dokumen_kegiatan', function (Blueprint $table) {
            $table->foreignId('sub_menu_dokumen_id')
                ->nullable()
                ->after('slug')
                ->constrained('m_sub_menu_dokumen')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tr_dokumen_kegiatan', function (Blueprint $table) {
            $table->dropForeign(['sub_menu_dokumen_id']);
            $table->dropColumn('sub_menu_dokumen_id');
        });
    }
};
