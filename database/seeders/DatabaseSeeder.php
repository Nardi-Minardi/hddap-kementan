<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::create(['name' => 'admin', 'label' => 'Administrator']);
        $userRole  = Role::create(['name' => 'user',  'label' => 'User']);

        User::create([
            'name'     => 'Super Admin',
            'email'    => 'admin@kementan.go.id',
            'password' => Hash::make('password'),
            'role_id'  => $adminRole->id,
        ]);

        User::create([
            'name'     => 'Regular User',
            'email'    => 'user@kementan.go.id',
            'password' => Hash::make('password'),
            'role_id'  => $userRole->id,
        ]);
    }
}

