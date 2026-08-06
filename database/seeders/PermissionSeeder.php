<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        foreach (config('admin_permissions', []) as $item) {
            Permission::query()->updateOrCreate(
                ['key' => $item['key']],
                [
                    'label' => $item['label'],
                    'group_key' => $item['group'] ?? null,
                    'menu_key' => $item['menu_key'] ?? null,
                ],
            );
        }

        $allPermissionIds = Permission::query()->pluck('id');

        User::query()
            ->whereHas('role', fn ($q) => $q->where('name', 'admin'))
            ->each(function (User $user) use ($allPermissionIds) {
                $user->update(['is_pusat' => true]);
                $user->permissions()->sync($allPermissionIds);
            });
    }
}
