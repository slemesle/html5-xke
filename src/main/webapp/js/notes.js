/**
 * module Angular de gestion des notes
 */
var project = angular.module('project', ['notes', 'ping', 'online']).
    config(function($routeProvider) {
        $routeProvider.
            when('/', {controller:ListCtrl, templateUrl:'view/list.html'}).
            when('/edit/:noteId', {controller:EditCtrl, templateUrl:'view/detail.html'}).
            when('/new', {controller:CreateCtrl, templateUrl:'view/detail.html'}).
            when('/search/:searchKey', {controller:SearchCtrl, templateUrl:'view/list.html'}).
            otherwise({redirectTo:'/'});
    });


function ListCtrl($rootScope, $scope, $location, Note, worker) {
    $scope.notes = Note.query(function(){}, function(response, getResponseHeaders){
    });

    // Respond to click event
    $scope.click = function(index){
        $location.path('/edit/'+index);
    };

}

function SearchFormCtrl($scope, $location) {
    $scope.searchNotes = function(search){
        if (this.search.length>2){
            $location.path('/search/'+this.search);
        }
    };
    $scope.forceSearchNotes = function(search){
            $location.path('/search/'+this.search);
    };
}

function SearchCtrl($scope, $routeParams, Note, worker) {

    $scope.notes = Note.search({searchKey: $routeParams.searchKey}, function(response, getResponseHeaders){
        worker.postMessage("start");
    });
    $('search').blur();
}


function CreateCtrl($scope, $location, Note, worker) {

    $scope.save = function() {
        Note.save($scope.note, function(note) {
            $location.path('/')
        },function(response, getResponseHeaders){
            worker.postMessage("start");
        });
    }
}

function PingCtrl ($scope, $location, worker, onlineStatus){

   // TODO onMessage from worker put new status in scope.ping data is in e.json
   // Also add scope.ping.class to reflect error/success alert :).
   worker.onMessage(function(e){

   });


   $scope.ping = {'status': 'offline', 'online': false, class:'error'};

//   TODO start worker using postMessage
}

function EditCtrl($scope, $location, $routeParams, Note) {
    var self = this;
    $scope.search ="";

    Note.get({id: $routeParams.noteId}, function(note) {
        self.original = note;
        $scope.note = new Note(self.original);
    }, function(response, getResponseHeaders){

    });

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.note);
    }

    $scope.destroy = function() {
        self.original.destroy(function() {
            $location.path('/list');
        }, function(response, getResponseHeaders){
            $location.path('/list');
        });
    };

    $scope.save = function() {
        $scope.note.update(function() {
            $location.path('/');
        },function(response, getResponseHeaders){

        });
    };
};

// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('notes', ['ngResource']).
    factory('Note', function($resource) {
        var Note = $resource('/notes/:id',{},
            {
                update: {method: 'PUT'}
            }
        );

        Note.prototype.update = function(cb) {
            return Note.update({id: this.id},
                angular.extend({}, this, {id:undefined}), cb);
        };

        Note.prototype.destroy = function(cb) {
            return Note.remove({id: this.id}, cb);
        };

        searchNote = $resource('/notes/search/:searchKey',{},{
            get: {method: 'GET', isArray:true}
        });
        Note.search = searchNote.get.bind(searchNote);
        return Note;
    });

angular.module('ping', []).factory('worker', function ($rootScope){
// Ping Worker setting
    var worker = new Worker('/js/ping.js');
    return {
        error: function(callback){
            worker.addEventListener('error', function(){
                var args = arguments;
                $rootScope.$apply(function(){
                        callback.apply(worker, args);
                });
            },false);
        },
        onMessage: function (callback) {
            worker.addEventListener('message', function() {
                var args = arguments;
                if (args.length == 1){
                    args[0].json = jQuery.parseJSON(args[0].data);
                }
                $rootScope.$apply(function(){
                    callback.apply(worker, args);
                });
            }, false);
        },
        postMessage: function (data) {
            worker.postMessage(data);
        }
    };

});

angular.module('online', []).factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {


    var onlineStatus = {
        onOnline: function(callback){
            window.addEventListener('online', function () {
                var args = arguments;
                $rootScope.$apply(function(){
                    callback.apply(window, args);
                }, true);
            });
        },
        onOffline: function(callback){
            window.addEventListener('offline', function() {
                var args = arguments;
                $rootScope.$apply(function(){
                    callback.apply(window, args);
                });
            }, true);
        }
    };
    return onlineStatus;
}]);


// This is solution branche



