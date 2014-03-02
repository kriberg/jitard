/**
 * Created by kriberg on 21.02.14.
 */

var App = angular.module('Jitard', []);

App.controller('ItemCtrl', function($scope, $http) {
    $http.get('/stationspinner/marketitems/')
        .then(function(res) {
            $scope.items = res.data;
        });
    $scope.currentPage = 0;
    $scope.pageSizes = [
        {name: '50', size: 50},
        {name: '100', size: 100},
        {name: '200', size: 200},
        {name: 'All', size: 9999999}];
    $scope.pageSize = $scope.pageSizes[0];
    $scope.numberOfPages=function() {
        return Math.ceil($scope.items.length/$scope.pageSize.size);
    }

});

App.filter('startFrom', function() {
    return function(input, start) {
        if(!input) return [];
        start = +start;
        return input.slice(start);
    }
});

App.filter('isk', function() {
    return function(input) {
        return $.number(parseFloat(input), 2, '.', ',');
    }
});

App.filter('itemFilter', function() {
    return function(items, filter) {
        if(!filter || filter.length == 0) return items;
        var terms = filter.split(' ');
        var predicate = [];
        angular.forEach(terms, function(term) {
            term = 'item.' + term;
            term = term.replace('=', '==');
            if(term.indexOf('==') != -1) {
                var parts = term.split('==');
                var subparts = parts[1].split('|');
                var ors = [];
                angular.forEach(subparts, function(subpart) {
                    if(typeof subpart == 'string') ors.push(parts[0] + ".indexOf('" + subpart + "') != -1");
                    else ors.push(parts[0] + '==' + subpart);
                });
                predicate.push('(' + ors.join('||') + ')');
            } else {
                predicate.push(term);
            }
        });
        predicate = predicate.join('&&');
        var matches = [];
        angular.forEach(items, function(item) {
            if(eval(predicate)) matches.push(item);
        });
        return matches;
    }
});
