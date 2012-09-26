/**
 * module Angular de gestion des notes
 */
angular.module('project', ['notes']).
    config(function($routeProvider) {
        $routeProvider.
            when('/', {controller:ListCtrl, templateUrl:'view/list.html'}).
            when('/edit/:noteId', {controller:EditCtrl, templateUrl:'detail.html'}).
            when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
            otherwise({redirectTo:'/'});
    });


function ListCtrl($scope, Note) {
    $scope.notes = Note.query();
}


function CreateCtrl($scope, $location, Note) {
    $scope.save = function() {
        Project.save($scope.project, function(project) {
            $location.path('/edit/' + project._id.$oid);
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
            return Note.update({id: this._id.$oid},
                angular.extend({}, this, {_id:undefined}), cb);
        };

        Note.prototype.destroy = function(cb) {
            return Note.remove({id: this._id.$oid}, cb);
        };

        return Note;
    });

