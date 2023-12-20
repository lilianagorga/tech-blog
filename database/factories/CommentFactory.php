<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
          'comment' => fake()->realText(5000),
          'post_id' => Post::factory()->create()->id,
          'user_id' => User::factory()->create()->id,
          'parent_id' => null,
        ];
    }

  public function replyTo($commentId)
  {
    return $this->state(function (array $attributes) use ($commentId) {
      return [
        'parent_id' => $commentId,
      ];
    });
  }
}
