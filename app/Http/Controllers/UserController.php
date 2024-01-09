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

}

