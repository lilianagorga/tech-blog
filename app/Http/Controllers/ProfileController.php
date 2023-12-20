<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\JsonResponse;

class ProfileController extends Controller
{
  public function edit(Request $request): JsonResponse
  {
    return response()->json([
      'user' => $request->user(),
    ]);
  }

  public function update(ProfileUpdateRequest $request): JsonResponse
  {
    $user = $request->user();
    $user->fill($request->validated());

    if ($user->isDirty('email')) {
      $user->email_verified_at = null;
    }

    $user->save();

    return response()->json(['status' => 'profile-updated']);
  }
  public function destroy(Request $request): JsonResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);

    $user = $request->user();
    $user->delete();

    return response()->json(['message' => 'User account deleted successfully.'], 200);
  }
}
