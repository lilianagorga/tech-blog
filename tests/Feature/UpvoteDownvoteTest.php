<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UpvoteDownvoteTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
    $this->user = $this->authUser();
  }

  public function test_user_can_upvote_a_post()
  {
    $post = $this->createPost();
    $response = $this->actingAs($this->user)->postJson("/api/posts/{$post->id}/upvote");
    $response->assertOk();
    $response->assertJson(['message' => 'Vote recorded']);
    $this->assertDatabaseHas('upvote_downvotes', [
      'post_id' => $post->id,
      'user_id' => $this->user->id,
      'is_upvote' => true
    ]);
  }

  public function test_user_can_downvote_a_post()
  {
    $post = $this->createPost();
    $response = $this->actingAs($this->user)->postJson("/api/posts/{$post->id}/downvote");
    $response->assertOk();
    $response->assertJson(['message' => 'Vote recorded']);
    $this->assertDatabaseHas('upvote_downvotes', [
      'post_id' => $post->id,
      'user_id' => $this->user->id,
      'is_upvote' => false
    ]);
  }

}
