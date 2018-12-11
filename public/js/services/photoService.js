// public/js/services/photoService.js

angular.module('photoService', [])

.factory('Photo', function($http, $rootScope, Upload) {


var api_token = $rootScope.globals.currentUser.api_token;

//update the api_token var here when it is updated in AuthenticationService ie when a user logs in
$rootScope.$on("Call_updateGlobalCredentials", function(events, args){
	return api_token = args;
});


return {


//delete a photo from server
	deletePhoto: function(id){
	return $http({
			method: 'POST',
			url: '/api/photo_delete' + id + '?api_token='+api_token
		});
	},


//upload source photo to the server
	uploadPhotoSource: function(id, refer, resizedFile, imgType){
		return Upload.upload({
                	url: '/api/photo_upload' + id + ',' + refer + ',' + imgType + '?api_token='+api_token,
                	data: {file: resizedFile}
            		});
	},


//upload cropped photo to server
	uploadPhotoCropped: function(id, refer, file, name){
		return Upload.upload({
	    		url: '/api/photo_upload' + id + ',' + refer + ',' + 'cropped' + '?api_token='+api_token,
            		data: {file: Upload.dataUrltoBlob(file, name)}
		});
	}




}//end of return


});	//end of Photo Service