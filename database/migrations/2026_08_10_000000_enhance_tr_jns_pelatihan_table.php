<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tr_jns_pelatihan', function (Blueprint $table) {
            if (! Schema::hasColumn('tr_jns_pelatihan', 'metode_acara')) {
                $table->string('metode_acara', 50)->nullable()->after('nama_pelatihan');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'latitude')) {
                $table->decimal('latitude', 10, 6)->nullable()->after('metode_acara');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'longitude')) {
                $table->decimal('longitude', 10, 6)->nullable()->after('latitude');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'provinsi_code')) {
                $table->string('provinsi_code', 10)->nullable()->after('longitude');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'kode_kota')) {
                $table->unsignedInteger('kode_kota')->nullable()->after('provinsi_code');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'gedung')) {
                $table->string('gedung', 150)->nullable()->after('kode_kota');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'kategori')) {
                $table->string('kategori', 100)->nullable()->after('gedung');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'topik')) {
                $table->string('topik', 100)->nullable()->after('kategori');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'subtopik')) {
                $table->string('subtopik', 100)->nullable()->after('topik');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'tanggal_mulai')) {
                $table->date('tanggal_mulai')->nullable()->after('subtopik');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'tanggal_berakhir')) {
                $table->date('tanggal_berakhir')->nullable()->after('tanggal_mulai');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'waktu_mulai')) {
                $table->string('waktu_mulai', 5)->nullable()->after('tanggal_berakhir');
            }
            if (! Schema::hasColumn('tr_jns_pelatihan', 'waktu_berakhir')) {
                $table->string('waktu_berakhir', 5)->nullable()->after('waktu_mulai');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tr_jns_pelatihan', function (Blueprint $table) {
            $columns = [
                'metode_acara',
                'latitude',
                'longitude',
                'provinsi_code',
                'kode_kota',
                'gedung',
                'kategori',
                'topik',
                'subtopik',
                'tanggal_mulai',
                'tanggal_berakhir',
                'waktu_mulai',
                'waktu_berakhir',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('tr_jns_pelatihan', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
