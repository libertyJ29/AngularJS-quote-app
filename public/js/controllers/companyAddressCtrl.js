// public/js/controllers/companyAddressCtrl.js

angular.module('companyAddressCtrl', ["ngMaterial"])
.controller('CompanyAddressController', function ($scope, $rootScope, $http, CompanyAddress, interface) {


$scope.company_address = {name: '', address: '', city: '', county: '', postcode: '', email: '', phone: ''};



//#Get the Company Address
CompanyAddress.get()
.then(function(data) {
	$scope.company_address = data;
});




//#Update the Company Address
$scope.updateCompanyAddress = function(company_address) {

	//Pass in the company_address object from the form
	CompanyAddress.update($scope.company_address)
	.success(function(data) {
		$scope.status = 'Company Address successfully updated!';

		//show angular material dialog box with Success message	
		interface.DialogBoxTimeout($scope.status, 'Success');

		//reload the Company Address object
		CompanyAddress.get()
		.then(function(data) {
			$scope.company_address = data;
		})
	})
	.error(function (error) {
                $scope.status = 'Unable to update Company Address!!';

		//show error message in angular material dialog box
		interface.DialogBoxTimeout($scope.status, 'Error');
	});

};		//end of scope.updateVatRate()







});	//end of Company Address Controller
