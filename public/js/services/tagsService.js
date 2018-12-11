// public/js/services/tagsService.js

angular.module('tagsService', [])

.service('Tags', function($http, $rootScope) {


var api_token = $rootScope.globals.currentUser.api_token;

//update the api_token var here when it is updated in AuthenticationService ie when a user logs in
$rootScope.$on("Call_updateGlobalCredentials", function(events, args){
	return api_token = args;
});


//get the tags data
var tags = $http.get('/api/tags' + '?api_token='+api_token);


//default values
var tagfilter_id = {data: ''};
var tagfilter_type = {data: ''};

return {

//get all the stored tags
	get : function() {
		return tags;
	},

	

//store the tags object to db, which has the newly added tag in it
	save : function(tags) {
		return $http({
			method: 'POST',
			url: '/api/tags' + '?api_token='+api_token,
			data: {tags: tags}
		})
	},



//get and set the stored tags so they can be accessed by another controller
	getTags : function() {
		return tags;
	},
	setTags: function(value) {
		tags = value;
	},



//get and set the tagfilter id and type so they can be accessed by another controller
	getTagfilter_id : function() {
		return tagfilter_id;
	},
	setTagfilter_id: function(value) {
		tagfilter_id.data = value;
	},

	getTagfilter_type : function() {
		return tagfilter_type;
	},
	setTagfilter_type: function(value) {
		tagfilter_type.data = value;
	},



	//split the quote tags_id into an array
	tags_split : function(tags_id) {
		var tags_id = tags_id;
	
		var tagfilter_array = angular.fromJson(tags_id);

		//assign 'None' if it has no value currently
		if(!tagfilter_array[0]){
			tagfilter_array[0] = 0;
		}
		if(!tagfilter_array[1]){
			tagfilter_array[1] = 0;
		}

		return tagfilter_array;
	}



 }//end of return


});		//end of Tags Service