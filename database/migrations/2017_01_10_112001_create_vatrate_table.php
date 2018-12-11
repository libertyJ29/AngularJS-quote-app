<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVatrateTable extends Migration
{
    //Run the Migration
    public function up()
    {
        Schema::create('vat_rate', function (Blueprint $table) {
		$table->increments('id');

		$table->string('rate');
		$table->timestamps();
	});
    }

    //Reverse the migration
    public function down()
    {
       	Schema::drop('vat_rate');
    }
}
