<?php

namespace Tests;

use App\Models\Category;
use App\Models\Post;
use App\Models\TextWidget;
use App\Models\User;
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
    $role = Role::create(['name' => 'Admin', 'guard_name' => 'api']);
    $permission = Permission::create(['name' => 'manage panels', 'guard_name' => 'api']);
    $role->givePermissionTo($permission);
    $admin->assignRole($role);
    return $admin;
  }

  public function createTextWidgetCount($count)
  {
    return TextWidget::factory()->count($count)->create();
  }

  public function createTextWidget($args = [])
  {
    return TextWidget::factory()->create($args);
  }

}
