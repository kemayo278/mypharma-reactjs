<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [

            'invoice_number' => $this->faker->numerify('Facture n° ###'),
            'user_id' => function () {
                return User::factory()->create()->id;
            },
            'provider_id' => function () {
                return Provider::factory()->create()->id;
            },
            'date_entry' => $this->faker->date,

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
