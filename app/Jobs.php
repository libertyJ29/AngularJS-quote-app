<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Eloquent;

class Jobs extends Eloquent
{
    protected $primaryKey = 'id';
    protected $table = 'jobs';
    protected $fillable = array('job', 'qty', 'unit', 'cost', 'created_at', 'updated_at');
}

