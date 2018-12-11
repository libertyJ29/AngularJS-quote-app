// public/js/controllers/tagsCtrl.js

angular.module('tagsCtrl', ["ngMaterial", "ngSanitize"])

.controller('tagsController', function ($scope, $http, Tags, $mdDialog, interface) {


//init the tags object
$scope.tags = {};



//#Get All Tags
Tags.get()
.success(function(data) {
	$scope.tags = data;
});





//#Add New Tag to Work_Required Section
$scope.submitNewWorkRequiredTag = function(newWorkRequiredTag) {

	//do not allow to add an empty tag 
	if(newWorkRequiredTag == null || newWorkRequiredTag == ''){

		//error message
                $scope.status = 'Cannot add an empty tag!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');

	}

	//if new tag is valid
	if(newWorkRequiredTag != null && newWorkRequiredTag != ''){
		
		//read the length of the work_required array 
		var c = $scope.tags.work_required.length - 1;

		//calculate the next id value, using the last inserted work_required tag id 
		var newid = $scope.tags.work_required[c].id + 1;

		//find the next unused index in work_required
		c = c + 1;

		//build new tag object and add to the work_required array at the calculated next index
		$scope.tags.work_required[c] = {id: newid, name:  $scope.newWorkRequiredTag};

		//pass in the tag data from the form
		Tags.save($scope.tags)
		.success(function() {
			Tags.get()
			.success(function(data) {
				//reload the Tags object
				$scope.tags = data;
			});

		})
		.error(function (error) {
                	//error message
                  	$scope.status = 'Unable to add new tag!!';

			//display the error in a popup dialog box
			interface.DialogBoxTimeout($scope.status, 'Warning');
		});

		//clear the add new tag field afterwards
		$scope.newWorkRequiredTag = '';
	}

};






//Prompt to check if really want to delete tag
$scope.deleteTagCheck = function(ev, id, tagname){
	$scope.Message = 'Are you sure you want to delete Tag <b>' + tagname + '</b>';
	$scope.success = 'Warning';
	$scope.id = id;

	//Set initial focus on the Cancel button
	var confirm = $mdDialog.confirm({onComplete: function afterShowAnimation() {
                        var $dialog = angular.element(document.querySelector('md-dialog'));
                        var $actionsSection = $dialog.find('md-dialog-actions');
                        var $cancelButton = $actionsSection.children()[0];
                        var $confirmButton = $actionsSection.children()[1];
                        angular.element($confirmButton).removeClass('md-focused');
                        angular.element($cancelButton).addClass('md-focused');
                        $cancelButton.focus();
            }})
	
		.title($scope.success)
		.htmlContent($scope.Message + '?')
		.ariaLabel($scope.success)
		.ok('OK')
		.cancel('Cancel')
		.targetEvent(null);

		$mdDialog.show(confirm).then(function(answer){
			//if select Ok, then delete the tag
			$scope.deleteTag($scope.id);
		}, function(){
			//if select Cancel
		});

};




//#Delete a Tag
$scope.deleteTag = function(id) {

	var searchid = id;

	var deleteIndex = '';
	var tagNametoDelete = '';

	//find the index for the correct record to delete in the original work_required tag array
	angular.forEach($scope.tags.work_required, function(item, index){
		//if the current item matches the record to delete
		if (item.id == searchid){
			deleteIndex = index;
			tagNametoDelete = item.name;
		}
	});

	//only delete the record if a match was found
	if (deleteIndex != ''){
		//delete the tag from the tags object
		$scope.tags.work_required.splice(deleteIndex, 1);
		$scope.status = 'Tag <b>' + tagNametoDelete + '</b>Deleted Successfully.';
	}

	if (deleteIndex == ''){
		$scope.status = 'Tag was not able to be deleted.';
	}

	//pass this modified tags object to the save service
	Tags.save($scope.tags)
	.success(function(data) {
		//reload the tags object
		Tags.get()
		.success(function(data) {
			$scope.tags = data;
		});
	})
	.error(function (error) {
        	//error message
                $scope.status = 'Unable to delete the tag!!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');
	});

};






//#Update a Tag Name
$scope.TagUpdate = function(){

//pass in the tag data from the form
	Tags.save($scope.tags)
	.success(function() {
		Tags.get()
		.success(function(data) {
			//reload the Tags object
			$scope.tags = data;
		});

	})
	.error(function (error) {
                //error message
               	$scope.status = 'Unable to update tag!!';

		//display the error in a popup dialog box
		interface.DialogBoxTimeout($scope.status, 'Warning');
	});

};






});	//end of Tags Controller
