<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName,
            'second_name' => $this->faker->lastName,
            'phone' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'password' => bcrypt('password'), // Par défaut, le mot de passe est défini sur 'password'
            'state' => $this->faker->randomElement(['active', 'inactive']),
            'img' => null,
            'cni_number' => $this->faker->unique()->randomNumber(8),
            'role_id' => function () {
                return Role::factory()->create()->id;
            },
            //'role_id' => 1, // ID du rôle souhaité pour l'utilisateur
            // 'img_cni_recto' => $this->faker->imageUrl(),
            // 'img_cni_verso' => $this->faker->imageUrl(),
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
            // 'name' => $this->faker->name,
            // 'email' => $this->faker->unique()->safeEmail,
            // 'email_verified_at' => now(),
            // 'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            // 'remember_token' => Str::random(10),
        ];
    }
}
