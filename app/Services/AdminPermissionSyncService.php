<?php

namespace App\Services;

use App\Models\Permission;
use App\Models\User;

class AdminPermissionSyncService
{
    public static function syncIfNeeded(): void
    {
        $configKeys = collect(config('admin_permissions', []))
            ->pluck('key')
            ->sort()
            ->values();

        $dbKeys = Permission::query()
            ->pluck('key')
            ->sort()
            ->values();

        if ($configKeys->toJson() === $dbKeys->toJson()) {
            return;
        }

        self::sync();
    }

    public static function sync(): void
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
                $user->permissions()->sync($allPermissionIds);
            });
    }
}
