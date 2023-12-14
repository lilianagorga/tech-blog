<?php

namespace Database\Factories;

use App\Models\TextWidget;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<TextWidget>
 */
class TextWidgetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
          'title' => fake()->sentence,
          'active' => fake()->boolean,
          'content' => fake()->paragraph,
          'key' => Str::slug(fake()->sentence),
          'image' => fake()->imageUrl,
        ];
    }
}
