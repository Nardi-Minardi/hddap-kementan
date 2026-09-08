<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_keuangan_awp', function (Blueprint $table) {
            $table->string('kode_owp', 30)->nullable()->after('sub_component');
        });
    }

    public function down(): void
    {
        Schema::table('tr_keuangan_awp', function (Blueprint $table) {
            $table->dropColumn('kode_owp');
        });
    }
};
