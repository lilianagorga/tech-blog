<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class ManagePanelTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
    $this->user = $this->authUser();
  }

  public function test_manage_panels_access()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
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

  public function test_manage_panels_access_denied_for_user_without_permissions()
  {
    $user = $this->createUser();
    Sanctum::actingAs($user);
    Permission::findOrCreate('manage panels', 'api');
    $response = $this->getJson('/api/users/manage-panels');
    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $response->assertJson(['message' => 'Access Forbidden']);
  }

  public function test_admin_has_all_permissions()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    foreach (Permission::all() as $permission) {
      $this->assertTrue($admin->hasPermissionTo($permission));
    }
  }

  public function test_admin_has_all_roles()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    $roles = ['Admin', 'Writer', 'Marketer', 'Developer'];
    foreach ($roles as $role) {
      $this->assertTrue($admin->hasRole($role));
    }
  }

  public function test_create_role_successfully()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    $roleData = [
      'name' => 'NewRole',
      'permissions' => ['edit posts', 'edit categories']
    ];
    $response = $this->postJson('/api/users/roles', $roleData);
    $response->assertStatus(Response::HTTP_CREATED);
    $response->assertJson(['name' => 'NewRole']);
    $this->assertDatabaseHas('roles', ['name' => 'NewRole']);
    $role = Role::findByName('NewRole', 'api');
    foreach ($roleData['permissions'] as $permissionName) {
      $this->assertTrue($role->hasPermissionTo($permissionName));
    }
  }

  public function test_create_role_denied_for_non_admin_user()
  {
    $user = $this->createUser();
    Sanctum::actingAs($user);
    $roleData = [
      'name' => 'NewRole',
      'permissions' => ['edit posts', 'edit categories']
    ];
    $response = $this->postJson('/api/users/roles', $roleData);
    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertDatabaseMissing('roles', ['name' => 'NewRole']);
  }

  public function test_create_role_denied_for_user_with_panel_access_but_not_admin()
  {
    $developer = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($developer);
    $roleData = [
      'name' => 'Marketer',
      'permissions' => ['edit comments']
    ];
    $response = $this->postJson('/api/users/roles', $roleData);
    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertDatabaseMissing('roles', ['name' => 'Marketer']);
  }

  public function test_create_permission_successfully()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);

    $permissionData = [
      'name' => 'new permission'
    ];

    $response = $this->postJson('/api/users/permissions', $permissionData);

    $response->assertStatus(Response::HTTP_CREATED);
    $response->assertJson(['name' => 'new permission']);
    $this->assertDatabaseHas('permissions', ['name' => 'new permission']);
  }

  public function test_create_permission_denied_for_user_with_panel_access_but_not_admin()
  {
    $developer = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($developer);

    $permissionData = [
      'name' => 'edit posts'
    ];

    $response = $this->postJson('/api/users/permissions', $permissionData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertDatabaseMissing('permissions', ['name' => 'edit posts']);
  }

  public function test_delete_role_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    $user = User::factory()->create();
    $role = Role::create(['name' => 'TestRole', 'guard_name' => 'api']);
    /** @var User $user */
    $user->assignRole($role->name);
    $rolesData = [
      'user_id' => $user->id,
      'roles' => [$role->name]
    ];

    $response = $this->deleteJson('/api/users/roles/delete', $rolesData);

    $response->assertStatus(Response::HTTP_OK);
    $response->assertJson(['message' => 'Roles deleted successfully']);
    $this->assertFalse($user->hasRole('TestRole'));
  }

  public function test_delete_role_denied_for_user_with_panel_access_but_not_admin()
  {
    $developer = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($developer);
    $user = User::factory()->create();
    $role = Role::create(['name' => 'TestRole', 'guard_name' => 'api']);
    /** @var User $user */
    $user->assignRole($role->name);
    $rolesData = [
      'user_id' => $user->id,
      'roles' => [$role->name]
    ];

    $response = $this->deleteJson('/api/users/roles/delete', $rolesData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertTrue($user->hasRole('TestRole'));
  }

  public function test_delete_permission_successfully_by_admin()
{
  $admin = $this->addRolesAndPermissionsToAdmin();
  Sanctum::actingAs($admin);
  $user = User::factory()->create();
  $permission = Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);
  /** @var User $user */
  $user->givePermissionTo($permission->name);
  $permissionsData = [
    'user_id' => $user->id,
    'permissions' => [$permission->name]
  ];

  $response = $this->deleteJson('/api/users/permissions/delete', $permissionsData);

  $response->assertStatus(Response::HTTP_OK);
  $response->assertJson(['message' => 'Permission deleted successfully']);
  $this->assertFalse($user->hasPermissionTo('TestPermission'));
}

  public function test_delete_permission_associated_to_role_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    $user = User::factory()->create();
    $role = Role::create(['name' => 'TestRole', 'guard_name' => 'api']);
    $permission = Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);
    $role->givePermissionTo($permission->name);
    /** @var User $user */
    $user->assignRole($role->name);
    $permissionsData = [
      'user_id' => $user->id,
      'permissions' => [$permission->name]
    ];

    $response = $this->deleteJson('/api/users/permissions/delete', $permissionsData);

    $response->assertStatus(Response::HTTP_OK);
    $response->assertJson(['message' => 'Permission deleted successfully']);
    $role->refresh();
    $this->assertFalse($role->hasPermissionTo('TestPermission'));
  }


  public function test_delete_permission_denied_for_user_with_panel_access_but_not_admin()
  {
    $developer = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($developer);
    $user = User::factory()->create();
    $permission = Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);
    /** @var User $user */
    $user->givePermissionTo($permission->name);
    $permissionsData = [
      'user_id' => $user->id,
      'permissions' => [$permission->name]
    ];

    $response = $this->deleteJson('/api/users/permissions/delete', $permissionsData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertTrue($user->hasPermissionTo('TestPermission'));
  }

  public function test_delete_permission_associated_to_role_denied_for_user_with_panel_access_but_not_admin()
  {
    $developer = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($developer);
    $user = User::factory()->create();
    $role = Role::create(['name' => 'TestRole', 'guard_name' => 'api']);
    $permission = Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);
    $role->givePermissionTo($permission->name);
    /** @var User $user */
    $user->assignRole($role->name);
    $permissionsData = [
      'user_id' => $user->id,
      'permissions' => [$permission->name]
    ];

    $response = $this->deleteJson('/api/users/permissions/delete', $permissionsData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $role->refresh();
    $this->assertTrue($role->hasPermissionTo('TestPermission'));
  }

  public function test_add_roles_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    $user = User::factory()->create();
    Role::create(['name' => 'TestRole', 'guard_name' => 'api']);

    $rolesData = [
      'user_id' => $user->id,
      'roles' => ['TestRole']
    ];

    $response = $this->postJson('/api/users/roles/add', $rolesData);

    $response->assertStatus(Response::HTTP_OK);
    $response->assertJson(['message' => 'Roles updated successfully']);
    $this->assertTrue($user->hasRole('TestRole'));
  }

  public function test_add_roles_denied_for_user_with_panel_access_but_not_admin()
  {
    $developer = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($developer);
    $user = User::factory()->create();
    Role::create(['name' => 'TestRole', 'guard_name' => 'api']);

    $rolesData = [
      'user_id' => $user->id,
      'roles' => ['TestRole']
    ];

    $response = $this->postJson('/api/users/roles/add', $rolesData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertFalse($user->hasRole('TestRole'));
  }

  public function test_add_permissions_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    $user = User::factory()->create();
    Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);

    $permissionsData = [
      'user_id' => $user->id,
      'permissions' => ['TestPermission']
    ];

    $response = $this->postJson('/api/users/permissions/add', $permissionsData);

    $response->assertStatus(Response::HTTP_OK);
    $response->assertJson(['message' => 'Permissions updated successfully']);
    $this->assertTrue($user->hasPermissionTo('TestPermission'));
  }

  public function test_add_permissions_denied_for_user_with_panel_access_but_not_admin()
  {
    $developer = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($developer);
    $user = User::factory()->create();
    Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);

    $permissionsData = [
      'user_id' => $user->id,
      'permissions' => ['TestPermission']
    ];

    $response = $this->postJson('/api/users/permissions/add', $permissionsData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertFalse($user->hasPermissionTo('TestPermission'));
  }


}
