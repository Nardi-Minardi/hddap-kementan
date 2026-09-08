<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('m_pendamping')
            ->whereRaw("lower(trim(gender)) in ('laki-laki', 'laki laki', 'l')")
            ->update(['gender' => 'L']);

        DB::table('m_pendamping')
            ->whereRaw("lower(trim(gender)) in ('perempuan', 'p')")
            ->update(['gender' => 'P']);
    }

    public function down(): void
    {
        // Data normalization is not reversed.
    }
};
