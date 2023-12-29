<?php

namespace Tests\Feature;

use App\Http\Controllers\PostController;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use DateTimeInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

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
    $post = $this->createPost([
      'active' => true,
      'published_at' => now()->subDay()
    ]);

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

  public function test_a_single_post_is_not_retrieved_if_not_active(): void
  {
    $post = $this->createPost(['active' => false]);
    $this->assertFalse($post->active);

    $response = $this->getJson('/api/posts/'.$post->id);
    $response->assertNotFound();
  }

  public function test_a_post_can_be_updated(): void
  {
    $user = $this->user;
    $post = $this->createPost(['user_id' => $user->id]);
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
    $user = $this->user;
    $post = $this->createPost(['user_id' => $user->id]);

    $response = $this->deleteJson('/api/posts/'.$post->id);

    $response->assertNoContent();
    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
  }

  public function test_posts_can_be_retrieved_by_category(): void {
    $category = Category::factory()->create();
    $posts = Post::factory()->count(2)->create(['active' => true]);
    foreach ($posts as $post) {
      $this->assertNotNull($post->published_at);
      $this->assertTrue($post->published_at->isPast() || $post->published_at->isToday());
      $post->categories()->attach($category->id);
    }

    $response = $this->getJson('/api/category/'.$category->slug);
    $response->assertOk();
    $response->assertJsonCount(2, 'data');
  }

  public function test_posts_can_be_filtered_by_category(): void {
    $category = Category::factory()->create();
    $posts = Post::factory()->count(2)->create(['active' => true]);
    foreach ($posts as $post) {
      $this->assertNotNull($post->published_at);
      $this->assertTrue($post->published_at->isPast() || $post->published_at->isToday());
      $post->categories()->attach($category->id);
    }

    $response = $this->getJson('/api/posts?category=' . $category->slug);
    $response->assertOk();
    $response->assertJsonCount(2, 'data');
  }

  public function test_posts_can_be_searched(): void
  {
    $userId = User::factory()->create()->id;
    $yesterday = now()->subDay();
    $this->createPost([
      'title' => 'Unique title',
      'slug' => 'Unique-title',
      'active' => true,
      'published_at' => $yesterday,
      'body' => 'Unique body',
      'user_id' => $userId
    ]);
    $this->assertDatabaseHas('posts', ['title' => 'Unique title']);
    $response = $this->getJson('/api/search?q=Unique');
    $response->assertOk();
  }


  public function test_posts_can_be_sorted(): void
  {
    Post::factory()->count(3)->create(['active' => true]);

    $response = $this->getJson('/api/posts?sort=published_at&order=asc');
    $response->assertOk();
  }


}
