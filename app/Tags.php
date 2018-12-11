<?php

namespace App;

use Eloquent;

use Illuminate\Database\Eloquent\Model;

class Tags extends Eloquent
{
    protected $primaryKey = 'id';
    protected $table = 'tags';
    protected $fillable = array('property_type', 'work_required');

    //Disable created_at and updated_at as these fields are not in the db table
    public $timestamps = false;
}

