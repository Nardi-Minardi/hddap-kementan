<?php

namespace Database\Seeders;

use App\Services\AdminPermissionSyncService;
use App\Models\User;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        AdminPermissionSyncService::sync();

        User::query()
            ->whereHas('role', fn ($q) => $q->where('name', 'admin'))
            ->each(fn (User $user) => $user->update(['is_pusat' => true]));
    }
}
