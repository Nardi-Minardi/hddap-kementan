<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_logframe', function (Blueprint $table) {
            $table->text('component')->nullable()->after('tingkat');
        });
    }

    public function down(): void
    {
        Schema::table('tr_logframe', function (Blueprint $table) {
            $table->dropColumn('component');
        });
    }
};
