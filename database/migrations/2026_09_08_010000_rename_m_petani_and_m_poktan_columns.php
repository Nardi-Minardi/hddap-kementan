<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->renameColumnIfNeeded('m_petani', 'Luas Lahan (Ha)', 'luas_lahan_ha');
        $this->renameColumnIfNeeded('m_petani', 'Latitude', 'latitude');
        $this->renameColumnIfNeeded('m_petani', 'Longitude', 'longitude');
        $this->renameColumnIfNeeded('m_petani', 'Kelas Lereng', 'kelas_lereng');
        $this->renameColumnIfNeeded('m_petani', 'Kemiringan', 'kemiringan');
        $this->renameColumnIfNeeded('m_petani', 'Fungsi Kws. Hutan', 'fungsi_kws_hutan');
        $this->renameColumnIfNeeded('m_petani', 'Tahap', 'tahap');
        $this->renameColumnIfNeeded('m_poktan', 'Gender(L/P)', 'gender_lp');
    }

    public function down(): void
    {
        $this->renameColumnIfNeeded('m_petani', 'luas_lahan_ha', 'Luas Lahan (Ha)');
        $this->renameColumnIfNeeded('m_petani', 'latitude', 'Latitude');
        $this->renameColumnIfNeeded('m_petani', 'longitude', 'Longitude');
        $this->renameColumnIfNeeded('m_petani', 'kelas_lereng', 'Kelas Lereng');
        $this->renameColumnIfNeeded('m_petani', 'kemiringan', 'Kemiringan');
        $this->renameColumnIfNeeded('m_petani', 'fungsi_kws_hutan', 'Fungsi Kws. Hutan');
        $this->renameColumnIfNeeded('m_petani', 'tahap', 'Tahap');
        $this->renameColumnIfNeeded('m_poktan', 'gender_lp', 'Gender(L/P)');
    }

    private function renameColumnIfNeeded(string $table, string $from, string $to): void
    {
        if (! Schema::hasTable($table)) {
            return;
        }

        if (! Schema::hasColumn($table, $from) || Schema::hasColumn($table, $to)) {
            return;
        }

        DB::statement(sprintf(
            'ALTER TABLE %s RENAME COLUMN %s TO %s',
            $this->quoteIdentifier($table),
            $this->quoteIdentifier($from),
            $this->quoteIdentifier($to),
        ));
    }

    private function quoteIdentifier(string $identifier): string
    {
        return '"'.str_replace('"', '""', $identifier).'"';
    }
};
