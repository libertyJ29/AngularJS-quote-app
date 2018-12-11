<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompanyaddressTable extends Migration
{
    //Run the Migration
    public function up()
    {
	Schema::create('company_address', function (Blueprint $table) {
        	$table->increments('id');
			
		$table->string('name');
		$table->string('address');
		$table->string('city');
		$table->string('county');
		$table->string('postcode');
		$table->string('email');
		$table->string('phone');
	     	$table->timestamps();
	});
    }

    //Reverse the migration
    public function down()
    {
        Schema::drop('company_address');
    }
}
