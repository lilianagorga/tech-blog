<?php

namespace Tests;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

  public function setUp(): void
  {
    parent::setUp();
    $this->withoutExceptionHandling();
  }

  public function createCategory($count = 5)
  {
    return Category::factory()->count($count)->create();
  }

  public function createPost($args = [])
  {
    return Post::factory()->create($args);
  }

  public function createUser($args = [])
  {
    return User::factory()->create($args);
  }

  public function authUser()
  {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    return $user;
  }
}
