<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class UserTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
    $this->user = $this->authUser();
  }

  public function test_users_can_be_listed()
  {
    $this->createUserCount();
    $response = $this->getJson('/api/users');
    $response->assertOk();
    $response->assertJsonCount(6);
  }

  public function test_a_single_user_can_be_retrieved()
  {
    $user = $this->createUser();
    $response = $this->getJson('/api/users/'.$user->id);
    $response->assertOk();
    $response->assertJsonPath('id', $user->id);
  }

  public function test_a_user_can_be_updated()
  {
    $user = $this->createUser();
    $updatedData = [
      'name' => 'Updated Name',
      'email' => fake()->unique()->safeEmail(),
      ];
    $response = $this->putJson('/api/users/'.$user->id, $updatedData);
    $response->assertOk();
    $this->assertDatabaseHas('users', [
      'id' => $user->id,
      'name' => 'Updated Name',
      'email' => $updatedData['email'],
    ]);
  }

  public function test_a_user_can_be_deleted()
  {
    $user = $this->createUser();
    $response = $this->deleteJson('/api/users/'.$user->id);
    $response->assertNoContent();
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
  }

  public function test_manage_panels_access()
  {
    $admin = $this->addRoleAndPermissionToAdmin();
    Sanctum::actingAs($admin);
    $response = $this->getJson('/api/users/manage-panels');
    $users = User::with('roles', 'permissions')->get()->toArray();
    $roles = Role::all()->pluck('name')->toArray();
    $permissions = Permission::all()->pluck('name')->toArray();
    $data = [
      'permissions' => $permissions,
      'roles' => $roles,
      'users' => $users
    ];
    $response->assertOk();
    $response->assertJson($data);
  }

  public function test_manage_panels_access_denied_for_non_admin_user()
  {
    $user = $this->createUser();
    Sanctum::actingAs($user);
    $response = $this->getJson('/api/users/manage-panels');
    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $response->assertJson(['message' => 'Access Forbidden']);
  }

}
