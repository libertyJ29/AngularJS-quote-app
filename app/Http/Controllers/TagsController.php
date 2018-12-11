<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Tags;

use Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Input;


class TagsController extends Controller
{
	//return the tags
	public function index(){
		$tags = Tags::get();

		$property_type = json_decode($tags[0]->property_type);

		$work_required = json_decode($tags[0]->work_required);

		return  \Response::json(['property_type' => $property_type, 'work_required' => $work_required]);
	}



	//store the edited tags object
    	public function store(Request $request){
		$newtags = $request->all();

		//get the tags record from db
		$existingtags = Tags::find(1);

		if(isset($existingtags->id)){

			//store this edited tag to the tags table
			$existingtags->property_type = json_encode($newtags['tags']['property_type']);
			$existingtags->work_required = json_encode($newtags['tags']['work_required']);
			$existingtags->push();

			return \Response::json(array('success' => true));
		}else{
			//unable to create quote, so return error code
			return \Response::json(array('error' => true), 500);
		}
    	}






}
