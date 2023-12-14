<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
    $this->user = $this->authUser();
  }

  public function test_users_can_be_listed()
  {
    $this->createUserCount();
    $response = $this->getJson('/api/users');
    $response->assertOk();
    $response->assertJsonCount(6);
  }

  public function test_a_single_user_can_be_retrieved()
  {
    $user = $this->createUser();
    $response = $this->getJson('/api/users/'.$user->id);
    $response->assertOk();
    $response->assertJsonPath('id', $user->id);
  }

  public function test_a_user_can_be_updated()
  {
    $user = $this->createUser();
    $updatedData = [
      'name' => 'Updated Name',
      'email' => fake()->unique()->safeEmail(),
      ];
    $response = $this->putJson('/api/users/'.$user->id, $updatedData);
    $response->assertOk();
    $this->assertDatabaseHas('users', [
      'id' => $user->id,
      'name' => 'Updated Name',
      'email' => $updatedData['email'],
    ]);
  }

  public function test_a_user_can_be_deleted()
  {
    $user = $this->createUser();
    $response = $this->deleteJson('/api/users/'.$user->id);
    $response->assertNoContent();
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
  }
}
