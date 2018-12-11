<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Eloquent;

class Client extends Eloquent
{
    protected $primaryKey = 'id';
    protected $table = 'client';
    protected $fillable = array('client_name', 'contact_number', 'email', 'created_at', 'updated_at');
}

