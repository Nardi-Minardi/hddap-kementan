<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_jns_pelatihan', function (Blueprint $table) {
            if (! Schema::hasColumn('tr_jns_pelatihan', 'kd_pelatihan')) {
                $table->unsignedInteger('kd_pelatihan')->nullable()->after('jenis_pelatihan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tr_jns_pelatihan', function (Blueprint $table) {
            if (Schema::hasColumn('tr_jns_pelatihan', 'kd_pelatihan')) {
                $table->dropColumn('kd_pelatihan');
            }
        });
    }
};
