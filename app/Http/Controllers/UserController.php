<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
  public function index(): Response
  {
    $users = User::all();
    return response()->json($users);
  }

  public function show(User $user): Response
  {
    return response()->json($user);
  }

  public function update(Request $request, User $user): Response
  {
    $validatedData = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|email|max:255|unique:users,email,' . $user->id,
      'password' => 'sometimes'|'string'|'min:6'
    ]);

    if (!empty($validatedData['password'])) {
      $validatedData['password'] = Hash::make($validatedData['password']);
    }

    $user->update(array_filter($validatedData));
    return response()->json($user);
  }


  public function destroy(User $user): Response
  {
    $user->delete();
    return response()->json(null, Response::HTTP_NO_CONTENT);
  }

  public function managePanels(Request $request): Response
  {
    if ($request->user()->canAccessPanel()) {
      $users = User::with('roles', 'permissions')->get();


      $roles = Role::all()->pluck('name');
      $permissions = Permission::all()->pluck('name');

      $data = [
        'permissions' => $permissions,
        'roles' => $roles,
        'users' => $users
      ];

      return response()->json($data, status: Response::HTTP_OK);
    } else {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
  }

  public function roles(Request $request): Response
  {
    if ($request->user()->canAccessPanel()) {
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
    if ($request->user()->canAccessPanel()) {
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
    if ($request->user()->canAccessPanel()) {
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

      $user->syncPermissions($permissions);

      return response()->json(['message' => 'Permissions updated successfully'], Response::HTTP_OK);
    } else {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
  }

  public function permissions(Request $request): Response
  {
    if ($request->user()->canAccessPanel()) {
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

}

