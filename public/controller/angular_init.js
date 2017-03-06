var app = angular.module('twitter',[]);

app.controller('headlineActivity', function($scope){
	$scope.name = "aarti";
	$scope.header1 = 'Far jeepers jeez densely reasonably stared.';
	$scope.header2 = 'Hello kiwi hey urchin piranha jeez far much well far';
	$scope.header3 = 'That less goodness far resold wiped iguana preparatory  frowned crane.';
	$scope.header4 = 'Alas panther dear away bright excepting  goodness alas.';
});

app.controller('loginCtrl',function($scope,$http,$location){
	$scope.errorLogin = '';
	$scope.loginsubmit = function(){
		console.log('form submitted');
		var twitterhandle = $scope.twitterhandle
		var password = $scope.password;
		
		var data = {
				'twitterhandle':twitterhandle,
				'password':password
		}
		$http.post('/login',data).success(function(data){
			console.log(data);
			if(data.status == 'success')
				window.location = '/'+data.redirect;
			else
				$scope.errorLogin = data.error;
		});
	}
})