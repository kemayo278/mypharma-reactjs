<?php

namespace Database\Seeders;

use App\Models\EntryProduct;
use Illuminate\Database\Seeder;

class EntryProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        EntryProduct::factory()->count(10)->create();
    }
}
