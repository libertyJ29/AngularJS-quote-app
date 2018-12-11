<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Eloquent;

class Vat_Rate extends Eloquent
{
    protected $primaryKey = 'id';
    protected $table = 'vat_rate';
    protected $fillable = array('rate', 'created_at', 'updated_at');
}

