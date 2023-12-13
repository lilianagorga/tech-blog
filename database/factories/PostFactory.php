<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      $title = fake()->realText(50);
      return [
        'title' => $title,
        'slug' => Str::slug($title),
        'thumbnail' => fake()->imageUrl,
        'body' => fake()->realText(5000),
        'active' => fake()->boolean,
        'published_at' => fake()->dateTime,
        'user_id' => User::factory()->create()->id,
      ];
    }
}
