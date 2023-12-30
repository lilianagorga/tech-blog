<?php

namespace Tests\Feature;

use App\Models\Vote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class VoteTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
    $this->user = $this->authUser();
  }

  public function test_user_can_vote_positive_a_post()
  {
    $post = $this->createPost();
    $response = $this->actingAs($this->user)->postJson("/api/votes/up", ['post_id' => $post->id]);
    $response->assertCreated();
    $response->assertJsonStructure([
      'type',
      'post_id',
      'user_id',
      'id',
      'created_at',
      'updated_at'
    ]);

    $this->assertDatabaseHas('votes', [
      'post_id' => $post->id,
      'user_id' => $this->user->id,
      'type' => 'up'
    ]);
  }

  public function test_user_can_vote_negative_a_post()
  {
    $post = $this->createPost();
    $response = $this->actingAs($this->user)->postJson("/api/votes/down", ['post_id' => $post->id]);
    $response->assertCreated();
    $response->assertJsonStructure([
      'type',
      'post_id',
      'user_id',
      'id',
      'created_at',
      'updated_at'
    ]);
    $this->assertDatabaseHas('votes', [
      'post_id' => $post->id,
      'user_id' => $this->user->id,
      'type' => 'down'
    ]);
  }

  public function test_user_can_update_vote()
  {
    $user = $this->user;
    $post = $this->createPost();
    $vote = Vote::factory()->create([
      'post_id' => $post->id,
      'user_id' => $user->id,
      'type' => 'up'
    ]);

    $newType = 'down';
    $response = $this->patchJson("/api/votes/{$vote->id}", ['type' => $newType]);

    $response->assertOk();
    $response->assertJson([
      'message' => 'Vote updated',
      'vote' => [
        'id' => $vote->id,
        'type' => $newType
      ]
    ]);

    $this->assertDatabaseHas('votes', [
      'id' => $vote->id,
      'type' => $newType
    ]);
  }

  public function test_user_can_delete_vote()
  {
    $user = $this->user;
    $post = $this->createPost();
    $vote = Vote::factory()->create([
      'post_id' => $post->id,
      'user_id' => $user->id
    ]);

    $response = $this->deleteJson("/api/votes/{$vote->id}");
    $response->assertNoContent();
    $this->assertDatabaseMissing('votes', ['id' => $vote->id]);
  }



}
