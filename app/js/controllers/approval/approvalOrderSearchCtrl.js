four51.app.controller('ApprovalOrderSearchCtrl', ['$scope', '$location', 'OrderSearchCriteria', 'OrderSearch', 'Order', 'Address',
    function ($scope,  $location, OrderSearchCriteria, OrderSearch, Order, Address) {
        $scope.viewToggle = true;
        $scope.changeStep = function(){
            $scope.viewToggle = !$scope.viewToggle;
        }

        OrderSearchCriteria.query(function(data) {
            $scope.OrderSearchCriteria = data;
            $scope.hasStandardTypes = _hasType(data, 'Standard');
            $scope.hasReplenishmentTypes = _hasType(data, 'Replenishment');
            $scope.hasPriceRequestTypes = _hasType(data, 'PriceRequest');
        });

        function _hasType(data, type) {
            var hasType = false;
            angular.forEach(data, function(o) {
                if (hasType || o.Type == type && o.Count > 0)
                    hasType = true;
            });
            return hasType;
        }

        $scope.OrderSearch = function($event, criteria) {
            $event.preventDefault();
            $scope.showNoResults = false;
            OrderSearch.search(criteria, function(list) {
                $scope.orders = list;
                $scope.showNoResults = list.length == 0;
            });
            $scope.orderSearchStat = criteria;
        };

        OrderSearch.search({Status:"AwaitingApproval"}, function(list) {
            $scope.orderLoadingIndicator = true;
            $scope.orders = list;
            $scope.showNoResults = list.length == 0;
            $scope.orderLoadingIndicator = false;
        });

        $scope.approveOrder = function(order) {
            $scope.orderLoadingIndicator = true;
            order.Approve = true;
            Order.submit(order,
                function(data) {
                    $scope.order = data;
                    order.ApprovalStatus = 'Approved';
                    OrderSearch.search({Status:"AwaitingApproval"}, function(list) {
                        $scope.orderLoadingIndicator = true;
                        $scope.orders = list;
                        $scope.showNoResults = list.length == 0;
                        $scope.orderLoadingIndicator = false;
                    });
                },
                function(ex) {
                    $scope.error = ex.Detail;
                    $scope.orderLoadingIndicator = false;
                }
            );
        };

        $scope.declineOrder = function(order) {
            $scope.orderLoadingIndicator = true;
            order.Decline = true;
            Order.submit(order, function(data) {
                $scope.order = data;
                order.ApprovalStatus = 'Declined';
                OrderSearch.search({Status:"AwaitingApproval"}, function(list) {
                    $scope.orderLoadingIndicator = true;
                    $scope.orders = list;
                    $scope.showNoResults = list.length == 0;
                    $scope.orderLoadingIndicator = false;
                });
            });
        };

        $scope.viewOrder = function(order) {
            if($(window).width() <= 767){
                $location.path('/orders/' + order.ID);
            } else {
                $scope.orderLoadingIndicator = true;
                Order.get(order.ID, function(ordr) {
                    $scope.selectedOrder = ordr;
                    $scope.orderLoadingIndicator = false;
                    if ($scope.selectedOrder.LineItems.length == 1) {
                        Address.get($scope.selectedOrder.LineItems[0].ShipAddressID, function(add) {
                            $scope.selectedOrder.ShipAddress = add;
                        });
                    }
                    else {
                        angular.forEach($scope.selectedOrder.LineItems, function(item) {
                            if (item.ShipAddressID) {
                                Address.get(item.ShipAddressID, function(add) {
                                    item.ShipAddress = add;
                                });
                            }
                        });
                    }
                    Address.get($scope.selectedOrder.BillAddressID, function(add){
                        $scope.selectedOrder.BillAddress = add;
                    });
                });
            }
        };

        $scope.isPhone = function(){
            var isPhoneResult = true;
            if($(window).width() > 767)
                isPhoneResult = false;
            return isPhoneResult;
        };

        $scope.isDesktop = function(){
            var isDesktopResult = false;
            if($(window).width()>=1200)
                isDesktopResult = true;
            return isDesktopResult;
        };
    }]);