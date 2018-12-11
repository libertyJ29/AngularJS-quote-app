<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePdfsentTable extends Migration
{
    //Run the Migration
    public function up()
    {
    	Schema::create('pdf_sent', function (Blueprint $table) {
		$table->increments('id');
			
		$table->string('client_email');
		$table->string('filename');
	        $table->timestamps();
    	});
    }

    //Reverse the migration
    public function down()
    {
       	Schema::drop('pdf_sent');
    }
}
