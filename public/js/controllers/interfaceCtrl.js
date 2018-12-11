// public/js/controllers/interfaceCtrl.js

angular.module('interfaceCtrl', ["ngMaterial", "angularUtils.directives.dirPagination", "ngAnimate"])

.controller('interfaceController', function ($scope, $window, $rootScope, $location, $http, $mdSidenav, interface) {

//defined for closing the side nav menu
$scope.toggleLeft = buildToggler('left');
$scope.toggleRight = buildToggler('right');


$scope.selection = interface.getSelection();
$scope.menuStatus = interface.getMenuStatus();
$scope.currentNavItem = interface.getCurrentNav();





//watch for page change
$scope.$watch('selection.data', function() {
	//console.log("selection is "+$scope.selection.data);
	$scope.webAuthChecker();
});




//check user is logged in with laravel web authentication before handling page change request
$scope.webAuthChecker = function() {
	//webAuth returns a promise with user data {id, name, password, etc}
	$scope.webAuthCheck = $http.get('/webAuth').then(function(result){

		var authCheck = angular.isDefined(result.data.name);
		if (!authCheck) {
       			//User NOT authenticated with laravel web auth
			//console.log("user not logged in with laravel web auth!!");

			//call fail method is authenticationCtrl
			$rootScope.$broadcast("Call_webAuth_Fail");
 		}
		if (authCheck) {
			//User IS logged in ok with laravel web auth
			//console.log("user logged in with laravel web auth");
		}
	});	

};













//#Side Nav Menu Selections#



$scope.tagSearch = function() {
        interface.setSelection('tagSearch');			//define which section to show	
	interface.setMenuStatus('Tag Search');			//write the status text at top
	$scope.toggleLeft();					//close the menu after
};



//close the menu on click close button
$scope.closeMenu = function() {
	$scope.toggleLeft();
};



//close the menu on swipe left
$scope.onSwipeLeft = function() {
	$scope.toggleLeft();
};




$scope.createNewQuote = function() {
	interface.setSelection('createQuote');			//define which section to show	
	interface.setMenuStatus('Create New Quote');		//write the status text at top
	interface.setCurrentNav('createQuote');			//which nav tab to select
	$scope.toggleLeft();					//close the menu after
};



$scope.quoteManagement = function() {
        interface.setSelection('searchQuote');			//define which section to show
	interface.setMenuStatus('Search for a Quote');		//write the status text at top
	interface.setCurrentNav('searchQuote');			//which nav tab to select
	$scope.toggleLeft();					//close the menu after
};



$scope.createClient = function() {
        interface.setSelection('createClient');			//define which section to show
	interface.setMenuStatus('Create New Client');		//write the status text at top
	interface.setCurrentNav('createClient');		//which nav tab to select
	$scope.toggleLeft();					//close the menu after
};


$scope.clientManagement = function() {
        interface.setSelection('searchClient');			//define which section to show
	interface.setMenuStatus('Search for a Client');		//write the status text at top
	interface.setCurrentNav('searchClient');		//which nav tab to select
	$scope.toggleLeft();					//close the menu after
};


$scope.tagManagement = function() {
        interface.setSelection('workRequired');			//define which section to show
	interface.setMenuStatus('Tags - Work Required');	//write the status text at top
	interface.setCurrentNav('workRequired');		//which nav tab to select
	$scope.toggleLeft();					//close the menu after
};


$scope.settings = function() {
        interface.setSelection('settings_vat');			//define which section to show
	interface.setMenuStatus('Settings - Vat Rate');		//write the status text at top
	interface.setCurrentNav('settings_vat');		//which nav tab to select
	$scope.toggleLeft();					//close the menu after
};









//#Tabs Bar Selections#


//Settings Tabs bar
$scope.settings_vat = function() {
        interface.setSelection('settings_vat');			//define which section to show
	interface.setMenuStatus('Settings - Vat Rate');		//write the status text at top
	interface.setCurrentNav('settings_vat');
};

$scope.settings_address = function() {
        interface.setSelection('settings_address');		//define which section to show
	interface.setMenuStatus('Settings - Company Address');	//write the status text at top
	interface.setCurrentNav('settings_address');		//which nav tab to select
};

$scope.settings_account = function() {
        interface.setSelection('settings_account');		//define which section to show
	interface.setMenuStatus('Settings - Account');		//write the status text at top
	interface.setCurrentNav('settings_account');		//which nav tab to select
};





//Tags Tabs bar
$scope.tags_property_type = function(){
	interface.setSelection('propertyType');			//define which section to show
	interface.setMenuStatus('Tags - Property Type'); 	//write the status text at top
	interface.setCurrentNav('propertyType');		//which nav tab to select
};

$scope.tags_work_required = function(){
	interface.setSelection('workRequired');			//define which section to show
	interface.setMenuStatus('Tags - Work Required'); 	//write the status text at top
	interface.setCurrentNav('workRequired');		//which nav tab to select
};





//Quote Tabs bar
$scope.quote_search = function(){
	interface.setSelection('searchQuote');			//define which section to show
	interface.setMenuStatus('Search for a Quote'); 		//write the status text at top
	interface.setCurrentNav('searchQuote');			//which nav tab to select
};

$scope.quote_create = function(){
	interface.setSelection('createQuote');			//define which section to show
	interface.setMenuStatus('Create New Quote');		//write the status text at top
	interface.setCurrentNav('createQuote');			//which nav tab to select
};

$scope.quote_update = function(){
	interface.setSelection('quoteManagement');		//define which section to show
	interface.setMenuStatus('Update Quote');		//write the status text at top
	interface.setCurrentNav('updateQuote');			//which nav tab to select
};







//Client Tabs bar
$scope.client_search = function(){
	interface.setSelection('searchClient');			//define which section to show
	interface.setMenuStatus('Search for a Client'); 	//write the status text at top
	interface.setCurrentNav('searchClient');		//which nav tab to select	
};

$scope.client_create = function(){
	interface.setSelection('createClient');			//define which section to show
	interface.setMenuStatus('Create New Client');		//write the status text at top
	interface.setCurrentNav('createClient');		//which nav tab to select
};

$scope.client_update = function(){
	interface.setSelection('updateClient');			//define which section to show
	interface.setMenuStatus('Update Client');		//write the status text at top
	interface.setCurrentNav('updateClient');		//which nav tab to select
};



//close the sidenav menu
function buildToggler(componentId) {
	return function() {
        	$mdSidenav(componentId).toggle();
        }
}





//set the input field widths for different sections based on the current screen width
$scope.setSectionWidths = function(){
	$scope.widths = {};

	//set the quote section flex box width
	if ($scope.width < '750'){
		$scope.widths.quote = '70';
		$scope.widths.description = '95';
		$scope.widths.quote_big = '90';
		$scope.widths.quote_med = '70';
		$scope.widths.quote_small = '40';
	}
	if ($scope.width >= '750'){
		$scope.widths.quote = '40';
		$scope.widths.description = '65';
		$scope.widths.quote_big = '50';
		$scope.widths.quote_med = '30';
		$scope.widths.quote_small = '20';
	}

	//set the client section flex box width
	if ($scope.width < '750'){
		$scope.widths.client = '70';
	}
	if ($scope.width >= '750'){
		$scope.widths.client = '30';
	}

	//set the vat rate section flex box width
	if ($scope.width < '750'){
		$scope.widths.rate = '30';
	}
	if ($scope.width >= '750'){
		$scope.widths.rate = '10';
	}

	//set the company address section flex box width
	if ($scope.width < '750'){
		$scope.widths.address = '70';
		$scope.widths.address_big = '90';
	}
	if ($scope.width >= '750'){
		$scope.widths.address = '40';
		$scope.widths.address_big = '40';
	}
	
	//set the Update Tag Button text used for Tag Management
	if ($scope.width < '600'){
		$scope.widths.update_tag = 'Update';
	}
	if ($scope.width >= '600'){
		$scope.widths.update_tag = 'Update Tag';
	}

}





})	//end of Interface Controller









//Determine the current Screen Width
.directive('screenDirective', ['$window', function ($window) {
     return {
        link: link,
        restrict: 'A'           
     };
     function link(scope, element, attrs){
        scope.width = $window.innerWidth;
	scope.setSectionWidths();		//set input widths
        
            function onResize(){
                //console.log('Screen width = ' + $window.innerWidth);
                if (scope.width !== $window.innerWidth)
                {
                    scope.width = $window.innerWidth;
		    scope.$digest();
	            scope.setSectionWidths();	//recalculate the input field widths
                    
                }
            };

            function cleanUp() {
                angular.element($window).off('resize', onResize);
            }

            angular.element($window).on('resize', onResize);
            scope.$on('$destroy', cleanUp);
     }    
 }]);


