<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
  use RefreshDatabase;

  public function testUserCanLoginWithEmailAndPassword(): void
  {
    $user = $this->createUser();
    $response = $this->postJson('/api/user/login', ['email' => $user->email, 'password' => 'password'])->assertOk();

    $this->assertArrayHasKey('token', $response->json());
  }

  public function testIfUserEmailIsNotAvailableThenItReturnError(): void
  {
    $this->postJson('/api/user/login', ['email' => 'test@test.com', 'password' => 'password'])->assertUnprocessable();
  }

  public function testItRaiseErrorIfPasswordIsIncorrect(): void
  {
    $user = $this->createUser();
    $this->postJson('/api/user/login', ['email' => $user->email, 'password' => 'random'])->assertUnprocessable();
  }
}
