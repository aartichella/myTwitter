angular.module('twitter')
.controller('twitterfeed',['$scope','$http','$window', function($scope,$http,$window){
	
	$scope.user_tweet = '';
	$scope.tweetList = [];
	$scope.searchfeed = [];
	$scope.username = 'user';
	$scope.sendtweet = function(){
		var data = {
				tweetinfo : $scope.user_tweet
		}
		$http.post('/sendtweet',data).success(function(data,status){
			console.log(status);
			//retrieve tweets to display
			
		}).then(function(){
			$scope.retrieveTweets();
		})
	}
	$scope.retrieveTweets = function(){
		var user = '';
		$http.get('/getFollowingTweets').success(function(data,status){
			
			$scope.tweetList = data;
			
			console.log(data[0].fullname)
			console.log(data);
		});
	}
	
	$scope.whoToFollow = function(){
		$http.get('/whotofollow').success(function(data,status){
			$scope.whotofollow = data;
			//$scope.user = data[0].followerTwitterHandle.replace('@','');
			console.log(data);
		});
	}
	
	$scope.getuser = function(){
		$http.get('/getuser').success(function(data){
			console.log('--user data--')
			console.log(data)
			$scope.username = data;
		})
	}
	
	$scope.searchtweet = function(searchword){
		var data = {
				'searchword' : searchword
		};
		$http.post('/searchtweet',data).success(function(data,status){
			$scope.searchfeed = data.data;
			//$location.path(data.redirect);
		//	$window.location.href = '/'+data.redirect;
		})
	}
	
	$scope.searchwatch = function(){
		var textlength = $scope.searchtext.length;
		console.log('watching');
		if(textlength == 0)
			$scope.searchform.$setPristine();
	}
$scope.buttonText = "Follow"
	$scope.follow_handle = function(obj,$event){
	var currentText = angular.element($event.target).text();
	currentText = currentText == 'Follow'? 'Following!' : 'Follow';
	angular.element($event.target).text(currentText);
	
	$scope.followdb($event);
	}

$scope.followdb = function(selection){
	var tofollow = angular.element(selection.target).attr('data-followthis');
	var data = {
			'tweeter_handle' : tofollow
	}
	$http.post('/followpeople',data).success(function(data){
		console.log(data)
	}).then(function(){
		$http.get('/getFollowingTweets').success(function(data){
			console.log('getting new follow tweets');
			$scope.tweetList = data;
		})
	});
}

$scope.retweet = function(selection){
	var owner = angular.element(selection.target).attr('data-owner');
	
	var text =  angular.element(selection.target).attr('data-text');
	var data = {
			'owner': owner,
			'text':text
	}
	console.log(data)
	$http.post('/retweet',data).success(function(data){
		console.log(data);
	}).then(function(){
		$scope.retrieveTweets();
	})
}


	//on init call this function
	$scope.retrieveTweets();
	$scope.whoToFollow();
	$scope.getuser();
	
}]);
