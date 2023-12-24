<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use http\Env\Response;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Tests\TestCase;

class LogoutTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
    $this->user = $this->authUser();
  }

  public function test_check_if_post_route_exists(): void
  {
    $this->assertEquals('tech_blog_testing', config('database.connections.mysql.database'));
    $response = $this->post('/api/logout');
    $response->assertOk();
  }

  public function test_user_can_logout()
  {
    $user = $this->createUser();
    $this->assertNotNull($user);
    /** @var User $user */
    $token = $user->createToken('testToken')->plainTextToken;
    error_log("Token: " . $token);
    $this->assertDatabaseHas('personal_access_tokens', ['tokenable_id' => $user->id]);
    $tokenId = (int)explode('|', $token, 2)[1];
    error_log("Token ID: " . $tokenId);

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/logout');

    $response->assertOk()->assertJson(['success' => true]);

    $this->assertDatabaseMissing('personal_access_tokens', [
      'id' => $tokenId,
    ]);
  }
}
