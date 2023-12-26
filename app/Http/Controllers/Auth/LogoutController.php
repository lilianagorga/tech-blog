<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Sanctum;
use Symfony\Component\HttpFoundation\Response;

class LogoutController extends Controller
{
  public function logout(): Response
  {
    /** @var User $user */
    $user = Auth::user();
    if ($user) {
      Log::info('Got here with user ID : ' .$user->id);
      $token = $user->currentAccessToken();
      Log::info('token found: ' . $token);
      if ($token) {
//        $tokenId = (int)explode('|', $token, 2)[0];
//        Log::Info("tokenid : " . $tokenId);
        $token->delete();
        Log::info("Token deleted for user ID: " . $user->id);
      } else {
        Log::info("No current access token found for user ID: " . $user->id);
      }
    }

    return response(['success' => true]);
  }

}
