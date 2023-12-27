<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProfileTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
    $this->user = $this->authUser();
  }

  public function test_edit_profile()
  {
    $response = $this->getJson('/api/profile');
    $response->assertOk();
    $response->assertJson([
      'user' => [
        'id' => $this->user->id,
        'name' => $this->user->name,
        'email' => $this->user->email,
      ],
    ]);
  }

  public function test_update_profile()
  {
    $this->user->email_verified_at = now()->subDay();
    $this->user->save();

    $originalTimestamp = $this->user->email_verified_at->timestamp;
    $updatedData = ['name' => 'Updated Name', 'email' => 'updated@example.com'];
    $response = $this->patchJson('/api/profile', $updatedData);
    $response->assertOk();
    $response->assertJson(['status' => 'profile-updated']);
    $this->assertDatabaseHas('users', [
      'id' => $this->user->id,
      'name' => 'Updated Name',
      'email' => 'updated@example.com',
    ]);
    $updatedUser = User::find($this->user->id);
    $updatedUser->refresh();
    $this->assertTrue(
      $updatedUser->email_verified_at->timestamp > $originalTimestamp,
      'email_verified_at should be updated'
    );
  }

  public function test_delete_profile()
  {
    $this->user->password = bcrypt('user-password');
    $this->user->save();
    $response = $this->deleteJson('/api/profile', ['password' => 'user-password']);
    $response->assertOk();
    $response->assertJson(['message' => 'User account deleted successfully.']);
    $this->assertDatabaseMissing('users', ['id' => $this->user->id]);
  }

}
