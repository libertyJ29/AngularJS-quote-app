// public/js/controllers/clientCtrl.js

angular.module('clientCtrl', ["ngMaterial", "ngMessages", "ngSanitize"])

.controller('clientController', function($scope, $http, Client, Tags, interface, $timeout, $mdDialog, $rootScope) {


//var apitok = $http.get('/api/token')
//	.then(function(data) {
//	$scope.apitok = data;
//});

//init timer for angular material dialog box
var mytimer = $timeout();

  

//defined to hold status messages for debug output in view
$scope.status = '';

//get the menu selection value from the interface service
$scope.selection = interface.getSelection();

//define object to hold the data for a new client
$scope.clientData = {};

//defined to hold the searched for client data
$scope.searchClientData = {};



//#Get All Clients
Client.get()
.success(function(data) {
	$scope.clients = data;
});




//#Search for a Client
$scope.searchClient = function(id) {
	Client.search(id)
	.success(function(data) {
		$scope.searchClientData = data;
	})
	.error(function (error) {
                //error message
                $scope.status = 'Unable to find client record!!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');
	});

};




//#Save a New Client
$scope.submitClient = function() {

	$timeout.cancel(mytimer);

	//Pass in the client data from the form
	Client.save($scope.clientData)
	.success(function(data) {

		//reload the client object that is displayed onscreen
		Client.get()
		.success(function(data){
			$scope.clients = data;
			
			//redirect to client successfully created page
			interface.setSelection('clientCreated');

			$scope.status = 'New Client ' + $scope.clientData.client_name + ' Created Successfully';
 
			//reset the entire Add New Client form model
			$scope.clientData = {};

			//set timer to redirect to client management page after 4 seconds
			mytimer = $timeout(function() {


				interface.setSelection('searchClient');     
				interface.setMenuStatus('Search for a Client');   
				interface.setCurrentNav('searchClient');    
			}, 4000);

  

		});
	})
	.error(function (error) {
                 //error message
                 $scope.status = 'Unable to create new client!!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');
	});

};		//end of scope.submitClient()





//#Delete a Client
$scope.deleteClient = function(id, name) {

	$timeout.cancel(mytimer);

	//pass the id of the client to destroy
	Client.destroy(id)
	.success(function(data) {

		//reload the client object that is displayed onscreen
		Client.get()
		.success(function(data) {
			$scope.clients = data;
			
			//redirect to client successfully deleted page
			interface.setSelection('clientDeleted');

			$scope.status = 'Client ' + name + ' Deleted Successfully';

			//set timer to redirect to client management page after 4 seconds
			mytimer = $timeout(function() {
				interface.setSelection('searchClient');        
			}, 4000);


		});
	})
	.error(function (error) {
        	//error message
        	$scope.status = 'Unable to delete client record!!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');
	});

};		//end of scope.deleteClient()







//#Update a Client
$scope.updateClient = function(searchClientData) {
	$timeout.cancel(mytimer);

	//if try to update client that has not been loaded, it will then update quote id=0
	if(searchClientData.id == null)
	{
		$scope.status = 'Could not Update Client. Load the client in Client Management that you want to update!';
	
		//Reset the entire submit form model
		$scope.searchClientData = {};

		interface.DialogBoxTimeout($scope.status, 'Warning');
	}


	//if a valid existing quote has been loaded 
	if(searchClientData.id != null)
	{
		Client.update(searchClientData)
		.success(function(data) {
			Client.get()
			.success(function(data){

				//reload the client object, now that client has been updated
				$scope.clients = data;
			
				//reset the entire submit form model
				$scope.searchClientData = {};

				$scope.status = 'Client Updated Successfully';

				//redirect to client successfully updated page
				interface.setSelection('clientUpdated');

				//set timer to redirect to client management page after 4 seconds
				mytimer = $timeout(function() {


					interface.setSelection('searchClient');       
					interface.setMenuStatus('Search for a Client');   
					interface.setCurrentNav('searchClient'); 
				}, 4000);

  

			})
			
		})
		.error(function (error) {
                 	 //error message
                  	  $scope.status = 'Unable to update client record!!';

			//display the error in a popup dialog box
			interface.DialogBoxTimeout($scope.status, 'Warning');
                });

	}
};		//end of scope.updateClient()





//go to the update client page
$scope.clientUpdate = function(id) {
		
	interface.setSelection('updateClient');		//define which section to show
        interface.setMenuStatus('Update Client');	//write the status text at top
	interface.setCurrentNav('updateClient');     	//which nav tab to select  

	$scope.searchClient(id);
}




//display a prompt before actually deleting client record
$scope.deleteClientCheck = function(id, name){

	//Do not allow to delete 'Client not selected' name
	if (id == 0)
	{
		$scope.status = 'Cannot Delete Client id 0';
		interface.DialogBoxTimeout($scope.status, 'Warning')
	}
	else if (id != 0)
	{
		$scope.Message = 'Are you sure you want to delete client ';
		$scope.success = 'Warning';

		$scope.YesNoDialogTimeout($scope.Message, $scope.success, id, name);
	}
}




//Ok Cancel Dialog box to confirm to delete the Client record
$scope.YesNoDialogTimeout = function(Message, success, id, name){


//can only pass 1 parameter to the 'show(confirm).then' function, so store the values here in $scope, and access those $scope vars as function parameters later 
	$scope.deleteRecord = {};
	$scope.deleteRecord.id = id;
	$scope.deleteRecord.name = name;

	//Set initial focus on the Cancel button, not the default Ok button
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
		.ariaLabel(success)
		.htmlContent(Message + '<b>' + name + '</b>?')
		.ok('OK')
		.cancel('Cancel')
		.targetEvent(null);
	
		$mdDialog.show(confirm).then(function(answer){
			//if press ok		
			$scope.deleteClient($scope.deleteRecord.id, $scope.deleteRecord.name);
		}, function(){
			//if press Cancel
		});
		
		
};





//split the quote tags_id into an array
$scope.tags_split = function(tags_id){	
	return Tags.tags_split(tags_id);
}





//display the pdf quotes created by the client in an angular material dialog box
$scope.show_clientquotes_Dialog = function(ev, c, quotes){
	$scope.q = quotes;
	$scope.c = c;
	//$scope.pdf_sent_ids = angular.fromJson(quote.pdf_sent_id);	//convert the data into an angular array

	$mdDialog.show({
		templateUrl: 'dialog.clientquotes.html',
      		parent: angular.element(document.body),
      		targetEvent: ev,
      		scope: $scope,        
      		preserveScope: true, 
		fullscreen: true,
      		clickOutsideToClose:true,
    	})
};




//close the angular material dialog box
$scope.closeDialog = function() {
	$mdDialog.hide();
};







//go from Client to Update Quote section
$scope.interfaceCtrl_quoteUpdate = function(id) {

	//Call the update_quote method in the interface controller to use the scope variables there
	$rootScope.$emit("CallQuote_Update", {});

	//emit to Quote Controller - to get quote record for the id
	$rootScope.$emit("CallQuote_Search", id);

	//hide the dialog box on the Client Management section
	$mdDialog.hide();

	//go to Quote->Update section
	interface.setSelection('quoteManagement');		//define which section to show
	interface.setMenuStatus('Update Quote');		//write the status text at top
	interface.setCurrentNav('updateQuote');			//which nav tab to select
}






});	//end of Client Controller