<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RegisterController extends Controller
{
  public function __invoke(RegisterRequest $request): Response
  {
//    $user = User::create($request->validated());
//    return response($user, Response::HTTP_CREATED);
    $data = $request->validated();
    /** @var User $user */
    $user = User::create([
      'name' => $data['name'],
      'email' => $data['email'],
      'password' => bcrypt($data['password'])
    ]);
    $user->markEmailAsVerified();
    $token = $user->createToken('main')->plainTextToken;
    return response(['user' => $user, 'token' => $token], Response::HTTP_CREATED);
  }
}
