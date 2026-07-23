<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'sell_price' => $this->faker->numberBetween(1, 100),
            'order_id' => function () {
                return Order::factory()->create()->id;
            },
            'product_id' => function () {
                return Product::factory()->create()->id;
            },
            'quantity' => $this->faker->numberBetween(1, 10),
            // Ajoutez ici d'autres attributs personnalisés du modèle Sale
        ];
    }
}
