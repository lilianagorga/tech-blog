<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use http\Env\Response;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Tests\TestCase;

class LogoutTest extends TestCase
{
  use RefreshDatabase;

  public function test_check_if_post_route_exists(): void
  {
    $user = $this->authUser();
    $this->assertEquals('tech_blog_testing', config('database.connections.mysql.database'));
    $response = $this->actingAs($user)->post('/api/logout');
    $response->assertOk();
  }

  public function test_user_can_logout()
  {

    /** @var User $user */
    $user = $this->createUser();

    $this->assertNotNull($user);
    $token = $user->createToken('main')->plainTextToken;
//    $token = $user->currentAccessToken();

//    $loginResponse = $this->actingAs($user, 'api')->postJson('/api/user/login', ['email' => $user->email, 'password' => 'password']);
//
//    $loginResponse->assertOk();
//    $token = $loginResponse->json('token');

//    Log::Info("testing tokenid 1:" . $token->id);

    Log::Info("User ID  : " . $user->id);

    Log::Info("first log testing token :" . $token);

    $tokenId = (int)explode('|', $token, 2)[0];

    Log::Info("second log testing token id :" . $tokenId);

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/logout');

    $response->assertOk()->assertJson(['success' => true]);
//    sleep(60);
    $this->assertDatabaseMissing('personal_access_tokens', [
      'id' => $tokenId,
    ]);
  }
}
