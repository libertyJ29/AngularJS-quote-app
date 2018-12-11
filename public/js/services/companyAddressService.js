// public/js/services/companyAddressService.js

angular.module('companyAddressService', [])

.factory('CompanyAddress', function($http, $rootScope) {


var api_token = $rootScope.globals.currentUser.api_token;

//update the api_token var here when it is updated in AuthenticationService ie when a user logs in
$rootScope.$on("Call_updateGlobalCredentials", function(events, args){
	return api_token = args;
});


var company_address = {name: '', address: '', city: '', county: '', postcode: '', email: '', phone: ''};


return {

//get the vat rate
	get : function() {
		return $http.get('/api/company_address' + '?api_token='+api_token).then(function(response) {    
      			return response.data;
		});
	},



//update vat rate
	update: function(company_address) {
		return $http({
			method: 'PUT',
			url: '/api/company_address' + 1 + '?api_token='+api_token,
			headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
			data: $.param(company_address)
		});
	},






}//end of return


});	//end of CompanyAddress Service