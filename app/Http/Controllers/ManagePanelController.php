<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;

class ManagePanelController extends Controller
{
  public function managePanels(Request $request): Response
  {
    if (!$request->user()->canAccessPanel()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }

    $data = Cache::remember('manage-panels', 60, function () use ($request) {
      $users = User::with(['roles.permissions', 'permissions'])->get();
      $roles = Role::all()->pluck('name');
      $permissions = Permission::all()->pluck('name');
      $isAdmin = $request->user()->isAdmin();

      return [
        'isAdmin' => $isAdmin,
        'permissions' => $permissions,
        'roles' => $roles,
        'users' => $users,
      ];
    });

    return response()->json($data, Response::HTTP_OK);
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

      Cache::forget('manage-panels');
      return response()->json($role, Response::HTTP_CREATED);
    } else {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
  }

  public function addRole(Request $request): Response
  {
    if (!$request->user()->isAdmin()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }

    $validatedData = $request->validate([
          'user_id' => 'required|integer',
          'name' => 'required|string|exists:roles,name',

      ]);

      $user = User::find($validatedData['user_id']);
      $roles = Role::where('name', $validatedData['name'])->first();

      if (!$user || !$roles) {
        return response()->json(['message' => 'User or Roles not found'], Response::HTTP_NOT_FOUND);
      } else {
        $user->assignRole($roles);
        Cache::forget('manage-panels');
        return response()->json(['message' => 'Roles updated successfully'], Response::HTTP_OK);
      }
  }

  public function addPermission(Request $request): Response
  {
    if (!$request->user()->isAdmin()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }

    $validatedData = $request->validate([
      'user_id' => 'required|integer',
      'name' => 'required|string|exists:permissions,name',
    ]);

    $user = User::find($validatedData['user_id']);
    $permission = Permission::where('name', $validatedData['name'])->first();

      if (!$user || !$permission) {
        return response()->json(['message' => 'User or Permission not found'], Response::HTTP_NOT_FOUND);
      } else {
        $user->givePermissionTo($permission);
        Cache::forget('manage-panels');
        return response()->json(['message' => 'Permissions updated successfully'], Response::HTTP_OK);
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

      Cache::forget('manage-panels');
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
        'name' => 'required|string|exists:roles,name'
      ]
    );

    try {
      $role = Role::where('name', $validatedData['name'])->first();

      if ($role) {
        $role->delete();
        Cache::forget('manage-panels');
        return response()->json(['message' => 'Role deleted successfully'],
        Response::HTTP_NO_CONTENT);
      }
      return response()->json(['message' => 'Role not found'], Response::HTTP_NOT_FOUND);
    } catch (Exception $e) {
      return response()->json(['message' => 'Failed to delete role', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
  }

  public function deletePermission(Request $request): Response
  {
    if (!$request->user()->isAdmin()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }

    $validatedData = $request->validate([
      'name' => 'required|string|exists:permissions,name',
    ]);

    try {
      $permission = Permission::where('name', $validatedData['name'])->first();

      if ($permission) {
        $permission->delete();
        Cache::forget('manage-panels');
        return response()->json(['message' => 'Permission deleted successfully'], Response::HTTP_NO_CONTENT);
      }

      return response()->json(['message' => 'Permission not found'], Response::HTTP_NOT_FOUND);
    } catch (Exception $e) {
      return response()->json(['message' => 'Failed to delete permission', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
  }

  public function revokeRole(Request $request): Response
  {
    if (!$request->user()->isAdmin()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }

    $validatedData = $request->validate([
      'user_id' => 'required|integer',
      'name' => 'required|string|exists:roles,name',
    ]);

    $user = User::find($validatedData['user_id']);
    $role = Role::where('name', $validatedData['name'])->first();

    if (!$user || !$role) {
      return response()->json(['message' => 'User or Role not found'], Response::HTTP_NOT_FOUND);
    } else {
      $user->removeRole($role);
      Cache::forget('manage-panels');
      return response()->json(['message' => 'Role revoked successfully'], Response::HTTP_OK);
    }
  }

  public function revokePermission(Request $request): Response
  {
    if (!$request->user()->isAdmin()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }

    $validatedData = $request->validate([
      'user_id' => 'required|integer',
      'name' => 'required|string|exists:permissions,name',
    ]);

    $user = User::find($validatedData['user_id']);
    $permission = Permission::where('name', $validatedData['name'])->first();

    if (!$user || !$permission) {
      return response()->json(['message' => 'User or Permission not found'], Response::HTTP_NOT_FOUND);
    } else {
      $user->revokePermissionTo($permission);
      Cache::forget('manage-panels');
      return response()->json(['message' => 'Permission revoked successfully'], Response::HTTP_OK);
    }
  }

}
