<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;

class ManagePanelController extends Controller
{
  public function managePanels(Request $request): Response
  {
    if ($request->user()->canAccessPanel()) {
      $users = User::with(['roles.permissions', 'permissions'])->get();
      $roles = Role::all()->pluck('name');
      $permissions = Permission::all()->pluck('name');
      $isAdmin = $request->user()->isAdmin();
      $data = [
        'isAdmin' => $isAdmin,
        'permissions' => $permissions,
        'roles' => $roles,
        'users' => $users,
      ];

      return response()->json($data, Response::HTTP_OK);
    } else {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
  }

  public function createRole(Request $request): Response
  {
    if ($request->user()->isAdmin()) {
      $validatedData = $request->validate(
        [
          'name' => 'required|string',
          'permissions' => 'sometimes|array'
        ]
      );

      $role = Role::create([
        'name' => $validatedData['name'],
        'guard_name' => 'api'
      ]);

      if ($validatedData['permissions']) {
        $permissions = Permission::whereIn('name', $validatedData['permissions'])->get();

        foreach ($permissions as $permission) {
          $role->givePermissionTo($permission);
          $permission->assignRole($role);
        }
      }

      return response()->json($role, Response::HTTP_CREATED);
    } else {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
  }

  public function addRoles(Request $request): Response
  {
    if ($request->user()->isAdmin()) {
      $validatedData = $request->validate(
        [
          'user_id' => 'required|integer',
          'roles' => 'required|array',
          'roles.*' => 'required|string|exists:roles,name'
        ]
      );

      $user = User::find($validatedData['user_id']);
      $roles = Role::whereIn('name', $validatedData['roles'])->get();

      if (!$user || $roles->isEmpty()) {
        return response()->json(['message' => 'User or Roles not found'], Response::HTTP_NOT_FOUND);
      }

      $user->assignRole($roles);

      return response()->json(['message' => 'Roles updated successfully'], Response::HTTP_OK);
    } else {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
  }

  public function addPermissions(Request $request): Response
  {
    if ($request->user()->isAdmin()) {
      $validatedData = $request->validate(
        [
          'user_id' => 'required|integer',
          'permissions' => 'required|array',
          'permissions.*' => 'required|string|exists:permissions,name'
        ]
      );

      $user = User::find($validatedData['user_id']);
      $permissions = Permission::whereIn('name', $validatedData['permissions'])->get();

      if (!$user || $permissions->isEmpty()) {
        return response()->json(['message' => 'User or Permissions not found'], Response::HTTP_NOT_FOUND);
      }
      foreach ($permissions as $permission) {
        $user->givePermissionTo($permission);
      }

      return response()->json(['message' => 'Permissions updated successfully'], Response::HTTP_OK);
    } else {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
  }

  public function createPermission(Request $request): Response
  {
    if ($request->user()->isAdmin()) {
      $validatedData = $request->validate(
        ['name' => 'required|string']
      );

      $permission = Permission::create([
        'name' => $validatedData['name'],
        'guard_name' => 'api'
      ]);

      return response()->json($permission, Response::HTTP_CREATED);
    } else {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
  }

  public function deleteRole(Request $request): Response
  {
    if (!$request->user()->isAdmin()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }

    $validatedData = $request->validate(
      [
        'user_id' => 'required|integer',
        'roles' => 'required|array',
        'roles.*' => 'required|string|exists:roles,name'
      ]
    );

    try {
      $user = User::findOrFail($validatedData['user_id']);
      $roles = Role::whereIn('name', $validatedData['roles'])->pluck('name');
      foreach ($roles as $role) {
        $user->removeRole($role);
      }

      return response()->json(['message' => 'Roles deleted successfully'], Response::HTTP_OK);
    } catch (ModelNotFoundException $e) {
      return response()->json(['message' => 'User or Role not found'], Response::HTTP_NOT_FOUND);
    } catch (Exception $e) {
      return response()->json(['message' => 'Failed to delete role', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
  }


  public function deletePermission(Request $request): Response
  {
    if (!$request->user()->isAdmin()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }

    $validatedData = $request->validate(
      [
        'user_id' => 'required|integer',
        'permissions' => 'required|array',
        'permissions.*' => 'required|string|exists:permissions,name'
      ]
    );

    try {
      $user = User::findOrFail($validatedData['user_id']);
      $permissions = Permission::whereIn('name', $validatedData['permissions'])->pluck('name');
      foreach ($permissions as $permission) {
        if ($user->hasDirectPermission($permission)) {
          $user->revokePermissionTo($permission);
        }
      }

      foreach ($user->roles as $role) {
        foreach ($permissions as $permission) {
          if ($role->hasPermissionTo($permission)) {
            $role->revokePermissionTo($permission);
          }
        }
      }

      return response()->json(['message' => 'Permission deleted successfully'], Response::HTTP_OK);
    } catch (ModelNotFoundException $e) {
      return response()->json(['message' => 'Permission not found'], Response::HTTP_NOT_FOUND);
    } catch (Exception $e) {
      return response()->json(['message' => 'Failed to delete permission', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
  }

}
