<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Quote;
use App\Tags;
use App\Client;
use App\Subtitle;
use App\Jobs;
use App\Company_Address;
use App\PDF_Sent;
use PDF;
use DB;
use Mail;

use Response;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Input;


class pdfController extends QuoteController
{

	//return all the pdf_sent records
	public function get_all_pdf_sent(){
		$pdf_sent = PDF_Sent::get();

		return \Response::json($pdf_sent);
	}




	//create a pdf file of the quote
	public function pdf_create($id){

		$quotes = Quote::find($id);


		//check if the net total value is a number - this ensures that all the values entered for quoteArray are numbers also. 
		//required as cannot calculate price totals using letters or other characters
		if (!is_numeric($quotes->total_excluding_vat)){
			return "Error1";
		}

		//get the tag indexes for this quote
		$quotes_tags = json_decode($quotes->tags_id);

		//split the indexes into 2 separate variables
		$tag['property_type'] = $quotes_tags[0];
		$tag['work_required'] = $quotes_tags[1];


		//get the tags collection
		$tags = Tags::get();

		//split the tags collection into 2 separate collections
		$propertytype = json_decode($tags[0]->property_type);
		$workrequired = json_decode($tags[0]->work_required);

		//get the name of each tag for this quote, using the supplied tag index value 
		$property_type = $propertytype[$tag['property_type']]->name;

		$work_required = $workrequired[$tag['work_required']]->name;


		//if either of the tags are not selected, then add a default tag name
		if ($tag['property_type'] == NULL){
			$property_type = "Not Defined";
		}

		if ($tag['work_required'] == NULL){
			$work_required = "Not Defined";
		}
	
	
		//if a client name has not been selected for the quote, then use 'client not selected id 0'
		if(!$quotes->client_id){
			$quotes->client_id = 0;
		}

		$client = Client::find($quotes->client_id);

		//if the client id is not in the database, then switch to 'client not selected'
		if(empty($client->id)){
			$quotes->client_id = 0;
			$client= Client::find($quotes->client_id);
		}

		$companyaddress = Company_Address::find(1);

		//check if the photo for this quote exists on the server
		$quotePhotoExists = $this->checkPhotoExists($quotes);

		//share variables with the create pdf template - quote.blade.php
        	view()->share('quotes', $quotes);
		view()->share('client', $client);
		view()->share('property_type', $property_type);
		view()->share('work_required', $work_required);
		view()->share('companyaddress', $companyaddress);
		view()->share('quotePhotoExists', $quotePhotoExists);


		//convert subtitle ids for this quote into an array 
		$q = json_decode($quotes->quote_details_array);

		$subtitle_record = array();
		$jobs_record = array();
		$quoteDataArray = array();

		$subindex = 0;



		//Build the quote record as an array $quoteDataArray

		//loop through each subtitle for the quote
		foreach ($q as $sub_id)
		{
			unset($subtitle_record);
			$subtitle_record = Subtitle::find($sub_id);

			//get the jobs ids for this subtitle
			$j = json_decode($subtitle_record->jobs_array);

			//add this subtitle record to $quoteDataArray 
			$quoteDataArray[$subindex] = array('id' => $subtitle_record->id, 'subtitle' => $subtitle_record->subtitle, 'subtotal' => '');

			//set jobs array index to 0
			$jobindex = 0;
			$jobstotal = 0;

			//loop through the jobs for this subtitle and add each job record to $quoteDataArray
			foreach ($j as $job_id)
			{
				unset($jobs_record);
				$jobs_record = Jobs::find($job_id);


				//before calculating the totals, make sure there are values to work with for this job
				if ($jobs_record->qty == ''){
					$jobs_record->qty = 0;
				}
				if ($jobs_record->cost == ''){
					$jobs_record->cost = 0;
				}


				//add this jobs record to $quoteDataArray, and calculate the cost of the job
				$quoteDataArray[$subindex]['jobs'][$jobindex] = ['id'=> $jobs_record->id, 'job' => $jobs_record->job, 
                                    'unit' => $jobs_record->unit, 'qty' => $jobs_record->qty, 'cost' => $jobs_record->cost , 
					'total' => (string)($jobs_record->qty * $jobs_record->cost)];


				//continue to calculate the cumulative total cost for this subtitle
				$jobstotal = $jobstotal + (string)( $jobs_record->qty * $jobs_record->cost);

				//load the next job for this subtitle
				$jobindex = $jobindex + 1;
			}

			//store the subtotal (total price for all the jobs) for this subtitle
			$quoteDataArray[$subindex]['subtotal'] = (string)$jobstotal;

			//load the next subtitle for this quote
 			$subindex = $subindex + 1;
		}

		//share the quote data with laravel view template to create the pdf file
		view()->share('quoteDataArray', $quoteDataArray);

		//return the collections needed by the pdf_send method
		return array($client, $companyaddress);

    	}	//end of pdf_create





	//Email the pdf file of the quote to the clients email address
	public function pdf_email($id, $client, $company, $pdf_full_filename, $content, $email_subject, $client_email){

		//html is specified in the send() method, so it allows html tags in the message content eg <br>

		try{
			Mail::send(['html' => 'sendquotemail'], ['title' => $email_subject, 'content' => $content, 'id' => $id], 
			function($message) use ($id, $client_email, $client, $company, $pdf_full_filename, $email_subject)
			{
				$message->to($client_email, $client->client_name);
				$message->from($company->email, $company->name);
				$message->subject($email_subject);
				$message->attach($pdf_full_filename);
			});
			return 'success';	
		}

		//catch any errors sending the email
		catch(\Exception $e){
    			return 'Oops there was an error sending the email!';
		}
		
	}





	//create the pdf and view it, but dont save the pdf file
	public function pdf_view($id){
		$response = $this->pdf_create($id);
		
		//if an error was encountered creating the quote, then abort, and output the error message in the new window
		if ($response == "Error1"){
			return 'Cannot create pdf file as a non-numeric value has been entered in a price field for quote '.$id.'!';
		}

		$pdf = PDF::loadView('quote');

		//NOTE-this dompdf call must be prefixed by @ due to incompatibility with php7.1 used for heroku deployment
		return @$pdf->stream('quote');
	}




 
	//create the pdf, and email it to clients email, but dont view the pdf onscreen
	public function pdf_send($id, Request $request){

		$data = [];
		$data = $request->all();

		//get the email message from user, passed from the send quote dialog box
		$email_message = $data['email_message'];
		$email_subject = $data['email_subject'];
		$email_address = $data['email_address'];

		//create the pdf file
		$pdf_collections = $this->pdf_create($id);

		//assign the collections returned from pdf_create to individual variables
		$client = $pdf_collections[0];
		$company = $pdf_collections[1];

		//load the laravel view template for the pdf
		$pdf = PDF::loadView('quote');

		//get date and time stamp to rename sent pdf file with
		$server_filename_timestamp = date('d-m-y-H-i-s');


		$pdf_dir = 'quote_pdf/';			//directory to store the pdf file in
		$pdf_filename = 'quote'.$id.'.pdf';
		$pdf_filename_timestamp = 'quote'.$id.'_'.$server_filename_timestamp.'.pdf';

		$pdf_full_filename = $pdf_dir.$pdf_filename;

		//save the pdf file to server
		@$pdf->save($pdf_full_filename);



		//email the pdf file to the client
		$response = $this->pdf_email($id, $client, $company, $pdf_full_filename, $email_message, $email_subject, $email_address);


		//rename the sent pdf file and store it on the server
		rename($pdf_dir.$pdf_filename, $pdf_dir.$pdf_filename_timestamp);



		//if emailing quote to client was successful
		if($response == 'success')	
		{
			//create record in pdf_sent table of the pdf file just sent to client
			$newpdfid = PDF_Sent::create(array(
		    		'client_email' => $email_address,
		    		'filename' => $pdf_filename_timestamp
        		))->id;


			//load the quote record
			$quotes = Quote::find($id);

 			//insert the id for the record just created in pdf_sent table of the sent pdf file

			//if the quote has Never been sent before, then create a new array
			if($quotes->pdf_sent_id == null){
				$arr = array();

				array_push($arr, $newpdfid);
		
				$quotes->pdf_sent_id = json_encode($arr);
				$quotes->save();
			//if the quote Has been sent before, then add to the existing pdf_sent_id array
			} else {
				$pdf_sent_id_decode = json_decode($quotes->pdf_sent_id);

				array_push($pdf_sent_id_decode, $newpdfid);
		
				$quotes->pdf_sent_id = json_encode($pdf_sent_id_decode);
				$quotes->save();
			}

			return 'Quote '.$id.' Successfully emailed to client '.$client->client_name;


		} else{	//if emailing quote to client failed
			return \Response::json(array('error' => true), 500);
		}

	}	//end of pdf_send






	//check if the specified pdf file exists on the server
	public function checkPdfExists(Request $request){

		$data = [];
		$data = $request->all();
		$filename = $data['filename'];			//the filename to check

		$directory = '/app/storage/app/quote_pdf/';

		$result = file_exists($directory.$filename);	//check if the file exists on the server

		return \Response::json((string)$result);
	}




	//check if the photo for the specified quote exists on the server
	public function checkPhotoExists($quotes){
	
		$directory = '/app/storage/app/quote_photo/';
		return $result = file_exists($directory.$quotes->photo);
	}




}	//end of pdfController
