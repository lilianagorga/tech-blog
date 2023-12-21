<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class LogoutController extends Controller
{
  public function logout(): Response
  {
    /** @var User $user */
    $user = Auth::user();
    $user->currentAccessToken()->delete();
    return response(['success' => true]);
  }
}
