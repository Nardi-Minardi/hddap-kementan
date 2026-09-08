<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('tr_jns_pelatihan')) {
            return;
        }

        if (Schema::getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        $column = DB::selectOne("
            SELECT data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'tr_jns_pelatihan'
              AND column_name = 'kdjenis'
        ");

        if (! $column || $column->data_type === 'integer') {
            return;
        }

        DB::statement('ALTER TABLE tr_jns_pelatihan ALTER COLUMN kdjenis TYPE integer USING kdjenis::integer');

        DB::statement("
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_class WHERE relname = 'tr_jns_pelatihan_kdjenis_seq'
                ) THEN
                    CREATE SEQUENCE tr_jns_pelatihan_kdjenis_seq OWNED BY tr_jns_pelatihan.kdjenis;
                    ALTER TABLE tr_jns_pelatihan ALTER COLUMN kdjenis SET DEFAULT nextval('tr_jns_pelatihan_kdjenis_seq');
                END IF;
            END $$;
        ");
    }

    public function down(): void
    {
        if (! Schema::hasTable('tr_jns_pelatihan')) {
            return;
        }

        if (Schema::getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('ALTER TABLE tr_jns_pelatihan ALTER COLUMN kdjenis TYPE varchar(10) USING kdjenis::varchar');
    }
};
