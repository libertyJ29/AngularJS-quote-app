// public/js/services/clientService.js

angular.module('clientService', [])

.factory('Client', function($http, $rootScope) {


var api_token = $rootScope.globals.currentUser.api_token;

//update the api_token var here when it is updated in AuthenticationService ie when a user logs in
$rootScope.$on("Call_updateGlobalCredentials", function(events, args){
	return api_token = args;
});


return {

//get all the stored clients
	get : function() {
		return $http.get('/api/clients' + '?api_token='+api_token);
	},




//search for a client
	search : function(id) {
		return $http.get('/api/clients' + id + '?api_token='+api_token);
	},




//store a client
	save: function(clientData) {
		return $http({
			method: 'POST',
			url: '/api/clients' + '?api_token='+api_token,
			headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
			data: $.param(clientData)
		});
	},




//update a client
	update: function(searchClientData) {
		return $http({
			method: 'PUT',
			url: '/api/clients' + searchClientData.id + '?api_token='+api_token,
			headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
			data: $.param(searchClientData)
		});
	},




//delete a client
	destroy : function(id) {
		return $http.delete('/api/clients/' + id + '?api_token='+api_token);
	}


}//end of return


});	//end of Client Service