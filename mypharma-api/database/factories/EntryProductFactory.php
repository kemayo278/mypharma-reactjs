<?php

namespace Database\Factories;

use App\Models\Entry;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class EntryProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'entry_purchase_price' => $this->faker->numberBetween(1, 100),
            'product_id' => function () {
                return Product::factory()->create()->id;
            },
            'entry_id' => function () {
                return Entry::factory()->create()->id;
            },
            'quantity' => $this->faker->randomNumber(2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
