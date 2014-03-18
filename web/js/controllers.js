/**
 * Created by kriberg on 13.03.14.
 */

var marginListControllers = angular.module('marginListControllers', []);

marginListControllers.controller('MarginListCtrl', ['$scope', '$q', 'market', function($scope, $q, market) {
    $scope.data_loaded = false;
    $scope.loading_status = ['Downloading SDE...'];
    $scope.market = market;

    $scope.currentPage = 0;
    $scope.pageSizes = [
        {name: '50', size: 50},
        {name: '100', size: 100},
        {name: '200', size: 200},
        {name: 'All', size: 9999999}];
    $scope.pageSize = $scope.pageSizes[0];
    $scope.numberOfPages = function() {
        return Math.ceil($scope.items.length/$scope.pageSize.size);
    };
    $scope.sort = {
        column: '',
        descending: true
    };
    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if(sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = true;
        }

    };
    $scope.changeSorting('margin');
    $scope.market.getEveData().then(function(systems) {
        $scope.loading_status.push('Loading systems...');
        var jobs = [];
        angular.forEach(systems, function(system) {
            $scope.loading_status.push('Loading ' + system.solarsystemname + '...');
            jobs.push(market.refreshMarketData(system.solarsystemid));
        });
        $q.all(jobs).then(function(results) {
            $scope.data_loaded = true;
            $scope.items = market.items;
        });
    });
}]);