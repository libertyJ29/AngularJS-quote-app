// public/js/services/quoteService.js

angular.module('quoteService', [])
	.factory('Quote', function($http, $rootScope) {


var api_token = $rootScope.globals.currentUser.api_token;

//update the api_token var here when it is updated in AuthenticationService ie when a user logs in
$rootScope.$on("Call_updateGlobalCredentials", function(events, args){
	return api_token = args;
});


return {

//get all the stored quotes 
	get : function() {
		return $http.get('/api/quotes' + '?api_token='+api_token);
	},


//search for a quote 
	search : function(id) {
		return $http.get('/api/quotes/' + id + '?api_token='+api_token);
	},


//store a quote to db
	save: function(quoteArray, quoteData, type) {
		return $http({
			method: 'POST',
			url: '/api/quotes' + '?api_token='+api_token,
			data: {quoteArray: quoteArray, quoteData: quoteData, type: type}	//send as raw json
		});
	},


//update a quote
	update: function(searchQuoteData) {
		return $http({
			method: 'PUT',
			url: '/api/quotes' + searchQuoteData.id + '?api_token='+api_token,
			headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
			data: $.param(searchQuoteData) 	
		});
	},


//test show a photo from FileController.php
	showPhoto1Now: function(imgName) {
		return $http.get('/api/getImage/' + imgName + '?api_token='+api_token);
	},


//delete a quote
	destroy : function(id, type=null) {
		return $http.delete('/api/quotes' + '' + id + ',' + type + '?api_token='+api_token);
	}




}//end of return


});	//end of Quote Service