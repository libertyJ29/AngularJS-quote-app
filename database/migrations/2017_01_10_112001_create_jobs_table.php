<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobsTable extends Migration
{
    //Run the Migration
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
		$table->increments('id');
			
		$table->string('job');
		$table->string('qty');
		$table->string('unit');
		$table->string('cost');
		$table->timestamps();
        });
    }

    //Reverse the migration
    public function down()
    {
       	Schema::drop('jobs');
    }
}
