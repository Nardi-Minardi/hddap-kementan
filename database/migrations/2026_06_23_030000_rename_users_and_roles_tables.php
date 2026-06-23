<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('roles') && ! Schema::hasTable('m_roles')) {
            Schema::rename('roles', 'm_roles');
        }

        if (Schema::hasTable('users') && ! Schema::hasTable('m_users')) {
            Schema::rename('users', 'm_users');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('m_users') && ! Schema::hasTable('users')) {
            Schema::rename('m_users', 'users');
        }

        if (Schema::hasTable('m_roles') && ! Schema::hasTable('roles')) {
            Schema::rename('m_roles', 'roles');
        }
    }
};
