<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientTable extends Migration
{
    //Run the Migration
    public function up()
    {
        Schema::create('client', function (Blueprint $table) {
		$table->increments('id');
			
		$table->string('client_name');
		$table->string('contact_number');
		$table->string('email');
	        $table->timestamps();
        });
    }

    //Reverse the migration
    public function down()
    {
       	Schema::drop('client');
    }
}
