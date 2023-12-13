<?php

namespace Tests\Feature;

use App\Http\Controllers\PostController;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Schema;

class PostTest extends TestCase
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

    public function test_check_if_post_controller_exists(): void
    {
      $this->assertTrue(class_exists(PostController::class));
    }

    public function test_check_if_post_model_exists(): void
    {
      $this->assertTrue(class_exists(Post::class));
    }

    public function test_check_if_post_migration_exists(): void
    {
      $this->artisan('migrate');
      $this->assertTrue(Schema::hasTable('posts'));
    }

  public function test_a_post_can_be_created(): void
  {
    $user = $this->authUser();
    $postData = [
      'title' => 'New Post Title',
      'slug' => 'new-post-title',
      'body' => 'This is the body of the new post',
      'active' => true,
      'published_at' => now()->toDateTimeString(),
    ];

    $response = $this->postJson('/api/posts', $postData);

    $response->assertCreated();
    $this->assertDatabaseHas('posts', [
      'title' => $postData['title'],
      'slug' => $postData['slug'],
      'body' => $postData['body'],
      'active' => $postData['active'],
      'published_at' => $postData['published_at'],
      'user_id' => $user->id,
    ]);
  }

  public function test_a_single_post_can_be_retrieved(): void
  {
    $post = $this->createPost();

    $response = $this->getJson('/api/posts/'.$post->id);

    $response->assertOk();
    $response->assertJson([
      'id' => $post->id,
      'title' => $post->title,
      'slug' => $post->slug,
      'body' => $post->body,
      'active' => $post->active,
      'published_at' => $post->published_at ? $post->published_at->toJSON() : null,
      'user_id' => $post->user_id
    ]);
  }

  public function test_a_post_can_be_updated(): void
  {
    $post = $this->createPost();
    $updatedData = [
      'title' => 'Updated Post Title',
      'slug' => 'updated-post-title',
      'body' => 'This is the updated body of the post',
      'active' => false,
      'published_at' => now()->addDay()->toDateTimeString(),
    ];

    $response = $this->putJson('/api/posts/'.$post->id, $updatedData);

    $response->assertOk();
    $this->assertDatabaseHas('posts', array_merge(['id' => $post->id], $updatedData));
  }

  public function test_a_post_can_be_deleted(): void
  {
    $post = $this->createPost();

    $response = $this->deleteJson('/api/posts/'.$post->id);

    $response->assertNoContent();
    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
  }

}
