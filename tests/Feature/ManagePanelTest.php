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
    $response = $this->getJson('/api/manage-panels');
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
    Permission::findOrCreate('managePanel', 'api');
    $response = $this->getJson('/api/manage-panels');
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
    $roles = ['Admin', 'Writer', 'Moderator'];
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
    ];
    $response = $this->postJson('/api/roles', $roleData);
    $response->assertStatus(Response::HTTP_CREATED);
    $response->assertJson(['name' => 'NewRole']);
    $this->assertDatabaseHas('roles', ['name' => 'NewRole']);
  }

  public function test_create_role_denied_for_non_admin_user()
  {
    $user = $this->createUser();
    Sanctum::actingAs($user);
    $roleData = [
      'name' => 'NewRole',
    ];
    $response = $this->postJson('/api/roles', $roleData);
    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertDatabaseMissing('roles', ['name' => 'NewRole']);
  }

  public function test_create_role_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);
    $roleData = [
      'name' => 'Marketer',
    ];
    $response = $this->postJson('/api/roles', $roleData);
    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertDatabaseMissing('roles', ['name' => 'Marketer']);
  }

  public function test_update_role_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    Role::firstOrCreate(['name' => 'Marketer', 'guard_name' => 'api']);
    Permission::firstOrCreate(['name' => 'editPosts', 'guard_name' => 'api']);
    Permission::firstOrCreate(['name' => 'deletePosts', 'guard_name' => 'api']);
    $updateData = [
      'name' => 'Marketer',
      'permissions' => ['editPosts', 'deletePosts']
    ];
    $response = $this->putJson('/api/roles', $updateData);
    $response->assertStatus(Response::HTTP_OK);
    $response->assertJson([
      'message' => 'Role permissions updated successfully',
      'role' => [
        'name' => 'Marketer',
        'guard_name' => 'api',
        'permissions' => [
          ['name' => 'editPosts', 'guard_name' => 'api'],
          ['name' => 'deletePosts', 'guard_name' => 'api']
        ]
      ]
    ]);

    $updatedRole = Role::findByName('Marketer', 'api');
    $this->assertTrue($updatedRole->hasPermissionTo('editPosts'));
    $this->assertTrue($updatedRole->hasPermissionTo('deletePosts'));
    $updatedPermissions = $updatedRole->permissions->pluck('name')->sort()->values();
    $expectedPermissions = collect($updateData['permissions'])->sort()->values();
    $this->assertEquals($expectedPermissions, $updatedPermissions);
    $this->assertEquals('api', $updatedRole->guard_name);
  }

  public function test_update_role_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);
    $updateData = [
      'name' => 'SomeRole',
      'permissions' => ['some_permission']
    ];
    $response = $this->putJson('/api/roles', $updateData);
    $response->assertStatus(Response::HTTP_FORBIDDEN);
  }

  public function test_create_permission_successfully()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);

    $permissionData = [
      'name' => 'new permission'
    ];

    $response = $this->postJson('/api/permissions', $permissionData);

    $response->assertStatus(Response::HTTP_CREATED);
    $response->assertJson(['name' => 'new permission']);
    $this->assertDatabaseHas('permissions', ['name' => 'new permission']);
  }

  public function test_create_permission_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);

    $permissionData = [
      'name' => 'editPosts'
    ];

    $response = $this->postJson('/api/permissions', $permissionData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertDatabaseMissing('permissions', ['name' => 'editPosts']);
  }

  public function test_delete_role_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    $role = Role::create(['name' => 'TestRole', 'guard_name' => 'api']);
    $rolesData = ['name' => $role->name];

    $response = $this->deleteJson('/api/roles/delete', $rolesData);

    $response->assertStatus(Response::HTTP_NO_CONTENT);
    $this->assertDatabaseMissing('roles', ['name' => 'TestRole']);
  }

  public function test_delete_role_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);
    $user = User::factory()->create();
    $role = Role::create(['name' => 'TestRole', 'guard_name' => 'api']);
    /** @var User $user */
    $user->assignRole($role->name);
    $rolesData = ['name' => $role->name];

    $response = $this->deleteJson('/api/roles/delete', $rolesData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertDatabaseHas('roles', ['name' => 'TestRole']);
  }

  public function test_delete_permission_successfully_by_admin()
{
  $admin = $this->addRolesAndPermissionsToAdmin();
  Sanctum::actingAs($admin);

  $permission = Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);

  $permissionsData = ['name' => $permission->name];

  $response = $this->deleteJson('/api/permissions/delete', $permissionsData);
  $response->assertStatus(Response::HTTP_NO_CONTENT);

  $this->assertDatabaseMissing('permissions', ['name' => 'TestPermission']);
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
    $permissionsData = ['name' => $permission->name];

    $response = $this->deleteJson('/api/permissions/delete', $permissionsData);
    $response->assertStatus(Response::HTTP_NO_CONTENT);

    $this->assertDatabaseMissing('permissions', ['name' => 'TestPermission']);
  }


  public function test_delete_permission_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);
    $user = User::factory()->create();
    $permission = Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);
    /** @var User $user */
    $user->givePermissionTo($permission->name);
    $permissionsData = [
      'name' => $permission->name
    ];

    $response = $this->deleteJson('/api/permissions/delete', $permissionsData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertDatabaseHas('permissions', ['name' => 'TestPermission']);
  }

  public function test_delete_permission_associated_to_role_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);

    $permission = Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);

    $permissionsData = ['name' => $permission->name];

    $response = $this->deleteJson('/api/permissions/delete', $permissionsData);
    $response->assertStatus(Response::HTTP_FORBIDDEN);

    $this->assertDatabaseHas('permissions', ['name' => 'TestPermission']);
  }

  public function test_add_roles_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    /** @var User $user */
    $user = User::factory()->create();
    Role::create(['name' => 'TestRole', 'guard_name' => 'api']);
    $rolesData = [
      'user_id' => $user->id,
      'name' => 'TestRole'
    ];

    $response = $this->postJson('/api/roles/assign', $rolesData);

    $response->assertStatus(Response::HTTP_OK);
    $response->assertJson(['message' => 'Roles updated successfully']);
    $this->assertTrue($user->hasRole('TestRole'));
  }

  public function test_add_roles_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);
    /** @var User $user */
    $user = User::factory()->create();
    Role::create(['name' => 'TestRole', 'guard_name' => 'api']);

    $rolesData = [
      'user_id' => $user->id,
      'name' => 'TestRole'
    ];

    $response = $this->postJson('/api/roles/assign', $rolesData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertFalse($user->hasRole('TestRole'));
  }

  public function test_add_permissions_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    /** @var User $user */
    $user = User::factory()->create();
    Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);

    $permissionsData = [
      'user_id' => $user->id,
      'name' => 'TestPermission'
    ];

    $response = $this->postJson('/api/permissions/assign', $permissionsData);

    $response->assertStatus(Response::HTTP_OK);
    $response->assertJson(['message' => 'Permissions updated successfully']);
    $this->assertTrue($user->hasPermissionTo('TestPermission'));
  }

  public function test_add_permissions_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);
    /** @var User $user */
    $user = User::factory()->create();
    Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);

    $permissionsData = [
      'user_id' => $user->id,
      'name' => 'TestPermission'
    ];

    $response = $this->postJson('/api/permissions/assign', $permissionsData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $this->assertFalse($user->hasPermissionTo('TestPermission'));
  }

  public function test_revoke_role_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    /** @var User $user */
    $user = User::factory()->create();
    $role = Role::create(['name' => 'TestRole', 'guard_name' => 'api']);
    $user->assignRole($role);

    $rolesData = [
      'user_id' => $user->id,
      'name' => $role->name
    ];

    $response = $this->postJson('/api/roles/revoke', $rolesData);

    $response->assertStatus(Response::HTTP_OK);
    $response->assertJson(['message' => 'Role revoked successfully']);
    $this->assertFalse($user->hasRole('TestRole'));
  }

  public function test_revoke_role_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);
    /** @var User $user */
    $user = User::factory()->create();
    $role = Role::create(['name' => 'TestRole', 'guard_name' => 'api']);
    $user->assignRole($role);

    $rolesData = [
      'user_id' => $user->id,
      'name' => $role->name
    ];

    $response = $this->postJson('/api/roles/revoke', $rolesData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $response->assertJson(['message' => 'Access Forbidden']);
    $this->assertTrue($user->hasRole('TestRole'));
  }

  public function test_revoke_permission_successfully_by_admin()
  {
    $admin = $this->addRolesAndPermissionsToAdmin();
    Sanctum::actingAs($admin);
    /** @var User $user */
    $user = User::factory()->create();
    $permission = Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);
    $user->givePermissionTo($permission);

    $permissionsData = [
      'user_id' => $user->id,
      'name' => $permission->name
    ];

    $response = $this->postJson('/api/permissions/revoke', $permissionsData);

    $response->assertStatus(Response::HTTP_OK);
    $response->assertJson(['message' => 'Permission revoked successfully']);
    $this->assertFalse($user->hasPermissionTo('TestPermission'));
  }

  public function test_revoke_permission_denied_for_user_with_panel_access_but_not_admin()
  {
    $moderator = $this->createUserWithSpecificRoleAndPermissions();
    Sanctum::actingAs($moderator);
    /** @var User $user */
    $user = User::factory()->create();
    $permission = Permission::create(['name' => 'TestPermission', 'guard_name' => 'api']);
    $user->givePermissionTo($permission);

    $permissionsData = [
      'user_id' => $user->id,
      'name' => $permission->name
    ];

    $response = $this->postJson('/api/permissions/revoke', $permissionsData);

    $response->assertStatus(Response::HTTP_FORBIDDEN);
    $response->assertJson(['message' => 'Access Forbidden']);
    $this->assertTrue($user->hasPermissionTo('TestPermission'));
  }


}
