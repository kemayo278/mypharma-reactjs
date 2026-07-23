<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name',100);
            $table->string('second_name',100);
            $table->string('phone',100);
            $table->string('email', 100)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password',200);
            $table->string('state',15);
            $table->string('img',255)->nullable();
            $table->string('cni_number',50);
            $table->unsignedBigInteger('role_id');
            $table->foreign('role_id')->references('id')->on('roles'); 
            $table->rememberToken();
            $table->timestamps();
            // 2014_10_12_000001_create_users_table
            // 2014_10_12_000000_create_roles_table
            // 2014_10_12_000000_create_users_table
            // 2024_05_07_081833_create_roles_table
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
