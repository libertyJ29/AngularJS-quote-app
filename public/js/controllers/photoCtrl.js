// public/js/controllers/photoCtrl.js

angular.module('photoCtrl', ["ngMaterial"])
.controller('photoController', function ($scope, $rootScope, $http, Photo, Upload, Quote, interface, $mdDialog, $window, $timeout) {

//init timer for angular material dialog box
var mytimer = $timeout();

  

//get api_token for photo upload service
var api_token = $rootScope.globals.currentUser.api_token;





//Dialog box for view, upload or delete Photo for quote
$scope.quoteCtrl_photo_dialog = function(ev, quote, refer) {
	$scope.refer = refer;
	$scope.quote = quote;

	//clear all upload vars before loading dialog box
	$scope.progress = '';
	$scope.sourceImg = '';
	$scope.croppedImg = '';
	$scope.errorMsg = '';
	$scope.result = '';
	$scope.photostatus = '';				//photo deletion status message
	$scope.photoexists = '';

	//reset the tab for initial display
	$scope.photomanage = '';


	//check if the photo exists on the server
	$scope.checkPhoto(quote);


  	$mdDialog.show({
       		templateUrl: 'dialog.photomanagement.html',
       		parent: angular.element(document.body),
       		targetEvent: ev,
       		scope: $scope,        
       		preserveScope: true, 
		fullscreen: true,
       		clickOutsideToClose:true,
    	})
 
};





//check photo exists on server
$scope.checkPhoto = function(quote){
	if(quote.photo) {
    		var url = '/quote_photo/' + quote.photo;
    		var request = new XMLHttpRequest();
    		request.open('HEAD', url, false);
    		request.send();

    		if(request.status == 200) {
			//requested file exists
        		$scope.photoexists = true;
    		} else {
			//requested file does not exist
        		$scope.photoexists = false;
    		}
	} else {
		//no photo uploaded for this quote
    		$scope.photoexists = false;
	}
};





$scope.uploadSourcePhotoNow = function(file, id, refer, quote) {
	//upload and resize the whole original source image
	$scope.uploadSourcePhoto(file, id, refer, quote, 'source', '800', '600');

	//now upload a small thumbnail of the image
	//$scope.uploadSourcePhoto(file, id, 'small', quote, 'small', '500', '300');
};





//upload and resize the whole original source image
$scope.uploadSourcePhoto = function(file, id, refer, quote, imgType, resizeWidth, resizeHeight) {

	//show the waiting icon
	$scope.loading = true;

	//reset timer
	$timeout.cancel(mytimer);

        if(file) {	
		//resize the source photo before uploading
		var options = {width: resizeWidth, height: resizeHeight, quality: 0.9, centerCrop: true, type: 'image/jpeg', restoreExif: true};
		
		Upload.resize(file, options).then(function (resizedFile) {

           		Photo.uploadPhotoSource(id, refer, resizedFile, imgType)
	    		//success
		  	.then(function (response) {
                		$timeout(function () {
                   			//$scope.result = response.data;
					
					//reload the full quotes object
					Quote.get()
					.success(function(data) {
						$scope.quotes = data;
					})
                		});	
	    		//error
            		}, function (response) {
                		if(response.status > 0){
					//do not show the waiting icon anymore
					$scope.loading = false;

                    			$scope.errorMsg = response.status + ' UPLOAD FAILED: ' + response.data;
				}
	    		//progress bar
            		}, function (evt) {
                		$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            		});

			
			$scope.afterPhotoUploadVariableUpdate(quote.id);  
		
		})  //end of resize src image

	} //end of if file exists
	else{
		$scope.noFileSelectedForUpload();
	}

};









$scope.uploadCroppedPhotoNow = function(file, name, id, refer, quote) {
	//upload the original cropped image
	$scope.uploadCroppedPhoto(file, name, id, refer, quote);

	//now upload a small thumbnail of the image
	//$scope.uploadSourcePhoto(file, id, 'small', quote, 'small', '500', '300');
};





//upload the cropped image
$scope.uploadCroppedPhoto = function (file, name, id, refer, quote) {

	//show the waiting icon
	$scope.loading = true;

	//reset timer
	$timeout.cancel(mytimer);

	//only attempt upload if a file is selected
	if(file){
		Photo.uploadPhotoCropped(id, refer, file, name)
		//success
       		.then(function (response) {
            		$timeout(function () {
                		//$scope.result = response.data;

				//reload the full quotes object
				Quote.get()
				.success(function(data) {
					$scope.quotes = data;
				})
            		});
		//error
        	}, function (response) {
            		if (response.status > 0){
				//do not show the wait icon anymore
				$scope.loading = false;

				$scope.errorMsg = response.status + ' UPLOAD FAILED: ' + response.data;
			}
		//progress bar
        	}, function (evt) {
            		$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        	});


		//clear the vars after upload
		dataUrl = '';
		name = '';

		$scope.afterPhotoUploadVariableUpdate(quote.id);  
	
	} //end of if file exists
	else{
		$scope.noFileSelectedForUpload();
	}

};





$scope.afterPhotoUploadVariableUpdate = function(id){
//Wait 4s after uploading before viewing uploaded image. Give time for upload service to finish, was wait 4s
	mytimer = $timeout(function() {


		//check if the photo exists on the server after upload
		//$scope.checkPhoto(quote);

		//file is now uploaded, so change file exists flag to true 
		$scope.photoexists = true;

		//update the photo field of the quote object in the view
		$scope.quote.photo = 'quote' + id + '.jpg';
			
		//do not show the wait icon anymore
		$scope.loading = false;

		//change to the view photo tab
		$scope.photomanage = 'view';	
		//do not show progress bar after upload finished
		$scope.progress = '';
	}, 4000);


}




$scope.noFileSelectedForUpload = function(){
	//no photo selected for upload
	$scope.uploadstatus = 'Please select a photo to upload!';

	//do not show the wait icon anymore
	$scope.loading = false;

	mytimer = $timeout(function() {

	
		//delete the above 'no photo selected' message after 5s
		$scope.uploadstatus = '';
	}, 5000);

  
}





//delete photo from the server
$scope.deletePhoto = function(id){

	Photo.deletePhoto(id)
	.success(function(data) {

		//pass the success or error message to the view
		$scope.photostatus = data;

		//reload the entire quotes object
		Quote.get()
		.success(function(data){
			$scope.quotes = data;

			//update the quote object with matching id after photo delete, as it is used for the md-dialog box data
			angular.forEach($scope.quotes, function(value, key){
				//store quote record with matching id in the local quote object
				if(value.id == id){
					$scope.quote = value;
				}
			});

			//check if photo still exists on server
			$scope.checkPhoto($scope.quote);		

			mytimer = $timeout(function() {

	
			//clear the delete message after 3s
				$scope.photostatus = '';
			}, 3000);

  
		})

	})
	.error(function (error) {
                 	 //error message
                  	  $scope.photostatus = 'Unable to Delete Photo!!';

	})

};






});	//end of Photo Controller
