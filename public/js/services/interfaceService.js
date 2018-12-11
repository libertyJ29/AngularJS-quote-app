// public/js/services/interfaceService.js

//interface service providers role is to make the menu selection variables available to all controllers and the view


angular.module('interfaceService', [])

.service('interface', function ($timeout, $mdDialog) {

	//init timer for angular material dialog box
	var mytimer = $timeout();

 

	var selection = {data: 'tagSearch'};		//define the initial start options page - which is the Tag Search (Home) page
	var menuStatus = {data: 'Tag Search'};
	var currentNav = {data: ''};

	return {
		getSelection: function () {
			return selection;
			},
		setSelection: function(value) {
			selection.data = value;
			},
		getMenuStatus: function () {
			return menuStatus;
			},
		setMenuStatus: function(value) {
			menuStatus.data = value;
			},
		getCurrentNav: function () {
			return currentNav;
			},
		setCurrentNav: function(value) {
			currentNav.data = value;
			},



		//display the angular material dialog box
		DialogBoxTimeout : function(status, success){
	
			//cancel any previous timer
			$timeout.cancel(mytimer);

			mytimer = $timeout(function() {


				$mdDialog.hide(
	  				$mdDialog.alert()
				);
			}, 4000,
			//do before timer
			$mdDialog.show(
				$mdDialog.alert()
					.clickOutsideToClose(true)
					.title(success)
					.textContent(status)
					.ariaLabel(success)
					.ok('OK')
				)
			);

		}




    	};


});	//end of Interface Service