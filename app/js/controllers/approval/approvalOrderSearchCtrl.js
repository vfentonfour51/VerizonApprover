four51.app.controller('ApprovalOrderSearchCtrl', ['$scope', '$location', 'OrderSearchCriteria', 'OrderSearch', 'Order', 'Address',
    function ($scope,  $location, OrderSearchCriteria, OrderSearch, Order, Address) {
        $scope.settings = {
            pageSize: 100,
            currentPage: 1
        };

        $scope.changeStep = function(){
            if(!$scope.viewToggle && !$scope.isDesktop()){
                $scope.selectedOrder = null;
            }
            $scope.viewToggle = !$scope.viewToggle;
            window.scrollTo(0, 0);
            $scope.$broadcast('event:changeStep');
        };

        $scope.sortOptions = [
            {"Label":"Order ID","Value":"ExternalID"},
            {"Label":"Date Created","Value":"DateCreated"},
            {"Label":"Creator","Value":"FromUserName"}
        ];

        $scope.reverse = false;

        function getOrdersAwaitingApproval() {
            var criteria = {Type: "Standard", Status: "AwaitingApproval", DisplayName: "Awaiting Approval", LastN: 0, OrderID: null};
            $scope.orderLoadingIndicator = true;
            OrderSearch.search(criteria, function(list, count) {
                $scope.orderLoadingIndicator = true;
                $scope.orders = list;
                $scope.settings.listCount = count;
                $scope.showNoResults = list.length == 0;
                $scope.orderLoadingIndicator = false;
            }, $scope.settings.currentPage, $scope.settings.pageSize);
        }

        getOrdersAwaitingApproval();

        $scope.$watch('settings.currentPage', function() {
            getOrdersAwaitingApproval($scope.settings.currentPage);
        });

        $scope.approveOrder = function(order) {
            $scope.orderLoadingIndicator = true;
            order.Approve = true;
            Order.submit(order,
                function(data) {
                    $scope.order = data;
                    order.ApprovalStatus = 'Approved';
                    $scope.settings.currentPage = 1;
                    getOrdersAwaitingApproval($scope.settings.currentPage);
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
                $scope.settings.currentPage = 1;
                getOrdersAwaitingApproval($scope.settings.currentPage);
            });
        };

        $scope.viewOrder = function(order) {
            $scope.orderLoadingIndicator = true;
            Order.get(order.ID, function(ordr) {
                $scope.selectedOrder = ordr;
                $scope.orderLoadingIndicator = false;
                Address.get($scope.selectedOrder.LineItems[0].ShipAddressID, function(add) {
                    $scope.selectedOrder.ShipAddress = add;
                });
                Address.get($scope.selectedOrder.BillAddressID, function(add){
                    $scope.selectedOrder.BillAddress = add;
                });
            });

        };

        $scope.$on('event:approvalComplete', function() {
            $scope.selectedOrder = null;
            $scope.settings.currentPage = 1;
            getOrdersAwaitingApproval($scope.settings.currentPage);
        });

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