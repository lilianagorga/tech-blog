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
      $roles = ['Admin', 'Writer', 'Marketer', 'Developer'];
      $permissions = ['manage panels', 'edit posts', 'edit categories', 'edit comments', 'edit code'];

      foreach ($permissions as $permName) {
        Permission::findOrCreate($permName, 'api');
      }

      $adminRole = Role::findOrCreate('Admin', 'api');
      $adminRole->syncPermissions(Permission::where('guard_name', 'api')->whereIn('name', ['edit categories', 'edit posts', 'edit comments', 'edit code'])->get());

      $writerRole = Role::create(['name' => 'Writer', 'guard_name' => 'api']);
      $writerRole->syncPermissions(Permission::where('guard_name', 'api')->whereIn('name', ['edit posts', 'edit comments'])->get());

      $marketerRole = Role::create(['name' => 'Marketer', 'guard_name' => 'api']);
      $marketerRole->syncPermissions(Permission::where('guard_name', 'api')->whereIn('name', ['edit posts', 'edit comments'])->get());

      $developerRole = Role::create(['name' => 'Developer', 'guard_name' => 'api']);
      $developerRole->syncPermissions(Permission::where('guard_name', 'api')->whereIn('name', ['edit code'])->get());

      $adminUser = User::factory()->create([
        'email' => 'admin@mysite.com',
        'name' => 'Admin',
        'password' => bcrypt('Admin123!')
      ]);
      $adminUser->assignRole('Admin');
      $adminUser->givePermissionTo('manage panels');

      /** @var User $writerUser */
      $writerUser = User::factory()->create([
        'email' => 'writer@example.com',
        'name' => 'Writer',
        'password' => bcrypt('Writer123!')
      ]);
      $writerUser->assignRole('Writer');
      $writerUser->givePermissionTo('manage panels');

      /** @var User $marketerUser */
      $marketerUser = User::factory()->create([
        'email' => 'marketer@example.com',
        'name' => 'Marketer',
        'password' => bcrypt('Marketer123!')
      ]);
      $marketerUser->assignRole('Marketer');
      $marketerUser->givePermissionTo('manage panels');

      /** @var User $developerUser */
      $developerUser = User::factory()->create([
        'email' => 'developer@example.com',
        'name' => 'Developer',
        'password' => bcrypt('Developer123!')
      ]);
      $developerUser->assignRole('Developer');
      $developerUser->givePermissionTo('manage panels');
    }
}
