<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogoutController extends Controller
{
//  public function logout(): Response
//  {
//    /** @var User $user */
//    $user = Auth::user();
//    $user->currentAccessToken()->delete();
//    return response(['success' => true]);
//  }

  public function logout(): Response
  {
    /** @var User $user */
    $user = Auth::user();

    if ($user) {
      $token = $user->currentAccessToken();
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
