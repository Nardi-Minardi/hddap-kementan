<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_pelatihan', function (Blueprint $table) {
            if (! Schema::hasColumn('tr_pelatihan', 'komponen')) {
                $table->string('komponen', 100)->nullable()->after('kd_pelatihan');
            }
            if (! Schema::hasColumn('tr_pelatihan', 'nama_kegiatan')) {
                $table->string('nama_kegiatan', 255)->nullable()->after('komponen');
            }
            if (! Schema::hasColumn('tr_pelatihan', 'kode_owp')) {
                $table->string('kode_owp', 20)->nullable()->unique()->after('nama_kegiatan');
            }
        });

        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE tr_pelatihan ALTER COLUMN kdjenis DROP NOT NULL');
            DB::statement('ALTER TABLE tr_pelatihan ALTER COLUMN tanggal DROP NOT NULL');
            DB::statement('ALTER TABLE tr_pelatihan ALTER COLUMN lokasi DROP NOT NULL');
            DB::statement('ALTER TABLE tr_pelatihan ALTER COLUMN jumlah_jpl DROP NOT NULL');
            DB::statement('ALTER TABLE tr_pelatihan ALTER COLUMN laki_laki DROP NOT NULL');
            DB::statement('ALTER TABLE tr_pelatihan ALTER COLUMN perempuan DROP NOT NULL');
        }
    }

    public function down(): void
    {
        Schema::table('tr_pelatihan', function (Blueprint $table) {
            if (Schema::hasColumn('tr_pelatihan', 'kode_owp')) {
                $table->dropUnique(['kode_owp']);
                $table->dropColumn('kode_owp');
            }
            if (Schema::hasColumn('tr_pelatihan', 'nama_kegiatan')) {
                $table->dropColumn('nama_kegiatan');
            }
            if (Schema::hasColumn('tr_pelatihan', 'komponen')) {
                $table->dropColumn('komponen');
            }
        });
    }
};
