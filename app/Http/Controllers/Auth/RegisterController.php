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
    $user = User::create($request->validated());
    return response($user, Response::HTTP_CREATED);
  }
}
