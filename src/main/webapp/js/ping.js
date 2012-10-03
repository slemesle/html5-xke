/**
 * Worker postMessage when line state changes :
 * {'status': 'offline', 'online': false}
 */

importScripts('/js/jquery.hive.pollen.js');



var online = false;
var interval = 30000;
var timeout= undefined;

self.addEventListener('message', function (event) {

    if(event.data == 'start'){
     // TODO Start Timeout
    }
}, false);

function ping (){
    $.ajax.get({
        url: '/ping.html',
        success: function(result){
           //TODO  Post online self.postMessage(...)
           // Don't forget to stringify code
           resetTimeout(interval);
        },
        error: function(result){
            // TODO post offline message
            resetTimeout(interval);
        }
    });
}

function resetTimeout(_interval){
 //TODO Reset the timeout timeout = setTimeout(...)
}



