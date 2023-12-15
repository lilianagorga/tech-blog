<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
      /** @var User $adminUser */
      $adminUser = User::factory()->create([
        'email' => 'admin@example.com',
        'name' => 'Admin',
        'password' => bcrypt('admin123')
      ]);

      $adminRole = Role::create(['name' => 'Admin']);
      $managePanelsPermission = Permission::create(['name' => 'manage panels']);
      $adminRole->givePermissionTo($managePanelsPermission);
      $adminUser->assignRole($adminRole);
      User::factory()->create([
        'name' => 'Liliana',
        'email' => 'liliana@test.com',
        'password' => bcrypt('12345678')
      ]);
      User::factory()->create([
        'name' => 'manu',
        'email' => 'manu@test.co.uk',
        'password' => bcrypt('12345678')
      ]);
    }
}
