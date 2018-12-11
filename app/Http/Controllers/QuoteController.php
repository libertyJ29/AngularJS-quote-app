<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Quote;
use App\Subtitle;
use App\Jobs;
use App\Client;
use App\PDF;
use DB;

use Response;

use Validator;							//file upload validation

use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Input;

class QuoteController extends Controller
{


	//return all quotes
	public function index(){
		$quotes = Quote::get();

		unset($q);					//clear quote array
		$q = array();

		//split the tags into individual elements for view
		foreach ($quotes as $q)
		{
 			$tags = json_decode($q->tags_id);

			$q->property_type = $tags[0];
			$q->work_required = $tags[1];
		}

		return  \Response::json($quotes);
		
	}





	//store a new quote
	public function store(Request $request){
		//$request contains 3 objects - quoteData which is the address, postcode, etc of the property, and 
		//quoteArray which is subtitles, jobs, total price, etc, and 3rd is type


		//1.) Flatten quoteArray and store to db

		$quote_array_ids = array();
		$job_array_ids = array();

		//passed in 3 objects in Request
		$data = [];
		$data = $request->all();
		$type = $data['type'];
		$quote_arr = $data['quoteArray'];
		$quote_data = $data['quoteData'];


		//delete the previous temp quote id 0 sections and jobs
		if ($type == 'createTemp'){
			$this->destroy('0', 'update');
			
		}



		//required for view pdf of the current quote data onscreen
		if ($data['type'] == 'createTemp'){
			$quote_data['id'] = 0;				//remove the quote id before creating new record
			unset($quote_data['created_at']);
			unset($quote_data['updated_at']);

			//check if the originalid parameter exists - ie view pdf from update quote
			if(isset($quote_data['originalid'])){
				//store the original quote id here when quote id = 0, as this field is not used for the create temp quote
				$quote_data['pdf_sent_id'] = $quote_data['originalid'];
			}else{
				$quote_data['pdf_sent_id'] = 0;
			}
		}

		//loop through each Subtitle of the quoteArray 
		foreach ($quote_arr as $sub){

			if ($data['type'] == 'createTemp'){
				unset($sub['id']);			//remove the quote id before creating temp pdf record - so it stores to new subtitle id
			}

			unset($job_array_ids);				//clear jobs_array
			$job_array_ids = array();	


			//loop through each Job for the subtitle and add as a new entry in the jobs table
			foreach($sub['jobs'] as $job)
			{

				if ($data['type'] == 'createTemp'){
					unset($job['id']);		//remove the quote id before creating temp record so it creates a new job id
				}

				$new_job = Jobs::create(array(		//keep instance of the job in $new_job, so can access the jobs id
		 			'job' => $job['job'],
		 			'qty' => $job['qty'],
					'unit' => $job['unit'],
 					'cost' => $job['cost']
				));

				//store the id of the newly created job record in the job_array_ids array, which will be stored in the associated subtitle record
				array_push($job_array_ids, $new_job->id);	
			}


			//store the subtitle record in the subtitle table, with the ids of all the jobs stored above put in the table 
			$new_subtitle = Subtitle::create(array(
		 		'subtitle' => $sub['subtitle'],
		 		'jobs_array' => json_encode($job_array_ids)
			));

			//store the list of all subtitle ids for this quote in the quote table in the quote_array_ids field
			array_push($quote_array_ids, $new_subtitle->id);

		}


		//if property type or work required tags are not set, then set to None Selected
		if ($quote_data['property_type'] == ''){
			$quote_data['property_type'] = 0;
		}

		if ($quote_data['work_required'] == ''){
			$quote_data['work_required'] = 0;
		}

		//flatten the tags_ids into 1 field for storage
		$tags_id = "[".$quote_data['property_type'].",".$quote_data['work_required']."]";



		//on create temp quote, define photo parameter if it has not been set yet(used by 'Create New Quote')
		if (empty($quote_data['photo'])){
			$quote_data['photo'] = '';
		}


		//2.) Store quoteData to db
		if($type == 'create'){
			 $updatedQuoteData = Quote::create(array(
				'client_id' => $quote_data['client_id'],
		 		'tags_id' => $tags_id,
                 		'street_address' => $quote_data['street_address'],
                 		'city' => $quote_data['city'],
		 		'postcode' => $quote_data['postcode'],
				'quote_details_array' => json_encode($quote_array_ids),
	 	 		'total_excluding_vat' => $quote_data['total_excluding_vat'],
		 		'net_total' => $quote_data['net_total'],
				'description' => $quote_data['description']
        		));
		}



		if(($type == 'update') || ($type == 'createTemp')){
		 	$updatedQuoteData = Quote::find($quote_data['id']);			//find the original quote record in db

			//check the quote record exists before adding new data to it
		    	if(isset($updatedQuoteData->id)){
		 		$updatedQuoteData->client_id = $quote_data['client_id'];
		 		$updatedQuoteData->tags_id = $tags_id;
                 		$updatedQuoteData->street_address = $quote_data['street_address'];
                 		$updatedQuoteData->city = $quote_data['city'];
		 		$updatedQuoteData->postcode = $quote_data['postcode'];
				$updatedQuoteData->description = $quote_data['description'];
				$updatedQuoteData->quote_details_array = json_encode($quote_array_ids);
	 	 		$updatedQuoteData->total_excluding_vat = $quote_data['total_excluding_vat'];
		 		$updatedQuoteData->net_total = $quote_data['net_total'];
				$updatedQuoteData->pdf_sent_id = $quote_data['pdf_sent_id'];
				$updatedQuoteData->photo = $quote_data['photo'];

				$updatedQuoteData->push();
		    	}
		    	else{
				//unable to update quote
				return \Response::json(array('error' => true), 500);
		    	}
		}


		if(isset($updatedQuoteData->id)){
			//successfully created quote
        		return \Response::json(array('success' => true));
		}else{
			//unable to create quote, so return error code
			return \Response::json(array('error' => true), 500);
		}
	

	}	//end of store quote






	//delete a quote
	public function destroy($id, $type){

		$quoteToDelete = Quote::find($id);			//find the quote to delete

		//check the quote record exists before deleting it
		if(empty($quoteToDelete->id)){
			//unable to find quote to delete
			return \Response::json(array('error' => true), 500);
		 }

		    	

		$q = json_decode($quoteToDelete->quote_details_array);	//get the subtitle ids for this quote to delete aswell

		//loop through each subtitle for this quote and delete them along with the relevant jobs also
		foreach ($q as $sub_id)
		{
			//check that the id found is not a null record, otherwise do not try and delete it
			if (($subtitle_record = Subtitle::find($sub_id)) != null){

				Subtitle::destroy($sub_id);		//delete the subtitle for this quote

				$j = json_decode($subtitle_record->jobs_array);
			
				//loop through the jobs_array and delete each associated jobs record
				foreach ($j as $job_id)
				{
					Jobs::destroy($job_id);		//delete the jobs for each subtitle for this quote
				}
			}
		}


		//Only delete the quote record when type=null i.e. full delete of a quote record
		//When type is update, want to delete associated jobs and subtitles for a quote, but keep the quote record itself as it has date_created field, and quote id 0 is required
		if($type != 'update'){
			try{
				Quote::destroy($id);
			}
			catch(\Exception $e){
				//unable to delete quote
				return \Response::json(array('error' => true), 500);
			}

    		}

        	return \Response::json(array('success' => true));
	}






        //search for a quote
	public function show($id){
		$searchQuoteData = Quote::find($id);

		//check the quote record exists
		if(empty($searchQuoteData->id)){
			//unable to find quote
			return \Response::json(array('error' => true), 500);
		 }


		//numerical index into the $searchQuoteArray subtitle array, used for inserting the jobs into the correct element
		$array_index = 0;

		$searchQuoteArray = array();
			
		$q = json_decode($searchQuoteData->quote_details_array);		//get an array of subtitle ids for the quote

		//loop through each subtitle record
		foreach ($q as $sub_id)
		{
			$subtitle_record = Subtitle::find($sub_id);

			//create subtitle array of the current subtitle record
			$sa = array('id' => $subtitle_record->id, 'subtitle' => $subtitle_record->subtitle, 'jobs' => []);

			//add this subtitle record to the main $searchQuoteArray we are building
			array_push($searchQuoteArray, $sa);
			
			//get all the jobs ids for this subtitle
			$j = json_decode($subtitle_record->jobs_array);
			
			//loop through each jobs record for this subtitle record
			foreach ($j as $job_id)
			{
				$job_record = Jobs::find($job_id);

					//create jobs array of the current jobs record
					$ja = array('id' => $job_record->id, 'job' => $job_record->job, 'qty'  => $job_record->qty, 
							'unit' => $job_record->unit, 'cost' => $job_record->cost);

					//add this new jobs record to the relevant subtitle in $searchQuoteArray
					array_push($searchQuoteArray[$array_index]['jobs'], $ja);
			}

			//inc the numerical index into the $searchQuoteArray array. Used for inserting the jobs arrays into the correct subtitle element
			$array_index = $array_index + 1;
		}

		//split the tags_id field into 2 and add to the searchQuoteData model
 		$tags = json_decode($searchQuoteData->tags_id);

		$searchQuoteData->property_type = $tags[0];
		$searchQuoteData->work_required = $tags[1];

		return  \Response::json(['searchQuoteData' => $searchQuoteData, 'searchQuoteArray' => $searchQuoteArray]);
	}	//end of show quote





        //upload photo to server
        public function photo_upload(Request $request, $id, $refer, $imgType){
		$targetPath = "/app/storage/app/quote_photo/";

		if($refer == 'source'){
			//get the image file extension
			$path = $_FILES['file']['name'];
			$ext = strtolower(".".pathinfo($path, PATHINFO_EXTENSION));
		//thumbnail is created as a jpg
		} else {
			$ext = '.jpg';
		}
		
		//if uploading a thumbnail type=small, then save it with small extension.
		if ($imgType == 'small'){
			$ext = '_small'.$ext;
		}


		//make sure the upload directory exists on the server
		if (!file_exists('quote_photo')) {
   			mkdir('quote_photo');
		}

		$new_filename = 'quote';

		//check the uploaded file is of type jpg or png
		if (($_FILES['file']['type'] == 'image/jpeg') || ($_FILES['file']['type'] == 'image/png')){
		
			//rename the uploaded file
			$filename = $new_filename.$id.$ext;

			$destination = $targetPath . $filename;
  			move_uploaded_file( $_FILES['file']['tmp_name'] , $destination );

			//update the db quote record with the uploaded photo
			if ($refer == 'thumb'){
				$quote = Quote::find($id);
				$quote->photo = $filename;
				$quote->push();
			}

			//DEBUG view list of files in the upload directory
			//$files1 = scandir('/app/storage/app/quote_photo/');
			//return var_dump($files1);

			return "Image uploaded successfully! ".$_FILES['file']['type'];
		}
		else{
			//delete the uploaded file which is invalid, as it may be malicious
			$val = unlink($_FILES['file']['tmp_name']);

			//if not right type, then delete the file uploaded on the server
			return "Uploaded image ".$_FILES['file']['type']." is not a valid JPG or PNG photo!.  The uploaded file has now been removed ".$val;
		}

	}


	//delete photo for the quote
	public function photo_delete($id){
		$quote = Quote::find($id);

		//define the var for holding the file deletion status
		$val = '';

		$filename = $quote->photo;

		$targetPath = "/app/storage/app/quote_photo/";

		
		//check the file exists before deleting
		if(file_exists($targetPath.$filename)){

			//delete the file on the server
			$val = unlink($targetPath.$filename);		//file deletion status  - 0 : not deleted, 1 : deleted 
		}

		//remove the filename from the quote record in the db
		$quote->photo = '';
		$quote->push();

		if ($val == '1'){
			return "Photo successfully deleted";
		}
		else{
			return "Photo was not deleted!";
		}
	}





}	//end of Quote controller
