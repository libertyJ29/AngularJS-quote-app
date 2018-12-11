// public/js/controllers/vatRateCtrl.js

angular.module('vatRateCtrl', ["ngMaterial"])
.controller('VatRateController', function ($scope, $rootScope, interface, $http, VatRate) {



//if the vat rate is updated, then update the vat rate scope in the quote controller also 
$scope.updateVatRateInQuote = function(vat_rate) {
	$rootScope.$broadcast("CallVatRate_Update", $scope.vat_rate);
};




//#Get the Vat Rate
VatRate.get()
.success(function(data) {
	$scope.vat_rate = data;
});





//#Update the Vat Rate
$scope.updateVatRate = function(vat_rate) {

	//Pass in the vat_rate from the form
	VatRate.update($scope.vat_rate)
	.success(function(data) {
		$scope.status = 'Vat Rate successfully updated!';

		//dialog box with successfully updated message	
		interface.DialogBoxTimeout($scope.status, 'Success');

		VatRate.get()
		.success(function(data) {
			//reload the vat_rate onscreen
			$scope.vat_rate = data;
		})
	})
	.error(function (error) {
                $scope.status = 'Unable to update Vat Rate!!';

		//dialog box with error message	
		interface.DialogBoxTimeout($scope.status, 'Error');
	});

};		//end of updateVatRate()






});	//end of Vat Rate Controller
