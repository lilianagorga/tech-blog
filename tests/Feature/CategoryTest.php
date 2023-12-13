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
    $this->user = $this->authUser();
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

  public function test_categories_can_be_retrieved(): void
  {
    $this->createCategory();

    $response = $this->getJson('/api/categories');

    $response->assertOk();
    $response->assertJsonCount(5);
  }

  public function test_a_category_can_be_created(): void
  {
    $categoryData = [
      'title' => 'new category',
      'slug' => 'new-category'
    ];

    $response = $this->postJson('/api/categories', $categoryData);

    $response->assertCreated();
    $this->assertDatabaseHas('categories', $categoryData);
  }

  public function test_a_single_category_can_be_retrieved(): void
  {
    $category = $this->createCategory();

    $response = $this->getJson('/api/categories/' . $category->first()->id);

    $response->assertOk();
    $response->assertJsonFragment([
      'title' => $category->first()->title,
      'slug' => $category->first()->slug
    ]);
  }

  public function test_a_category_can_be_updated(): void
  {
    $category = $this->createCategory()->first();
    $updatedData = ['title' => 'Category Update', 'slug' => 'category-update'];

    $response = $this->putJson('/api/categories/' . $category->id, $updatedData);

    $response->assertOk();
    $this->assertDatabaseHas('categories', $updatedData);
  }

  public function test_a_category_can_be_deleted(): void
  {
    $category = $this->createCategory()->first();

    $response = $this->deleteJson('/api/categories/' . $category->id);

    $response->assertNoContent();
    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
  }



}
