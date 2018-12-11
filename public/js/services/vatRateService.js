// public/js/services/vatRateService.js

angular.module('vatRateService', [])

.factory('VatRate', function($http, $rootScope) {


var api_token = $rootScope.globals.currentUser.api_token;

//update the api_token var here when it is updated in AuthenticationService ie when a user logs in
$rootScope.$on("Call_updateGlobalCredentials", function(events, args){
	return api_token = args;
});



return {

//get the vat rate
	get : function() {
		return $http.get('/api/vat_rate' + '?api_token='+api_token);
	},



//update the vat rate
	update: function(vat_rate) {
		return $http({
			method: 'PUT',
			url: '/api/vat_rate' + vat_rate + '?api_token='+api_token
		});
	},





}//end of return


});	//end of VatRate Service