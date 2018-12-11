<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Vat_Rate;

use Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Input;


class VatRateController extends Controller
{
	//return the vat rate
    	public function index()
	{
		$rate = Vat_Rate::find(1);
 
		$vat_rate = $rate->rate;

		return  \Response::json($vat_rate);
	}



 
	//update the vat rate
	public function update($new_rate){
		$updatedVatRate = Vat_Rate::find(1);	//rate is id = 1

		
		//check the vat_rate record exists before updating it
		if(isset($updatedVatRate->id)){
			$updatedVatRate->rate = $new_rate;

			$updatedVatRate->push();

			return \Response::json(array('success' => true));
		}
		else{
			//unable to find vat_rate
			return \Response::json(array('error' => true), 500);
		}
	}



}