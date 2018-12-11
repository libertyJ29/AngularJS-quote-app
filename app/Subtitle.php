<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Eloquent;

class Subtitle extends Eloquent
{
    protected $primaryKey = 'id';
    protected $table = 'subtitle';
    protected $fillable = array('subtitle', 'jobs_array', 'created_at', 'updated_at');
}

