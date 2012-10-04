var angularLocalDbModule = angular.module('localDb', []).factory('localDb', [function() {

    var NOTESDB = this.init();

    function init() {
        try {
            if (!this.isLocalDbAvailable()) {
                alert('Local Db not available');
            } else {
                var shortName = 'Notes';
                var version = '1.0';
                var displayName = 'Notes localDb';
                var maxSize = 100000; //  bytes
                var db = openDatabase(shortName, version, displayName, maxSize);
                this.createTable(db)
                return db;
            }
        } catch(e) {
            console.log(e);
        }
        return;
    };

    return {

        isLocalDbAvailable: function () {
            try {
                return window.openDatabase;
            } catch (e) {
                return false;
            }
        },

    createTable :function(db){
        db.transaction(
            function (transaction) {
                transaction.executeSql('CREATE TABLE IF NOT EXISTS notes(id INTEGER NOT NULL PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL);', [], this.nullDataHandler, this.errorHandler);
            }
        );
    },

    save: function(note) {
        NOTESDB.transaction(
            function (transaction) {
                transaction.executeSql("INSERT INTO notes(id, title, content) VALUES (?, ?, ?)", [note.id, note.title, note.content]);
            }
        );
    },

    get: function (id) {
        NOTESDB.transaction(
            function (transaction) {
                transaction.executeSql("SELECT * FROM notes WHERE id='"+id+"';", [],
                    this.dataSelectHandler, this.errorHandler);
            }
        );
    },

    listAll: function () {
        NOTESDB.transaction(
            function (transaction) {
                transaction.executeSql("SELECT * FROM notes;", [],
                    this.dataSelectHandler, this.errorHandler);
            }
        );
    },

    dataSelectHandler : function(transaction, results){
        var result;
        for (var i=0; i<results.rows.length; i++){
            var note= new object();
            var row=results.rows.item(i);
            note.id = row['id'];
            note.title = row['title'];
            note.content = row['content'];

            result[i]=note
        }
        return result;
    },
        remove: function (key) {
            return localStorage.removeItem(key);
        },

        clearAll: function () {
            NOTESDB.transaction(
                function (transaction) {
                    transaction.executeSql("DROP TABLE notes;", [], this.nullDataHandler, this.errorHandler);
                }
            );
        },
        errorHandler: function(transaction, error){
            console.log(error.message+' (Code '+error.code+')');
            return false;
        },
        nullDataHandler: function (){
            console.log("SQL Query Succeeded");
        }
    }
}]);