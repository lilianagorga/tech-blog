<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PostViewTest extends TestCase
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
    $response = $this->get('/api/posts');
    $response->assertOk();
  }

  public function testPostViewCanBeRecorded()
  {
    $post = Post::factory()->create();
    $user = User::factory()->create();

    $response = $this->postJson('/api/posts/' . $post->id . '/views', [
      'post_id' => $post->id,
      'ip_address' => '123.45.67.89',
      'user_agent' => 'test user agent',
      'user_id' => $user->id,
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('post_views', [
      'post_id' => $post->id,
      'ip_address' => '123.45.67.89',
      'user_agent' => 'test user agent',
      'user_id' => $user->id,
    ]);
  }
}
