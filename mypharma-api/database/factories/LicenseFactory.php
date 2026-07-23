<?php

namespace Database\Factories;

use App\Models\License;
use App\Models\Config;
use Illuminate\Database\Eloquent\Factories\Factory;

class LicenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'activation_key' => License::generateActivationKey(),
            'config_id' => Config::factory(),
            'is_active' => true,
            'notes' => $this->faker->optional()->sentence,
        ];
    }
}
