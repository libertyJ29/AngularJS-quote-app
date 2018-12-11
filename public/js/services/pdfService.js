// public/js/services/pdfService.js

angular.module('pdfService', [])

.factory('PDF_Service', function($http, $q, $timeout, $rootScope) {


var api_token = $rootScope.globals.currentUser.api_token;


return {

//get all pdf quotes
	get : function() {
		return $http.get('/api/pdf_sent' + '?api_token='+api_token);
	},



//send a pdf quote by email to client
	pdf_send: function(id, email_message, email_subject, email_address) {
		return $http({
			method: 'POST',
			url: '/api/pdf_send' + id + '?api_token='+api_token,
			data: {email_message: email_message, email_subject: email_subject, email_address: email_address}
		});
	},



//view a pdf
	pdf_view : function(id) {
		$http({
			method: 'GET',
			url: '/api/pdf_view' + id + '?api_token='+api_token
		});
		$window.open('/api/pdf_view' + id);
	},




//check if a pdf file exists on the server
	pdf_check_exists: function(filename) {

		var deferred=$q.defer();

		$http({
			method: 'POST',
			url: '/api/pdf_check_exists' + '?api_token='+api_token,
			data: {filename: filename}
			}).then(function(data) { 
	
				//console.log('the pdf file exists?= ' + data);

				deferred.resolve(data); 
			});

		return deferred.promise;
	}




}//end of return


});	//end of PDF_Service 