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
}
