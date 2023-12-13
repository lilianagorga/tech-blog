<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
  use RefreshDatabase;

  public function testAUserCanRegister()
  {
    $this->postJson('/api/user/register',
      ['name' => 'Liliana', 'email' => 'test@test.it', 'password' => 'secret123', 'password_confirmation' => 'secret123' ])
      ->assertCreated();
    $this->assertDatabaseHas('users', ['name' => 'Liliana']);
  }
}
