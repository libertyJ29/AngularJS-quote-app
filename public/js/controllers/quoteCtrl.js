// public/js/controllers/quoteCtrl.js

//inject ngMessages as required by ngMaterial->input 
angular.module('quoteCtrl', ["ngMaterial", "ngMessages", "angularUtils.directives.dirPagination"])

.controller('quoteController', function($scope, $rootScope, $filter, $http, Quote, interface, Tags, VatRate, $timeout, $mdDialog, $mdMenu, $window) {

//show the waiting icon
$scope.loading = true;

//hold status messages for output in view
$scope.status = '';

//store the client name for create quote record
$scope.clientnameCreate = '';

//store the client name for update quote record
$scope.clientnameUpdate = '';

//init timer for angular material dialog box
var mytimer = $timeout();

  

//default tooltip message on quote create/update pages
$scope.viewpdfmsg = 'View Quote as PDF';

//get the current menu selection value from the interface service
$scope.selection = interface.getSelection();

//get the tags object using the injected Tags service
$scope.tagData = Tags.getTags();

//get the tagfilter id and type using the Tags service
$scope.tagfilter_id = Tags.getTagfilter_id();
$scope.tagfilter_type = Tags.getTagfilter_type();


//get the vat rate using the injected VatRate service
$scope.vat_rate = VatRate.get();


//update the vat_rate here when it is updated in the VatRateController
$rootScope.$on("CallVatRate_Update", function(events, args){
	$scope.vat_rate.$$state.value.data = args;
});



//defined to hold the searched for quote data
$scope.searchQuoteData = {client_id: '', property_type: '', work_required: '', street_address: '', city: '', postcode: '', description: ''};

//defined to hold the data for a new quote
var blankquoteData = {client_id: '', property_type: '', work_required: '', street_address: '', city: '', postcode: '', description: ''};
$scope.quoteData = blankquoteData;

//defined to hold the subtitle and jobs for a new quote
var blankquoteArray = [{id: 0, subtitle: '', jobs:[ {job:'', cost:'', qty:'1', unit:''} ] }];
$scope.quoteArray = blankquoteArray;


//apply currency filter to total_excluding_vat and net_total fields for Create and Update Quote
$scope.$watch('searchQuoteData.total_excluding_vat', function (newValue) {
    $scope.total_excluding_vat_currency_update = $filter('currency')(newValue, ''); 
});

$scope.$watch('searchQuoteData.net_total', function (newValue) {
    $scope.net_total_currency_update = $filter('currency')(newValue, ''); 
});

$scope.$watch('quoteData.total_excluding_vat', function (newValue) {
    $scope.total_excluding_vat_currency_create = $filter('currency')(newValue, ''); 
});

$scope.$watch('quoteData.net_total', function (newValue) {
    $scope.net_total_currency_create = $filter('currency')(newValue, ''); 
});




//#Get All Quotes
Quote.get()
.success(function(data) {
	$scope.quotes = data;
	
	//do not show the wait icon anymore
	$scope.loading = false;
});





$scope.showPhoto1 = function() {
	console.log("get photo 1!");
	Quote.showPhoto1Now('quote1.jpg');
};



//#Search for a Quote
$scope.searchQuote = function(id) {
	Quote.search(id)
	.success(function(data) {
		$scope.searchQuoteData = data.searchQuoteData;
		$scope.searchQuoteArray = data.searchQuoteArray;

		$scope.status = 'Quote id: ' + id + ' successfully loaded for ' + $scope.searchQuoteData.street_address;
	})
	.error(function (error) {
                //error message
                $scope.status = 'Unable to find quote record!!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');
	});


};







//#Save a New Quote 
$scope.createQuote = function() {

	$timeout.cancel(mytimer);

	var type = 'create';

	//do not allow to create a completely empty quote
	//convert the input quoteData object into a string for comparison
	var inputQuoteData = JSON.stringify($scope.quoteData);
	var emptyQuote = '{"client_id":"","property_type":"","work_required":"","street_address":"","city":"","postcode":"","description":"","total_excluding_vat":0,"net_total":0}';

	//if quote data is completely empty, then do not create a new quote
	if(inputQuoteData == emptyQuote){
		$scope.status = 'Please add some data, such as Property Type, to the quote!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');
	}

	if(inputQuoteData != emptyQuote ){
		//Pass the quote data from the form
		Quote.save($scope.quoteArray, $scope.quoteData, type)
		.success(function(data) {

			//reload the quotes object
			Quote.get()
			.success(function(data){
				$scope.quotes = data;
			
				//Reset the create new quote form data
				$scope.resetQuote();
			
				$scope.status = 'New Quote Created Successfully';

				//redirect to quote created page
				interface.setSelection('quoteCreated');

				//set timer to redirect to client management page after 4 seconds
				mytimer = $timeout(function() {


					interface.setSelection('searchQuote');        
					interface.setMenuStatus('Search for a Quote');   
					interface.setCurrentNav('searchQuote');
				}, 4000);

  
			})
		})
		.error(function (error) {
                 	 //error message
                  	 $scope.status = 'Unable to create quote!!';

			//display the error in a popup dialog box
			interface.DialogBoxTimeout($scope.status, 'Warning');
		});
		

    	};
};		//end of createQuote






//reset the quote data on Create New Quote
$scope.resetQuote = function(){

	$scope.clientnameCreate = '';		//clear the diplayed client name 
	$scope.quoteCreateQuery = '';		//clear the client name Search Input
	$scope.showToggleCreate = false;	//hide the client name toggle

	$scope.quoteData = {client_id: '', property_type: '', work_required: '', street_address: '', city: '', postcode: '', description: ''};

	//load an empty structure after clearing quoteArray with 1 clear subtitle and 1 job in it
	$scope.quoteArray = [{id: 0, subtitle: '', jobs:[{job:'', cost:'', qty:'1', unit:''}] }];
};





//#Update a Quote 
$scope.updateQuote = function(id, searchQuoteArray, searchQuoteData) {
	$timeout.cancel(mytimer);

	//if no quote is loaded to update, then dont update anything
	if (!searchQuoteData.id)
	{
		$scope.status = 'Could not update quote. You must select a quote to update from Quote Management.';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');

		//clear the entered quote data
		$scope.searchQuoteData = {client_id: '', property_type: '', work_required: '', street_address: '', city: '', postcode: '', description: ''};

		//load an empty structure with 1 clear subtitle and 1 job in it
		$scope.searchQuoteArray = [{id: 0, subtitle: '', jobs:[{job:'', cost:'', qty:'1', unit:''}] }];
	}

	//if a valid quote is loaded, then complete the update
	if (searchQuoteData.id)
	{
		var type = 'update';

		//Pass the quote data from the form
		Quote.save(searchQuoteArray, searchQuoteData, type)
		.success(function(data) {
			Quote.get()
			.success(function(data){

				//reload the quotes object, after one quote has been updated
				$scope.quotes = data;
			
				//Reset the update quote form data
				$scope.clientnameUpdate = '';		//clear the diplayed client name 
				$scope.quoteUpdateQuery = '';		//clear the client name search input
				$scope.showToggleUpdate = false;	//hide the client name toggle

				//clear the quote data
				$scope.searchQuoteData = {client_id: '', property_type: '', work_required: '', street_address: '', city: '', postcode: '', description: ''};
				
				//load this empty structure after clearing quoteArray with 1 clear subtitle and 1 job in it
				$scope.searchQuoteArray = [{id: 0, subtitle: '', jobs:[{job:'', cost:'', qty:'1', unit:''}] }];

				$scope.status = 'Quote Updated Successfully';

				//redirect to quote updated page
				interface.setSelection('quoteUpdated');

				//set timer to redirect to client management page after 4 seconds
				mytimer = $timeout(function() {
					interface.setSelection('searchQuote');        
					interface.setMenuStatus('Search for a Quote');   
					interface.setCurrentNav('searchQuote');
				}, 4000);

  

			})
			
		})
		.error(function (error) {
                 	//error message
                  	$scope.status = 'Unable to update quote!!';

			//display the error in a popup dialog box
			interface.DialogBoxTimeout($scope.status, 'Warning');
		});
 	}
};		//end of updateQuote






//#Delete a Quote
$scope.deleteQuote = function(id, type=null, refer=null) {

	$timeout.cancel(mytimer);
	
	//pass the id of the quote to the Destroy service
	Quote.destroy(id, type)
	.success(function(data) {

		//reload the full quotes object
		Quote.get()
		.success(function(data) {
			$scope.quotes = data;

			//do not change the page when on quote update section
			if (refer != "update"){
				//redirect to quote created page
				interface.setSelection('quoteDeleted');

				$scope.status = 'Quote ' + id + ' Deleted Successfully';
			}


			//if was on quote management page, then redirect to there afterwards
			if (refer == "search"){
				mytimer = $timeout(function() {


					interface.setSelection('searchQuote');  
					interface.setMenuStatus('Search for a Quote');      
				}, 4000);

  
			}

			//if was on home page, then redirect to home page afterwards
			if (refer == "home"){
				mytimer = $timeout(function() {


					interface.setSelection('index');        
					interface.setMenuStatus('Home');      
				}, 4000);

  
			}

			//if was on home page, then redirect to home page afterwards
			if (refer == "update"){
				mytimer = $timeout(function() {


					interface.setSelection('quoteManagement');		//define which section to show
					interface.setMenuStatus('Update Quote');		//write the status text at top
				}, 4000);

  
			}

		});
	})
	.error(function (error) {
                //error message
                $scope.status = 'Unable to delete quote!!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');
	});

};		//end of deleteQuote





//load the correct quoteArray for create or update quote
$scope.createOrUpdateArray = function(type) {
	if (type == 'create'){
		var quote_arr = $scope.quoteArray;
	}
	if (type == 'update'){
		var quote_arr = $scope.searchQuoteArray;
	}

	return quote_arr;
};



//load the correct quoteData for create or update quote
$scope.createOrUpdateData = function(type) {
	if (type == 'create'){
		var quote_data = $scope.quoteData;
	}
	if (type == 'update'){
		var quote_data = $scope.searchQuoteData;
	}

	return quote_data;
};





//Add a new Subtitle for the quote
$scope.addNewSubtitle = function(type) {

	//get the name of the array to update - quoteArray or searchQuoteArray
	var quote_arr = $scope.createOrUpdateArray(type);

	//add a new row to the quoteArray object
	var newSubNo = quote_arr;
	var subtitleArrayLength = quote_arr.length-1;

	//if there is an existing subtitle for the quote
	if(subtitleArrayLength >= 0){
		var new_id = quote_arr[subtitleArrayLength].id;
		var newSubId = parseInt(new_id)+parseInt(1);		//parseInt to convert a string to int
	}else {
		var new_id = 0;
		var newSubId = 0;
	}

	//add a new blank subtitle entry
	quote_arr.push({id: newSubId, subtitle: '', jobs: [{job:'', cost:'', qty:'1', unit:''},], subtotal: '' });	
};




//Add a new Job for the subtitle of the quote
$scope.addNewJob = function(index, type) {

	var quote_arr = $scope.createOrUpdateArray(type);

	//add a new job entry for the subtitle
	quote_arr[index].jobs.push({job:'', cost:'', qty:'1', unit:''});
};





//Delete Subtitle Section - pass in the subtitle index
$scope.deleteSubSection = function(index, type) {

	var quote_arr = $scope.createOrUpdateArray(type);

	//if trying to delete the last subtitle of the quote, then stop
	if (quote_arr.length < 2){
		$scope.status = 'Could not delete Section. There must be atleast 1 Work Section for the Quote.';

		interface.DialogBoxTimeout($scope.status, 'Warning');
	}

	//delete if there are other subtitles for the quote
	if (quote_arr.length >= 2){
		quote_arr.splice(index, 1);
	}
};




//Delete Individual Job - pass in the quoteArray id, and the job index
$scope.deleteJob = function(id, index, type) {

	var quote_arr = $scope.createOrUpdateArray(type);

	//cannot delete all jobs, must leave 1 job
	if (quote_arr[id].jobs.length < 2){
		$scope.status = 'Could not delete Job. There must be atleast 1 Job for each section.';

		interface.DialogBoxTimeout($scope.status, 'Warning');
	}

	//delete if more than 1 job exists for the subtitle
	if (quote_arr[id].jobs.length >= 2){
		quote_arr[id].jobs.splice(index, 1);
		$scope.status = 'Job succesfully deleted';
	}
};





//Set the Client Name for Create quote -> client name search
$scope.setClientnameCreate = function(name) {
	$scope.clientnameCreate = name;
};


//Set the Client Name for Update quote -> client name search
$scope.setClientnameUpdate = function(name) {
	$scope.clientnameUpdate = name;
};




//Change client name for Update quote
$scope.changeClientId = function(id, client_name){
	
	//change the client name shown in the form
	$scope.clientnameUpdate = client_name;

	//change the client id of this quote in searchQuoteData
	$scope.searchQuoteData.client_id = id;		
};


//Change client name for Create new quote
$scope.changeCreateClientId = function(id, client_name){
	
	//change the client name shown in the form
	$scope.clientnameCreate = client_name;

	//change the client id of this quote in QuoteData
	$scope.quoteData.client_id = id;
};






//load the selected quote on the update quote page
$scope.quoteLoadUpdate = function(id) {

	$scope.searchQuote(id);

	interface.setSelection('quoteManagement');		//define which section to show
	interface.setMenuStatus('Update Quote');		//write the status text at top
	interface.setCurrentNav('updateQuote');			//which nav tab to select

	//close the client name search dialog when loading a new quote
	$scope.$$childHead.$$childHead.showToggleUpdate = false;
};




//Delete a quote on home page
$scope.home_deleteQuote = function(id, type=null, refer=null){
	$scope.deleteQuote(id, type, refer);

	interface.setMenuStatus('Delete Quote');
};




//Add up all the subtotals to calculate the total cost of the quote, stored in quoteData
$scope.getSubtotal = function(qa, qd){
	//pass in qa and qd - quoteArray and quoteData - different for update quote or create quote

	var jobtotal = 0;
	var sub = 0;
	var total = 0;
	var vat = 0;


	//only calculate the subtotal when there is quoteData to work with and the vat_rate promise is returned
	if((qa) && ($scope.vat_rate.$$state.status == 1)){

	var rate = $scope.vat_rate.$$state.value.data;

	//load each subtitle
	for(var i = 0; i < qa.length; i++){
		var sub = 0;

		//calculate each subtotal - the total of all jobs for the subtitle
		for(var j = 0; j < qa[i].jobs.length; j++){
			var jobtotal = 0;

			//calculate the jobs total and store it for that job
			var jobtotalTemp = (qa[i].jobs[j].cost * qa[i].jobs[j].qty);
			
			//round to 2 decimal places
			jobtotal = +jobtotalTemp.toFixed(2);

			//store the jobs total in the quotearray
			qa[i].jobs[j].total = jobtotal;

			//add the job total to the total for the subtitle to get the subtotal
			sub += qa[i].jobs[j].total;	
			//store the subtotal in the quotearray
			qa[i].subtotal = sub;
		}

	//calculate the total of all subtotals
        total += qa[i].subtotal;	
    	}

	var temptotal = total;

	//store the total sum of all subtotals in quoteData as 'total_excluding_vat'
	qd.total_excluding_vat = +temptotal.toFixed(2);

	//calculate the net total, including vat rate
	vat = ((total / 100) * rate);
	temptotal = qd.total_excluding_vat + vat;

	//store the net total in quotedata
	qd.net_total = +temptotal.toFixed(2);
	}	//end of if(quoteArray != undefined)

	return total;
};





//select the correct vars (search)quoteData and (search)quoteArray for calculating the subtotal
$scope.getSubtotalVars = function(type){

	//select the correct var to use based on the current page - create uses quoteData and update uses searchQuoteData
	var quote_arr = $scope.createOrUpdateArray(type);
	var quote_data = $scope.createOrUpdateData(type);

	var qa = quote_arr;
	var qd = quote_data;

	$scope.getSubtotal(qa, qd);
};
 




//split the quote tags_id into an array
$scope.tags_split = function(tags_id){	
	return Tags.tags_split(tags_id);
}






//on tag search page, display confirm prompt before deleting quote
$scope.deleteQuoteCheck = function(ev, id, address, type, refer){
	var Message = 'Are you sure you want to delete Quote ';
	var success = 'Warning';

	//display the angular material confirm prompt dialog box
	//Set initial focus on the Cancel button
	var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).removeClass('md-focused');
                        angular.element($cancelButton).addClass('md-focused');
                        $cancelButton.focus();
            }})
	
		.title(success)
		.htmlContent(Message + id + ' for Address <b>' + address + '</b>?')
		.ariaLabel(success)
		.ok('OK')
		.cancel('Cancel')
		.targetEvent(null);

		$mdDialog.show(confirm).then(function(answer){
			//if select Ok, then delete the quote
			$scope.home_deleteQuote(id, type, refer);
		}, function(){
			//if select Cancel
		});

};



//get tag id and type from the input tagfilter
$scope.mySplit = function(tagfilter) {
	var tagfilter_array = [];

	//Convert the tagfilter from 1 value object to an array
	angular.forEach(tagfilter, function(value, key){
		tagfilter_array.push(value);
		tagfilter_array.push(key);
	});

	//Set the tag type and id using setters in the Tags service
	Tags.setTagfilter_id(tagfilter_array[0]);
	Tags.setTagfilter_type(tagfilter_array[1]);
};





//move the work section Up
$scope.moveSectionUp = function($index, type){

	var currentIndex = $index;
	var newIndex = $index - 1;

	if (currentIndex  > 0 ) {
		//get the name of the array to update - quoteArray or searchQuoteArray
		var quote_arr = $scope.createOrUpdateArray(type);

		var sectionToMove = quote_arr[currentIndex];
    		quote_arr.splice(currentIndex, 1);
    		quote_arr.splice(newIndex, 0, sectionToMove);	
	}

};





//move the work section Down
$scope.moveSectionDown = function($index, type){

	var currentIndex = $index;
	var newIndex = $index + 1;

	//get the name of the array to update - quoteArray or searchQuoteArray
	var quote_arr = $scope.createOrUpdateArray(type);

	var sectionToMove = quote_arr[currentIndex];
    	quote_arr.splice(currentIndex, 1);
    	quote_arr.splice(newIndex, 0, sectionToMove);	

};





//move the job Down
$scope.moveJobDown = function(sectionIndex, $index, type){

	var currentSectionIndex = sectionIndex;
	var currentJobIndex = $index;
	var newIndex = $index + 1;

	//get the name of the array to update - quoteArray or searchQuoteArray
	var quote_arr = $scope.createOrUpdateArray(type);

	var sectionToMove = quote_arr[currentSectionIndex].jobs[currentJobIndex];
    	quote_arr[currentSectionIndex].jobs.splice(currentJobIndex, 1);
    	quote_arr[currentSectionIndex].jobs.splice(newIndex, 0, sectionToMove);	

};





//move the job Up
$scope.moveJobUp = function(sectionIndex, $index, type){

	var currentSectionIndex = sectionIndex;
	var currentJobIndex = $index;
	var newIndex = $index - 1;

	if (currentJobIndex > 0 ) {
		//get the name of the array to update - quoteArray or searchQuoteArray
		var quote_arr = $scope.createOrUpdateArray(type);

		var sectionToMove = quote_arr[currentSectionIndex].jobs[currentJobIndex];
    		quote_arr[currentSectionIndex].jobs.splice(currentJobIndex, 1);
    		quote_arr[currentSectionIndex].jobs.splice(newIndex, 0, sectionToMove);	
	}

};







//emit in Client Controller. Get the quote record for the passed in quote id
$rootScope.$on("CallQuote_Search", function(event, id){
	$scope.searchQuote(id);
});




//Reset the start page for paging on the Home Page (Tag Search)
$scope.resetPage = function() {
    
	$scope.$$childTail.$$childTail.currentPage = 1;
  
};





//go to create new quote page. Used when for the unsaved quote button on quote management
$scope.createNew = function(){
	interface.setSelection('createQuote');
	interface.setMenuStatus('Create New Quote');
	interface.setCurrentNav('createQuote');
};




//calculate the height of work_required buttons. based on having 6 property_type buttons
$scope.calculateButtonHeight = function(work_required){

	if(work_required){
		var length = work_required.length - 1;		//remove the first 0 tag from the length total as it is not shown

		if(length < 5){
			$scope.buttonHeight = 70;
		}
		if(length == 5){
			$scope.buttonHeight = 70;
		}
		if(length == 6){
			$scope.buttonHeight = 57;
		}
		if(length == 7){
			$scope.buttonHeight = 48;
		}
		if(length == 8){
			$scope.buttonHeight = 41;
		}
		if(length == 9){
			$scope.buttonHeight = 32;
		}
		if(length == 10){
			$scope.buttonHeight = 24;
		}
		if(length > 10){
			$scope.buttonHeight = 24;		//any smaller is too small to accurately touch on phone screen
		}

	}
};





//close the angular material dialog box
$scope.closeDialog = function() {
	$mdDialog.hide();
};





//job menu
var originatorEv;

$scope.openMenu = function($mdMenu, ev) {
	originatorEv = ev;
      	$mdMenu.open(ev);
};


originatorEv = null;



});		//end of Quote Controller