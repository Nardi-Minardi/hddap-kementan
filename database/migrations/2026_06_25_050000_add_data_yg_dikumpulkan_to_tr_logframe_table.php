<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_logframe', function (Blueprint $table) {
            $table->text('data_yg_dikumpulkan')->nullable()->after('sumber_data');
        });
    }

    public function down(): void
    {
        Schema::table('tr_logframe', function (Blueprint $table) {
            $table->dropColumn('data_yg_dikumpulkan');
        });
    }
};
