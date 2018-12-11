// public/js/app.js

//get token from route
//var xhReq = new XMLHttpRequest();
//xhReq.open("GET", "//" + window.location.hostname + "/api/token", true);
//xhReq.send(null);


//declare all the angular controllers and services
angular
.module('quoteApp', ['interfaceCtrl', 'quoteCtrl', 'quoteService', 'clientCtrl', 'clientService', 'interfaceService', 'tagsCtrl', 'tagsService', 
'vatRateCtrl', 'vatRateService', 'companyAddressCtrl', 'companyAddressService', 'pdfCtrl', 'pdfService', 'photoCtrl', 'photoService', 
'angularUtils.directives.dirPagination', 'authCtrl', 'authService', 'ngRoute', 'ngCookies', 'ngFileUpload', 'uiCropper', 'ngAnimate'], function 




//change the angular variable braces so they are different from the laravel style
($interpolateProvider) {
	$interpolateProvider.startSymbol('<%');
	$interpolateProvider.endSymbol('%>');
})
.config(config)
.run(run)



//.constant("CSRF_TOKEN", xhReq.responseText)
//console.log(xhReq.responseText)


//set angular material palette colour - used for buttons
.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
	.primaryPalette('blue-grey')
	.accentPalette('blue-grey');  	//used for submit button with md-accent
})




//convert date to format suitable for all devices ios/android/windows, etc
.filter('dateToISO', function() {
	return function(input) {

		//http://stackoverflow.com/questions/38496521/angularjs-custom-filter-not-working-on-ios-and-ie	    
		var t = input.split(/[- :]/);
        	var date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
        	return date;
  	};
})





//Convert laravel timestamp to uk date format
.filter('usadateFilter', function() {
	return function(date) {

    		//eg '2017-04-26 21:04:01';
    		var dateusa = date;

    		var year = dateusa.slice(0, 4);
    		var month = dateusa.slice(5, 7);
    		var day = dateusa.slice(8, 10);

    		return day + '/' + month + '/' + year;
    	}
})





//Do not show quotes with id = 0
.filter('filter0quote', function(){

	return function(q){

    		var i, quote, quoteFilter = [];

	
		//check the quote object exists
		if(q){
    			for (i = 0; i < q.length; i++) {
				quote = q[i];

				//if the quote id is not the temp record id=0, then add to the array
				if (quote.id != '0'){
					quoteFilter.push(quote);
        			}
			}

    		}

	return quoteFilter;

	}

})



//name filter takes as input a user entered client_id and checks all the quote records for this client_id, and returns the matching quotes

//Name filter (used eg on quote management) - required because:
//1.) The searchClient_id value is just 4 not "4" as it is in the quote object. 
//2.) Using :true on the filter in view means no start value is defined. So it initially shows no quotes until a name is selected.
//3.) When emailing quote, if it does not have only 1 name, eg has 2 names, id 4 and id 14, then it displays 2 names & 2 email addresses in the send email dialog box.
.filter('nameidfilter', function() {
	return function(quote, $scope, clientNameIdSearch){

		var i, q, quoteFilter = [];
		
		//if no name is selected or searched for, then return all the quotes
		//id=0 falls here as undefined, so need condition against it - required for (client management - quotes created) for Client not selected id=0
		if ( (clientNameIdSearch != '0') && (((quote == undefined) || (clientNameIdSearch == '') || (clientNameIdSearch  == undefined))) ){
			return quote;
		}
		if ((clientNameIdSearch == '0') && (quote == undefined)) {
			return quote;
		}

		for (i = 0; i < quote.length; i++) {
			q = quote[i];
			if(q.client_id == clientNameIdSearch){
				//client_id for the quote matches, so keep this record
				quoteFilter.push(q);	
			}else{
				//not a matching client_id so dont keep this record
			}
		}
		return quoteFilter;
   	}

})




//get the client name for the passed in client id
.filter('clientnamefilter', function() {
	return function(ev, clients, clientIdSearch){

		var i, c, clientFilter = [];
		var clientNotSelected = [];
		
		//if no id is selected or searched for, then return all the quotes
		//id=0 falls here as undefined, so need condition against it - required for (quote management) for Client not selected id=0
		if ((clientIdSearch != 0) && (((clients == undefined) || (clientIdSearch == '') || (clientIdSearch  == undefined))) ){
			return clients;
		}
		if ((clientIdSearch == '0') && (clients == undefined)) {
			return clients;
		}
		if (clients == undefined) {
			return clients;
		}

		for (i = 0; i < clients.length; i++) {
			c = clients[i];
			
			//store the client not selected client record, required if no matching client record is found for the clientIdSearch
			if(c.id == 0){
				clientNotSelected.push(c);
			}

			//check if any client records match the quotes clientIdSearch
			if(c.id == clientIdSearch){
				//client_id for the quote matches, so keep this record
				clientFilter.push(c);	
			}
		}

		//use 'Client not selected' if no matching client record is found
		if (clientFilter == ''){
			//the client record has been deleted, so use client id 0 as placeholder
			clientFilter = clientNotSelected;
		}
		return clientFilter;
   	}

})






//angular router
config.$inject = ['$routeProvider', '$locationProvider'];
	function config($routeProvider, $locationProvider) {
        	$routeProvider
            	.when('/', {
                	templateUrl: 'main.html'
            	})

            	.when('/login', {
                	controller: 'AuthenticationController',
                	templateUrl: 'login.html',
                	controllerAs: 'vm'
            	})

		.when('/register', {
		        controller: 'AuthenticationController',
                	templateUrl: 'register.html'
            	})

           	.otherwise({ 
			redirectTo: '/login' 
		});
	}





//authentication
run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
	function run($rootScope, $location, $cookies, $http) {
        	// keep user logged in after page refresh
        	$rootScope.globals = $cookies.getObject('globals') || {};

        	if ($rootScope.globals.currentUser) {
            		$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        	}

        	$rootScope.$on('$locationChangeStart', function (event, next, current) {
            		// redirect to login page if not logged in and trying to access a restricted page
            		var restrictedPage = $.inArray($location.path(), ['/login']) === -1;

			//check the angular login
            		var loggedIn = $rootScope.globals.currentUser;
            		if (restrictedPage && !loggedIn) {
                		$location.path('/login');
            		}

        	})


	}


