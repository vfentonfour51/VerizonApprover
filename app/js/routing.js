four51.app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	var concatProductView = function(routeParams){
			return 'productview.hcf?id='+ routeParams.productInteropID;
	}

	var concatSpecFormView = function(routeParams){
		return 'specform.hcf?id=' + routeParams.productInteropID;
	}

	$routeProvider.
        when('/admin', { templateUrl: 'partials/userView.html', controller: 'UserEditCtrl' }).
		when('/login', { templateUrl: 'partials/controls/login.html', controller: 'LoginCtrl' }).
        when('/security', { templateUrl: 'partials/security.html', controller: 'SecurityCtrl' }).
        when('/conditions', { templateUrl: 'partials/conditions.html', controller: 'ConditionsCtrl' }).
		when('/contactus/', { templateUrl: 'partials/Messages/contactus.html' }).
        when('/orders', { templateUrl: 'partials/approval/approvalView.html', controller: 'ApprovalOrderSearchCtrl' }).
		otherwise({redirectTo: '/orders'});
}]);