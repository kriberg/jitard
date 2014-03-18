/**
 * Created by kriberg on 13.03.14.
 */

var marketServices = angular.module('marketServices',[]);

marketServices.factory('market', ['$q', '$http', function($q, $http) {
    var market = {
        items: [],
        systems: [],
        types: {},
        groups: {},
        system_map: {},
        getEveData: function () {
            var jobs = {
                'types': $http.get('/stationspinner/types/'),
                'groups': $http.get('/stationspinner/marketgroups/'),
                'systems': $http.get('/stationspinner/marketsystems/')
            };
            var chill = $q.defer();
            $q.all(jobs).then(function (results) {
                angular.forEach(results['types'].data, function (item) {
                    market.types['_' + item.typeid] = item;
                });
                angular.forEach(results['groups'].data, function (group) {
                    market.groups['_' + group.marketgroupid] = group;
                });

                angular.forEach(results['systems'].data, function (system) {
                    market.system_map['_' + system.solarsystemid] = system;
                });
                market.systems = results['systems'].data;
                chill.resolve(market.systems);
            }, function (failure) {
                chill.reject(failure);
            });
            return chill.promise;
        },
        refreshMarketData: function (solarsystemid) {
            var chill = $q.defer();
            $http.get('/stationspinner/marketdata/' + solarsystemid).
                then(function (result) {
                    var marketdata = result.data;
                    angular.forEach(marketdata, function (item) {
                        var itemtype = market.types['_' + item.typeid];
                        if(!itemtype) {
                            console.log('Unknown item: ' + item.typeid);
                        } else {
                            item.name = itemtype.name;
                            item.meta = itemtype.meta;
                            item.category = itemtype.category;
                            item.system = market.system_map['_' + item.locationid].solarsystemname;
                            item.region = market.system_map['_' + item.locationid].regionname;
                            item.groups = market.groups['_' + itemtype.marketgroupid].path;
                            market.items.push(item);
                        }
                    });
                    chill.resolve(solarsystemid);
            }, function(failure) {
                    chill.reject(solarsystemid);
            });
            return chill.promise;
        }
    };

    return market;
}]);