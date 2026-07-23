<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInstitutionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->string('name',100);
            $table->string('state',100);
            $table->string('matriculation',100);
            $table->string('phone',100);
            $table->string('pj',100)->nullable();
            $table->string('number_register',100);
            $table->string('pj_register',100)->nullable();
            $table->string('num_declaration',100);
            $table->string('img',100)->nullable();
            $table->string('cycle',100);
            $table->string('telephone',100);
            $table->string('couverture',100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('institutions');
    }
}
