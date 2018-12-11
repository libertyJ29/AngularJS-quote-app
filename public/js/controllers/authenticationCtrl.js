// public/js/controllers/AuthenticationCtrl.js
angular.module('authCtrl', [])

.controller('AuthenticationController', function ($scope, $rootScope, $location, $http, interface, AuthenticationService, $window, $timeout) {

//init timer for angular material dialog box
var mytimer = $timeout();

 




//get the current csrf token
$scope.csrftok = function(){
	var result = $http.get('/token');
	$scope.csrftoken = result;
	return result;
}



//from interface controller - login expired or login failed
$rootScope.$on("Call_webAuth_Fail", function(events, args){
	console.log("log in expired");
	$scope.webAuthFail();
});



//when webAuth login fails
$scope.webAuthFail = function() {
	$scope.logout();
};





//register button
$scope.register_account = function() {
	$scope.error = '';							//clear any previous laravel error message
	$scope.success = '';							//clear any previous laravel success message
	
	$location.path("/register");
};




$scope.updatePassword = function(id, old_password, new_password, new_password_confirm) {
	AuthenticationService.changePassword(id, old_password, new_password, function(message){
		//output update success or fail to screen
		if(message == 'success') {	
			$scope.error = '';					//clear any previous laravel error message
			$scope.dataLoading = false;

			$scope.updatePasswordForm.$setPristine();		//clear the form 
			$scope.updatePasswordForm.$setUntouched();
			$scope.old_password = '';
			$scope.new_password = '';
			$scope.new_password_confirm = '';

			$scope.status = 'Successfully changed account password!';
			//dialog box with successfully updated message	
			interface.DialogBoxTimeout($scope.status, 'Success');
		} else {
                    	$scope.error = message;
                    	$scope.dataLoading = false;
        	}
	})

};




$scope.logout = function() {
	$scope.dataLoading = true;

	AuthenticationService.LogoutUser(function(message) {
		
		AuthenticationService.ClearCredentials();

		//Logged out successfully!
		if(message == 'success'){
			$scope.dataLoading = false;

			$location.path('/logged_out');
		}
		//Could not log out!
		if(message == 'false'){
			$scope.dataLoading = false;

			$location.path('/login');
		}

	});

}





$scope.loginUser = function(csrf) {
	$scope.dataLoading = true;

        AuthenticationService.LoginUser($scope.username, $scope.password, csrf, function(message, userid, api_token) {
		
        	if(message == 'success') {	
                	AuthenticationService.SetCredentials($scope.username, $scope.password, userid, api_token);

			interface.setSelection('tagSearch');			//set starting page 

			console.log("log in success");

                    	$location.path('/');
			$scope.dataLoading = false;
                } else {
                    	$scope.error = message;
                    	$scope.dataLoading = false;
                }
         });
}





$scope.registerUser = function(csrf){
	$scope.dataLoading = true;

	AuthenticationService.RegisterUser($scope.username, $scope.password, $scope.password_confirmation, csrf, function(message) {

        	if(message == 'success') {
			$scope.success = "You have successfully registered new user '"+$scope.username+"!\nPlease wait...";

			mytimer = $timeout(function() {


				$scope.dataLoading = false;
				$location.path('/');    
			}, 4000);

  

                } else {
                    	$scope.error = message;
			$scope.dataLoading = false;
                }
         });


};




//route for click go back button on register page
$scope.register_goBack = function() {
	$location.path('/'); 
};






})	//end of Authentication Controller






//check 2 passwords match for confirm password
.directive('wjValidationError', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctl) {
      scope.$watch(attrs['wjValidationError'], function (errorMsg) {
        elm[0].setCustomValidity(errorMsg);
        ctl.$setValidity('wjValidationError', errorMsg ? false : true);
      });
    }
  };
});

