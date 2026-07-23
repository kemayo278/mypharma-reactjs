<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'sale_price' => $this->faker->numberBetween(1, 100),
            'purchase_price' => $this->faker->numberBetween(1, 100),
            'quantity' => $this->faker->numberBetween(1, 100),
            'quantity_alert' => $this->faker->numberBetween(1, 100),
            'picture' => $this->faker->imageUrl(),
            'category_id' => function () {
                return Category::factory()->create()->id;
            },
            // Ajoutez ici d'autres attributs personnalisés du modèle Product
        ];
    }
}
