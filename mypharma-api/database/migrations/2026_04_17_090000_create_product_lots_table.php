<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductLotsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_lots', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('batch_number', 120);
            $table->date('expiry_date');
            $table->date('manufacture_date')->nullable();
            $table->integer('available_quantity')->default(0);
            $table->integer('received_quantity')->default(0);
            $table->decimal('last_purchase_price', 12, 2)->nullable();
            $table->unsignedBigInteger('last_entry_id')->nullable();
            $table->unsignedBigInteger('last_entry_product_id')->nullable();
            $table->timestamp('last_received_at')->nullable();
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->unique(['product_id', 'batch_number', 'expiry_date'], 'product_lots_unique_batch');
            $table->index(['product_id', 'expiry_date'], 'product_lots_product_expiry_idx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_lots');
    }
}
