<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Eloquent;

class PDF_Sent extends Eloquent
{
    protected $primaryKey = 'id';
    protected $table = 'pdf_sent';
    protected $fillable = array('client_email', 'filename', 'created_at', 'updated_at');
}

