<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pendamping') && ! Schema::hasTable('m_pendamping')) {
            Schema::rename('pendamping', 'm_pendamping');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('m_pendamping') && ! Schema::hasTable('pendamping')) {
            Schema::rename('m_pendamping', 'pendamping');
        }
    }
};
