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
      $roles = ['Admin', 'Writer', 'Moderator'];
      $permissions = ['managePanel', 'managePosts', 'manageCategories', 'manageComments'];

      foreach ($permissions as $permName) {
        Permission::findOrCreate($permName, 'api');
      }

      $adminRole = Role::findOrCreate('Admin', 'api');
      $adminRole->syncPermissions(Permission::where('guard_name', 'api')->get());

      $writerRole = Role::create(['name' => 'Writer', 'guard_name' => 'api']);
      $writerRole->syncPermissions(Permission::where('guard_name', 'api')->whereIn('name', ['manageCategories', 'managePosts', 'manageComments'])->get());

      $moderatorRole = Role::create(['name' => 'Moderator', 'guard_name' => 'api']);
      $moderatorRole->syncPermissions(Permission::where('guard_name', 'api')->whereIn('name', ['managePosts', 'manageComments'])->get());

      /** @var User $adminUser */
      $adminUser = User::factory()->create([
        'email' => 'admin@techBlog.com',
        'name' => 'Admin',
        'password' => bcrypt('Admin123!')
      ]);
      $adminUser->assignRole($adminRole);

      /** @var User $writerUser */
      $writerUser = User::factory()->create([
        'email' => 'liliana@email.com',
        'name' => 'Liliana',
        'password' => bcrypt('Writer123!')
      ]);
      $writerUser->assignRole('Writer');
      $writerUser->givePermissionTo('managePanel');

      /** @var User $moderatorUser */
      $moderatorUser = User::factory()->create([
        'email' => 'emanuele@email.com',
        'name' => 'Emanuele',
        'password' => bcrypt('Moderator123!')
      ]);
      $moderatorUser->assignRole('Moderator');
      $moderatorUser->givePermissionTo('managePanel');
    }
}
