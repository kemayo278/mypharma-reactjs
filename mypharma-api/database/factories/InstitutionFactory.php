<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class InstitutionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'state' => $this->faker->state,
            'matriculation' => $this->faker->numerify('matriculation ###'),
            'phone' => $this->faker->phoneNumber,
            'pj' => $this->faker->word,
            'number_register' => $this->faker->numerify('Number Register ###'),
            'pj_register' => $this->faker->word,
            'num_declaration' => $this->faker->numerify('Num Declaration ###'),
            'img' => $this->faker->imageUrl(),
            'cycle' => $this->faker->word,
            'telephone' => $this->faker->phoneNumber,
            'couverture' => $this->faker->word,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
