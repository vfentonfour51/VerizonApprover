four51.app.directive('orderhistorydetails', function() {
	var obj = {
		restrict: 'E',
		templateUrl: 'partials/reporting/orderHistoryDetailsView.html'
	};
	return obj;
});

four51.app.directive('orderhistorysummary', function() {
	var obj = {
		restrict: 'E',
		templateUrl: 'partials/reporting/orderHistorySummaryView.html'
	};
	return obj;
});

four51.app.directive('lineitemhistorygrid', function() {
	var obj = {
		restrict: 'E',
		templateUrl: 'partials/reporting/lineItemHistoryGridView.html'
	};
	return obj;
});

four51.app.directive('lineitemreport', function() {
	var obj = {
		restrict: 'E',
		templateUrl: 'partials/reporting/lineItemReport.html',
		controller: ['$scope', function($scope) {
			$scope.open = function(cal, event) {
				event.preventDefault();
				event.stopPropagation();
				$scope[cal] = true;
			};
		}]
	};
	return obj;
});
