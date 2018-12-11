<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Eloquent;

class Quote extends Eloquent
{
    protected $primaryKey = 'id';
    protected $table = 'quotes';
    protected $fillable = array('client_id', 'tags_id', 'street_address', 'city', 'postcode', 'description', 'quote_details_array', 'total_excluding_vat', 'net_total', 'pdf_sent_id', 'created_at', 'updated_at');
}

