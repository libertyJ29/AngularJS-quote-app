<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Eloquent;

class Company_Address extends Eloquent
{
    protected $primaryKey = 'id';
    protected $table = 'company_address';
    protected $fillable = array('name', 'address', 'city', 'county', 'postcode', 'email', 'phone', 'created_at', 'updated_at');
}

