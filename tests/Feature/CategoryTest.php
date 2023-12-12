<?php

namespace Tests\Feature;

use App\Http\Controllers\CategoryController;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CategoryTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
  }

  public function test_check_if_post_route_exists(): void
  {
    $this->assertEquals('tech_blog_testing', config('database.connections.mysql.database'));
    $response = $this->get('/api/categories');
    $response->assertOk();
  }

  public function test_check_if_post_controller_exists(): void
  {
    $this->assertTrue(class_exists(CategoryController::class));
  }

  public function test_check_if_post_model_exists(): void
  {
    $this->assertTrue(class_exists(Category::class));
  }

  public function test_check_if_post_migration_exists(): void
  {
    $this->artisan('migrate');
    $this->assertTrue(Schema::hasTable('categories'));
  }
}
