<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuotesTable extends Migration
{
    //Run the Migration
    public function up()
    {
        Schema::create('quotes', function (Blueprint $table) {
		$table->increments('id');
			
		$table->string('client_id');
		$table->string('tags_id');
		$table->string('street_address');
		$table->string('city');
		$table->string('postcode');
		$table->string('quote_details_array');
		$table->string('total_excluding_vat');
		$table->string('net_total');
		$table->string('pdf_sent_id');
		$table->string('photo');
		$table->string('description');
 		$table->timestamps();
        });
    }

    //Reverse the migration
    public function down()
    {
       	Schema::drop('quotes');
    }
}
