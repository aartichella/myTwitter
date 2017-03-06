angular.module('twitter')
.controller('followingCtrl',function($scope,$http,$location){
	$scope.getfollowing = function(){
		$http.get('/getfollowing').success(function(data){
			$scope.followingList = data;
			console.log(data);
		});
	}
	$scope.getfollowers = function(){
		$http.get('/getfollowers').success(function(data){
			$scope.followersList = data;
			console.log(data);
		});
	}
	
	//change active class in header nav
	function updateNavheader(){
		var current_pathname = window.location.pathname.replace('/','');
		$scope.pathname = current_pathname;
		
		$('.navbar-nav li').removeClass('active');
		if(current_pathname == 'login')
			$('.navbar-nav .home').addClass('active');	
		else
			$('.navbar-nav .'+current_pathname).addClass('active');
	}
	$scope.getfollowers();
	$scope.getfollowing();
	updateNavheader();
});