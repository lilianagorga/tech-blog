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

  public function addRoleAndPermissionToAdmin(): User
  {
    /** @var User $admin */
    $admin = User::factory()->create();
    $roleNames = ['Admin', 'Writer', 'Marketer', 'Developer'];

    foreach ($roleNames as $roleName) {
      $role = Role::create(['name' => $roleName, 'guard_name' => 'api']);
      $admin->assignRole($role);
    }

    $allPermissions = Permission::all();
    $adminRole = Role::findByName('Admin', 'api');
    $adminRole->syncPermissions($allPermissions);

    return $admin;
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
