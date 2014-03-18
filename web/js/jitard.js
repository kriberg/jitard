/**
 * Created by kriberg on 21.02.14.
 */

var jitardApp = angular.module('jitardApp', ['ngRoute', 'marginListControllers', 'marketServices']);

jitardApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/margin_list.html',
                controller: 'MarginListCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);

jitardApp.filter('startFrom', function() {
    return function(input, start) {
        if(!input) return [];
        start = +start;
        return input.slice(start);
    }
});

jitardApp.filter('pertify', function() {
    return function(input) {
        return $.number(parseFloat(input), 2, '.', ',');
    }
});

jitardApp.filter('itemFilter', function() {
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
            } else if(term.indexOf('!') != -1) {
                var parts = term.split('!');
                var subparts = parts[1].split('|')
                var ors = [];
                angular.forEach(subparts, function(subpart) {
                    if(typeof subpart == 'string') ors.push(parts[0] + ".indexOf('" + subpart + "') < 0");
                    else ors.push(parts[0] + "!=" + subpart);
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
