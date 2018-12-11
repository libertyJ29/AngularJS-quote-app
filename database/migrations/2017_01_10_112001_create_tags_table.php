<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagsTable extends Migration
{
    //Run the Migration
    public function up()
    {
        Schema::create('tags', function (Blueprint $table) {
		$table->increments('id');
			
		$table->string('property_type');
		$table->string('work_required');
        });
    }

    //Reverse the migration
    public function down()
    {
       	Schema::drop('tags');
    }
}
