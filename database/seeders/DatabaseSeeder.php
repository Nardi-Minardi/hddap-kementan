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
            'email'    => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role_id'  => $adminRole->id,
        ]);

        User::create([
            'name'     => 'Regular User',
            'email'    => 'user@gmail.com',
            'password' => Hash::make('password'),
            'role_id'  => $userRole->id,
        ]);

        $this->call(BeritaSeeder::class);
        $this->call(KelompokPetaniSeeder::class);
        $this->call(PetaniSeeder::class);
        $this->call(WilayahSeeder::class);
    }
}

