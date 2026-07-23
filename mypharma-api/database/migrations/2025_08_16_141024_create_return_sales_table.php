<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturnSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('return_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            // $table->foreignId('order_id')->nullable()->constrained('orders');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedBigInteger('sale_id')->nullable();
            // $table->foreignId('sale_id')->nullable()->constrained('sales');
            $table->foreignId('product_id')->constrained('products');
            $table->string('reason')->nullable();
            $table->integer('quantity');
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
        Schema::dropIfExists('return_sales');
    }
}
