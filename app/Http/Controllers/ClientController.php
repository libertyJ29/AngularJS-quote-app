<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Client;

use Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Input;

class ClientController extends Controller
{

	
    	//return all clients
    	public function index()
	{
		$clients = Client::get();

		return  \Response::json($clients);
	}



   	//store a new client
	public function store(){
		 $newclient = Client::create(array(
		 	'client_name' => Input::get('client_name'),
		 	'contact_number' => Input::get('contact_number'),	
		 	'email' => Input::get('email')
        	 ));
    

        	if(isset($newclient->id)){
			//successfully created client
        		return \Response::json(array('success' => true));
		}else{
			//unable to create client, so return error code
			return \Response::json(array('error' => true), 500);
		}
	}




    	//delete a client
	public function destroy($id){

		$clientToDelete = Client::find($id);			//find the client record to delete

		//check the quote record exists before deleting it
		if(isset($clientToDelete->id)){
			Client::destroy($id);
    
        		return \Response::json(array('success' => true));
		}else{
			//unable to find client to delete
			return \Response::json(array('error' => true), 500);
		}
	}



     	//update a client
	public function update($id){
		$updatedClientData = Client::find($id);

		if(empty($updatedClientData->id)){
			//unable to find client record, so return error 
			return \Response::json(array('error' => true), 500);
		}

		//searchClientData passed in service is accessed using Input::get()

		$updatedClientData->client_name = Input::get('client_name');
		$updatedClientData->contact_number = Input::get('contact_number');
		$updatedClientData->email = Input::get('email');
		
		$updatedClientData->push();

		return \Response::json(array('success' => true));
	}



	//search for a client record
	public function show($id){
		
		$client = Client::find($id);

		if(isset($client->id)){
			return  \Response::json($client);
		}else{
			//unable to find client record, so return error 
			return \Response::json(array('error' => true), 500);
		}
	}





}
