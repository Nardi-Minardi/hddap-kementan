<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_logframe', function (Blueprint $table) {
            $table->text('sumber_data')->nullable()->after('realisasi');
        });
    }

    public function down(): void
    {
        Schema::table('tr_logframe', function (Blueprint $table) {
            $table->dropColumn('sumber_data');
        });
    }
};
