<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
  public function __invoke(LoginRequest $request): Response
  {
//    $user = User::whereEmail($request->email)->first();
//
//    if(!$user || !Hash::check($request->password, $user->password))
//    {
//      return response("Credentials don't match", Response::HTTP_UNAUTHORIZED);
//    }
//
//    $token = $user->createToken('api');
//    return response(['token' => $token->plainTextToken]);
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
}
