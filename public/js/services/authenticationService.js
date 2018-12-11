// public/js/services/authenticationService.js

'use strict';

angular.module('authService', [])

.factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
    function (Base64, $http, $cookieStore, $rootScope, $timeout) {

        var service = {};


//change the user's password
       service.changePassword = function(id, old_password, new_password, callback) {
		var message = '';

		$http.post('change_password', {id: id, old_password: old_password, new_password: new_password})
                .success(function (response) {
			var data = response.message;

			if(data == 'success') {
                    		message = 'success';
			}
			//change password failed
			if(data != 'success') {
                    		message = data;
               		}

                    callback(message);

		})
		.error(function (error) {
			message = 'Could not change the Password!';
		})

       };





//user login
	service.LoginUser = function (username, password, token, callback) {

	    var message = '';

	    $http.post('login', { name: username, password: password , _token: token })
		
                .success(function (response) {
			var data = response.message;	

			//login is successful
			if(data == 'success') {
				//console.log("log in user id "+response.user.id);
                    		message = 'success';

				var api_token = response.user.api_token;
				var userid = response.user.id;
				
               		}

			//incorrect login details
			if(data != 'success') {
                    		message = 'Username or password is incorrect';
               		}

                    callback(message, userid, api_token);
                })
		.error(function (error) {
			message = 'Could not Authenticate the login details!';
		})

        };





//user logout
	service.LogoutUser = function(callback){
		
		var message = '';
		var userid = $rootScope.globals.currentUser.userid;	//get the user id of the current logged in user
		//console.log("log out user id "+ $rootScope.globals.currentUser.userid);

		$http.post('logout' + userid)
                .success(function (response) {
			message = 'success';

			callback(message);				//pass the message parameter back to the controller
		})
		.error(function (error) {
			message = 'false';

			callback(message);
		})
		
	};




//register a new user
	service.RegisterUser = function (username, password, password_confirmation, token, callback) {

	    var message = '';

	    $http.post('register', { name: username, password: password, password_confirmation: password_confirmation, _token: token })
		
                .success(function (response) {
			var data = response.message;	

			//register successful
			if(data == 'success') {
                    		message = 'success';
               		}

			//register failed
			if(data != 'success') {

				var name = '';
				var pw = '';
				if(data.name){
					name = data.name + '\n';
				}
				if(data.password){
					pw = data.password + '\n';
				}
				message = name  + pw  + 'Unable to register as a new user!';
               		}

                    callback(message);
                })
		.error(function (error) {
			message = 'Could not register new user!';
		})

        };





//set angular login details
        service.SetCredentials = function (username, password, userid, api_token) {
            var authdata = Base64.encode(username + ':' + password);
 
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata,
		    userid: userid,
		    api_token: api_token
                }
            };

	    //when the api_token is updated here, then broadcast to update the var in the services where it is required
	    $rootScope.$broadcast("Call_updateGlobalCredentials", api_token);


            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
    }])



.factory('Base64', function () {
    //jshint ignore:start
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 

    // jshint ignore:end 
});	//end of Authentication Service
