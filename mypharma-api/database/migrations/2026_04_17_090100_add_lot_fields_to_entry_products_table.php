<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLotFieldsToEntryProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('entry_products', function (Blueprint $table) {
            if (!Schema::hasColumn('entry_products', 'batch_number')) {
                $table->string('batch_number', 120)->nullable()->after('entry_purchase_price');
            }
            if (!Schema::hasColumn('entry_products', 'expiry_date')) {
                $table->date('expiry_date')->nullable()->after('batch_number');
            }
            if (!Schema::hasColumn('entry_products', 'manufacture_date')) {
                $table->date('manufacture_date')->nullable()->after('expiry_date');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('entry_products', function (Blueprint $table) {
            if (Schema::hasColumn('entry_products', 'manufacture_date')) {
                $table->dropColumn('manufacture_date');
            }
            if (Schema::hasColumn('entry_products', 'expiry_date')) {
                $table->dropColumn('expiry_date');
            }
            if (Schema::hasColumn('entry_products', 'batch_number')) {
                $table->dropColumn('batch_number');
            }
        });
    }
}
