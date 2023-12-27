<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
  public function me(Request $request)
  {
    return $request->user();
  }

  public function register(RegisterRequest $request): Response
  {
    $data = $request->validated();
    /** @var User $user */
    $user = User::create([
      'name' => $data['name'],
      'email' => $data['email'],
      'password' => bcrypt($data['password'])
    ]);
    $user->markEmailAsVerified();
    return response(['user' => $user], Response::HTTP_CREATED);
//    $token = $user->createToken('main')->plainTextToken;
//    return response(['user' => $user, 'token' => $token], Response::HTTP_CREATED);
  }

  public function login(LoginRequest $request): Response
  {
    /** @var User $user */
    $credentials = $request->validated();
    $remember = $credentials['remember'] ?? false;
    unset($credentials['remember']);

    if (!Auth::attempt($credentials, $remember)) {
      return response([
        'error' => 'The provided credentials are not correct'
      ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    $user = Auth::user();
    $token = $user->createToken('main')->plainTextToken;
    return response(['user' => $user, 'token' => $token]);
  }

  public function logout(): Response
  {
    /** @var User $user */
    $user = Auth::user();
    if ($user) {
      Log::info('Got here with user ID : ' .$user->id);
      $token = $user->currentAccessToken();
      Log::info('token found: ' . $token);
      if ($token) {
        $token->delete();
        Log::info("Token deleted for user ID: " . $user->id);
      } else {
        Log::info("No current access token found for user ID: " . $user->id);
      }
    }

    return response(['success' => true]);
  }
}
