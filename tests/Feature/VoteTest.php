<?php

namespace Tests\Feature;

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
    $response = $this->actingAs($this->user)->postJson("/api/posts/{$post->id}/vote/up");
    $response->assertOk();
    $response->assertJson(['message' => 'Vote recorded']);
    $this->assertDatabaseHas('votes', [
      'post_id' => $post->id,
      'user_id' => $this->user->id,
      'vote' => 'up'
    ]);
  }

  public function test_user_can_vote_negative_a_post()
  {
    $post = $this->createPost();
    $response = $this->actingAs($this->user)->postJson("/api/posts/{$post->id}/vote/down");
    $response->assertOk();
    $response->assertJson(['message' => 'Vote recorded']);
    $this->assertDatabaseHas('votes', [
      'post_id' => $post->id,
      'user_id' => $this->user->id,
      'vote' => 'down'
    ]);
  }

}
