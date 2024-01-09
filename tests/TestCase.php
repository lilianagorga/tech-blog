<?php

namespace Tests;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\TextWidget;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

  public function setUp(): void
  {
    parent::setUp();
    $this->withoutExceptionHandling();
  }

  public function createCategoryCount($count = 5)
  {
    return Category::factory()->count($count)->create();
  }

  public function createCategory($args = [])
  {
    return Category::factory()->create($args);
  }

  public function createPost($args = [])
  {
    return Post::factory()->create($args);
  }

  public function createUser($args = [])
  {
    return User::factory()->create($args);
  }

  public function createUserCount($count = 5)
  {
    return User::factory()->count($count)->create();
  }

  public function authUser()
  {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    return $user;
  }

  public function addRolesAndPermissionsToAdmin(): User
  {
    /** @var User $admin */
    $admin = User::factory()->create();
    $roles = ['Admin', 'Writer', 'Marketer', 'Developer'];
    foreach ($roles as $roleName) {
      $role = Role::findOrCreate($roleName, 'api');
      $admin->assignRole($role);
    }
    $permissions = ['manage panels', 'edit posts', 'edit categories', 'edit comments', 'edit code'];
    foreach ($permissions as $permName) {
      $permission = Permission::findOrCreate($permName, 'api');
      $adminRole = Role::findByName('Admin', 'api');
      $adminRole->givePermissionTo($permission);
    }
    return $admin;
  }

  public function createUserWithSpecificRoleAndPermissions(): User
  {
    /** @var User $developer */
    $developer = User::factory()->create();
    $developerRole = Role::findOrCreate('Developer', 'api');
    $developer->assignRole($developerRole);
    $permissions = ['manage panels', 'edit code'];
    foreach ($permissions as $permName) {
      $permission = Permission::findOrCreate($permName, 'api');
      $developerRole->givePermissionTo($permission);
    }

    return $developer;
  }


  public function createComment($args = [])
  {
    return Comment::factory()->create($args);
  }

  public function createVote($args = [])
  {
    return Vote::factory()->create($args);
  }

}
