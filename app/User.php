<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;
	
    protected $primaryKey = 'id';

    protected $table = 'users';		    //use Notifiable;

    
    protected $fillable = [
        'name', 'password', 'api_token'
    ];

   
    //protected $hidden = [
    //    'password', 'remember_token',
    //];

    
    //Disable created_at and updated_at as these fields are not in the db table
    public $timestamps = false;

}
