<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    //Run the Migration
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
		$table->increments('id');

		$table->string('name')->unique();
		$table->string('password');

                $table->rememberToken();
		$table->string('api_token', 60)->unique();
	});
    }

    //Reverse the migration
    public function down()
    {
       	Schema::drop('users');
    }
}

