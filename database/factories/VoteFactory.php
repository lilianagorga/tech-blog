<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vote>
 */
class VoteFactory extends Factory
{
  protected $model = Vote::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
          'type' => $this->faker->randomElement(['up', 'down']),
          'post_id' => Post::factory(),
          'user_id' => User::factory(),
        ];
    }
}
