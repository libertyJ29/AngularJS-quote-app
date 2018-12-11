<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubtitleTable extends Migration
{
    //Run the Migration
    public function up()
    {
	Schema::create('subtitle', function (Blueprint $table) {
		$table->increments('id');
		
		$table->string('subtitle');	
		$table->string('jobs_array');
		$table->timestamps();
        });
    }

    //Reverse the migration
    public function down()
    {
       	Schema::drop('subtitle');
    }
}
