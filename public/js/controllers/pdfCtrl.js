// public/js/controllers/pdfCtrl.js

angular.module('pdfCtrl', ["ngMaterial"])
.controller('pdfController', function ($scope, $rootScope, $http, PDF_Service, Quote, CompanyAddress, interface, $mdDialog, $window, $timeout, $location) {

//init timer for angular material dialog box
var mytimer = $timeout();

  


//load the Company Address which is required for the send email dialog box
	$scope.company = CompanyAddress.get().then(function(response) {
	return response;
});




//Send pdf quote to the clients email using the Mailgun API
$scope.quoteCtrl_pdf_send = function(id, refer, email_message, email_subject, email_address) {
	$timeout.cancel(mytimer);

	$scope.refer = refer;
	$scope.email_message = email_message;
	$scope.email_subject = email_subject;
	$scope.email_address = email_address;

	//create and then send the pdf file to the clients email using the Mailgun API
	PDF_Service.pdf_send(id, email_message, email_subject, email_address)
	.success(function(data) {
		$scope.pdfsentmsg = data;
		Quote.get()
		.success(function(data){
			$scope.quotes = data;

			//redirect to quote created page
			interface.setSelection('pdf_sent_to_client');
			interface.setMenuStatus('Email Quote to Client');  
		
			//display message - success or error emailing quote to client
			$scope.status = $scope.pdfsentmsg;


		//if on quote management page
			if (refer == "search"){
				//set timer to redirect to client management page
				mytimer = $timeout(function() {
					interface.setSelection('searchQuote');  
					interface.setMenuStatus('Search for a Quote');      
				}, 4000);

  
			}


		//if on home page
			if (refer == "home"){
				//set timer to redirect to home page
				mytimer = $timeout(function() {


					interface.setSelection('index');        
					interface.setMenuStatus('Home');      
				}, 4000);

  
			}


		//if no source page is specified, then go to home page afterwards
			if ((refer != "search") && (refer != "home")){
				//set timer to redirect to home page
				mytimer = $timeout(function() {


					interface.setSelection('index');        
					interface.setMenuStatus('Home');      
				}, 4000);

  
			}


		});
	})
	.error(function (error) {
                 	 //error message
                  	 $scope.status = 'FAILED to Email Quote '+ id +' to the clients email address ' + email_address + '!!';

			//display the error in a popup dialog box
			interface.DialogBoxTimeout($scope.status, 'Warning');
	});
};







//show the pdf quotes sent for a quote in an angular material dialog box
$scope.show_pdfsent_Dialog = function(ev, quote){
	
	$scope.quote = quote;

	//get records of when the quote was emailed to client
	$scope.pdf_sent_ids = angular.fromJson(quote.pdf_sent_id);	//convert the ids into an angular array

	//Get all the pdf_sent records
	$scope.pdf_send_get();

	$mdDialog.show({
		templateUrl: 'dialog.pdfsent.html',
      		parent: angular.element(document.body),
      		targetEvent: ev,
       		scope: $scope,        
       		preserveScope: true, 
		fullscreen: true,
      		clickOutsideToClose:true
	})
};






//return all pdf_sent records from db
$scope.pdf_send_get = function() {
	PDF_Service.get()
	.success(function(data) {
		$scope.pdfsend = data; 	
	});
};







//check if a pdf file exists on the server
$scope.checkpdfexists = function(filename) {
	return PDF_Service.pdf_check_exists(filename);
};






//wrapper for create current quote record and then load it as pdf in a new browser window
$scope.createAndViewPdf = function(e, type) {

	//disable the href call to load the new browser window. Required as it may execute before the current pdf record has been created
	e.preventDefault();

	//show the waiting icon
	$scope.loading = true;


	//create a db record of the current quote
	$scope.createCurrentPdf(type);


	//reset timer
	$timeout.cancel(mytimer);

	//create a slight delay before loading the pdf in a new browser window.
	//the delay is required to ensure the new quote record is fully created
	var mytimer = $timeout(function() {
		//load the pdf in a new browser window
		var windowresponse = $window.open('/pdf_view0')
		$scope.newWindow = windowresponse;

		//do not show the waiting icon anymore
		$scope.loading = false;

	}, 650);
	
}






//create pdf of the current quote data onscreen
$scope.createCurrentPdf = function(type) {
	
	//get the quoteData variable name
	var quote_data = $scope.createOrUpdateData(type);
	var quote_arr = $scope.createOrUpdateArray(type);

	if (type == 'update'){
		//save quote id
		$scope.searchQuoteData.originalid = $scope.searchQuoteData.id;
	}

	//temp change quote id to 0
	quote_data.id = 0;

	//define 'client not selected' name if no client_id is choosen
	if (quote_data.client_id == ''){
		quote_data.client_id = '0';
	}

	//store quote record temporarily to quote 0
	Quote.save(quote_arr, quote_data, 'createTemp')
	.success(function(data) {
		
		Quote.get()
		.success(function(data){
			//reload the quotes object, after one quote has been updated
			$scope.quotes = data;

			if (type == 'create'){
				//clear the quote id
				quote_data.id = '';
			}
			if (type == 'update'){
				//set the quote id back to the original id
				$scope.searchQuoteData.id = $scope.searchQuoteData.originalid;
			}

		});	//end of reload quotes


	})
	.error(function (error) {
                 //error message
                  $scope.status = 'Unable to Create Quote!!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');
	});

};








//dialog box for confirming to send pdf by email to client
$scope.quoteCtrl_pdf_send_dialog = function(ev, quote, refer) {
	$scope.refer = refer;
	$scope.quote = quote;

	//Get the current Company Name, which is required for the send email dialog box
	CompanyAddress.get().then(function(response) {
		var companyName = response.name;
		//after the Company Name promise has resolved, then carry on creating the Send Email dialog window

		
		//ensure a valid client id exists before trying to send the quote.  Need client_id to get the recipient email address
		var clients = $scope.$parent.$$nextSibling.clients;
		var exists = '';

		//add a client_id if none is entered
		if(!quote.client_id){
			quote.client_id = 0;
		}

		//check if the client_id for the quote exists as a Client record or not. Required as the client record may have been deleted
		angular.forEach(clients, function(value, key){
			//check if the client matches the one selected for the current quote
			if(value.id == quote.client_id){
				//get the recipient email address for use in the email form
				$scope.email_address = value.email;
				exists = true;
			}
		});

		//if the selected client_id does not exist in the client database, then use Client not selected id 0
		if (!exists){
			quote.client_id = 0;
		}

		//if client is 'Client not selected', then clear the email address so user must enter it, currently email address is '-'
		if(quote.client_id == "0"){
			delete $scope.email_address;
		}


		$scope.email_message = 'Please find enclosed our quote for the requested works on your property. ' +
		'Please contact us if you wish to discuss it any further with us.\n\n' +
		'Thank you for considering us for your building work.\n\nAll prices quoted are in UK Pounds Sterling.\n';

		$scope.email_subject = 'Your Building quote ' + quote.id +' from ' + companyName;

  		$mdDialog.show({
   	    		templateUrl: 'dialog.emailquotenow.html',
       			parent: angular.element(document.body),
       			targetEvent: ev,
       			scope: $scope,        
       			preserveScope: true, 
	        	fullscreen: true,
    	   		clickOutsideToClose:true,
    		})

	});

 
};






//call the method for sending the pdf by email
$scope.quoteCtrl_pdf_send_pre = function(id, refer, email_message, email_subject, email_address) {

	//Only allow to send email if the email address field is not blank
	if (email_address){

		//close the mddialog box
	    	$scope.closeDialog();

	    	//Send the quote pdf to the clients email address
	    	$scope.quoteCtrl_pdf_send(id, refer, email_message, email_subject, email_address);

	}

};





});	//end of PDF Controller
