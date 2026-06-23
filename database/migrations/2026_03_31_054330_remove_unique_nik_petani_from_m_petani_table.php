<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE m_petani DROP CONSTRAINT IF EXISTS m_petani_nik_petani_unique');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('m_petani', function (Blueprint $table) {
            $table->unique('nik_petani');
        });
    }
};
