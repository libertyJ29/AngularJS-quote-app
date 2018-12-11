<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Company_Address;

use Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Input;


class CompanyAddressController extends Controller
{
	//return the company address
    	public function index()
	{
		$companyaddress = Company_Address::find(1);

		return  \Response::json($companyaddress);
	}




	//update the company address
	public function update($company_addressjson){

		//not using passed in company_address below. Getting the updated company address form data using Input::get()
		$updatedcompany_address = Company_Address::find(1);


		//check the company_address record exists before updating it
		if(isset($updatedcompany_address->id)){

			$updatedcompany_address->name = Input::get('name');
			//$updatedcompany_address->address = $company_addressjson['address'];
			$updatedcompany_address->address = Input::get('address');
			$updatedcompany_address->city = Input::get('city');
			$updatedcompany_address->county = Input::get('county');
			$updatedcompany_address->postcode = Input::get('postcode');
			$updatedcompany_address->email = Input::get('email');
			$updatedcompany_address->phone = Input::get('phone');

			$updatedcompany_address->push();

			return \Response::json(array('success' => true));
		}else{
			//unable to find company_address record
			return \Response::json(array('error' => true), 500);
		}
	}



}
