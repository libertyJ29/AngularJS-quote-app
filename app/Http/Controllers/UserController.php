<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;

use Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Input;

class UserController extends Controller
{
	//check if the entered username and password match that stored in database
	public function store(Request $request)
	{
		//get the user entered in username/password
		$data = $request->all();

		$user = Users::where('name', $data['username'])->where('password', $data['password'])->get();

		//using get() returns something even if it does not find a matching record in db
		if ($user->isEmpty() ){
			//if username and/or password are incorrect 
			$response = array('failure' => []);
		}
		else {
			//if username and password are correct
			$response = array('success' => []);
			array_push($response['success'], $user);
		}

		return  \Response::json($response);
	}




    	//get the current user that is logged-in
    	public function update(Request $request)
    	{
    	     return $currentUser = $request->user(); 	//return an instance of the authenticated user
    	}


}