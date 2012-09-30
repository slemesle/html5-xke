/**
 * module Angular de gestion des notes
 */
angular.module('project', ['notes']).
    config(function($routeProvider) {
        $routeProvider.
            when('/', {controller:ListCtrl, templateUrl:'view/list.html'}).
            when('/edit/:noteId', {controller:EditCtrl, templateUrl:'view/detail.html'}).
            when('/new', {controller:CreateCtrl, templateUrl:'view/detail.html'}).
            when('/search/:searchKey', {controller:SearchCtrl, templateUrl:'view/list.html'}).
            otherwise({redirectTo:'/'});
    });


function ListCtrl($scope, Note) {
    $scope.notes = Note.query();
    $scope.search ="";

}

function SearchFormCtrl($scope, $location) {
    $scope.search ="";
    $scope.submit = function(){
        $location.path('/search/'+this.search);
    }
}

function SearchCtrl($scope, $routeParams, Note) {
    $scope.notes = Note.search({searchKey: $routeParams.searchKey});
    $('search').blur();
}


function CreateCtrl($scope, $location, Note) {
    $scope.save = function() {
        Note.save($scope.note, function(note) {
            $location.path('/')
        });
    }
}


function EditCtrl($scope, $location, $routeParams, Note) {
    var self = this;

    Note.get({id: $routeParams.noteId}, function(note) {
        self.original = note;
        $scope.note = new Note(self.original);
    });

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.note);
    }

    $scope.destroy = function() {
        self.original.destroy(function() {
            $location.path('/list');
        });
    };

    $scope.save = function() {
        $scope.note.update(function() {
            $location.path('/');
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


// Ping Worker setting
var worker = new Worker('/js/ping.js');
worker.addEventListener('error', function(e){
    throw new Error(e.message + " (" + e.filename + ":" + e.lineno + ")");
},false);
worker.addEventListener('message', function(e) {
    var result = jQuery.parseJSON(e.data);
    if (result.online){
        $('#offline-badge').removeClass('badge-error').addClass('badge-success').html('You\'re working online !');
    }else {
        $('#offline-badge').removeClass('badge-success').addClass('badge-important').html('You\'re working offline !');
    }
}, false);

worker.postMessage('start'); // Start the worker

