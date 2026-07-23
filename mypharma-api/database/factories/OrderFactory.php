<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'reference' => $this->faker->unique()->randomNumber(5),
            'titled' => $this->faker->word,
            'user_id' => function () {
                return User::factory()->create()->id;
            },
            'customer_id' => function () {
                return Customer::factory()->create()->id;
            },
            'price' => $this->faker->numberBetween(10, 1000),
            'discount' => $this->faker->numberBetween(10, 1000),
            'TVA' => $this->faker->numberBetween(10, 1000),
            'state' => $this->faker->randomElement(['pending', 'completed', 'cancelled']),
            'date_order' => $this->faker->date,
            // Les attributs user_id et customer_id sont générés en utilisant des fonctions de rappel (closures) qui créent une instance de l'utilisateur (User::factory()->create()) et du client (Customer::factory()->create()) respectivement, puis renvoient leur identifiant (->id). Cela garantit que des utilisateurs et des clients réels sont créés dans la base de données avant d'attribuer leurs identifiants à l'ordre.
        ];
    }
}
