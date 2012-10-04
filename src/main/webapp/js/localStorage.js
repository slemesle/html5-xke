/**
 * Created with IntelliJ IDEA.
 * User: slm
 * Date: 04/10/12
 * Time: 00:43
 * To change this template use File | Settings | File Templates.
 */
var angularLocalStorageModule = angular.module('localStorage', []);

angularLocalStorageModule.factory('localStorage', function() {

    return {

        isLocalStorageAvailable: function () {
            try {
                return ('localStorage' in window && window['localStorage'] !== null);
            } catch (e) {
                return false;
            }
        },

        put: function (key, value) {
            if (!this.isLocalStorageAvailable()) {
                alert('Local storage not available');
                return false;
            }

            localStorage[key] = value
        },

        get: function (key) {
            if (!this.isLocalStorageAvailable()) {
                alert('Local storage not available');
                return false;
            }

            return localStorage[key];
        },

        listAll: function () {
            var result;
            for (var i in localStorage) {
                result[i]=localStorage[i];
            }
            return result;
        },

        remove: function (key) {
            return localStorage.removeItem(key);
        },

        clearAll: function () {
            for (var i in localStorage) {
                this.remove(i);
            }
        }
    }
});