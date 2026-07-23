<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 120)->nullable()->index();
            $table->string('name', 255);
            $table->unsignedBigInteger('category_id');

            // Stock & prix
            $table->integer('quantity')->default(0);
            $table->integer('quantity_alert')->default(0);
            $table->decimal('purchase_price', 12, 2)->default(0);
            $table->decimal('sale_price', 12, 2)->default(0);

            // Lot & dates
            $table->string('batch_number', 120);
            $table->date('expiry_date');
            $table->date('manufacture_date')->nullable();

            // Infos pharmaceutiques
            $table->string('active_ingredient', 255);
            $table->string('dosage', 120);
            $table->string('form', 120);
            $table->string('laboratory', 255)->nullable();
            $table->string('barcode', 120)->nullable()->index();
            $table->string('therapeutic_class', 255)->nullable();
            $table->string('storage_condition', 255)->nullable();

            // Media / meta
            $table->string('picture', 255)->nullable();
            $table->string('source', 120)->nullable();

            $table->foreign('category_id')->references('id')->on('categories');
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
        Schema::dropIfExists('products');
    }
}
