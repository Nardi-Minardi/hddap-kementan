<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('m_petani', function (Blueprint $table) {
            if (! Schema::hasColumn('m_petani', 'foto_lahan')) {
                $table->string('foto_lahan')->nullable()->after('alamat_petani');
            }
        });
    }

    public function down(): void
    {
        Schema::table('m_petani', function (Blueprint $table) {
            if (Schema::hasColumn('m_petani', 'foto_lahan')) {
                $table->dropColumn('foto_lahan');
            }
        });
    }
};
