/**
 * Created with IntelliJ IDEA.
 * User: slm
 * Date: 30/09/12
 * Time: 22:36
 * To change this template use File | Settings | File Templates.
 */

importScripts('../lib/jquery.hive.pollen.js');


var online = false;
var interval = 30000;
var timeout= undefined;

self.addEventListener('message', function (event) {

    if(event.data == 'start'){
        if (timeout != undefined){
            clearTimeout(timeout);
        }
        timeout = setTimeout(ping, 1);
    }else {
        clearTimeout(timeout);
    }
}, false);

function ping (){
    $.ajax.get({
        url: '/ping.html',
        success: function(result){
            if (!online){
                online = true;
                self.postMessage( JSON.stringify({'status': 'online', 'online': true}));
            }
            resetTimeout(interval);
        },
        error: function(result){
            if (online){
                online = false;
                self.postMessage($.decode({'status': 'offline', 'online': false}));
            }
            resetTimeout(interval);
        }
    });
}

function resetTimeout(_interval){
    timeout = setTimeout(ping, _interval);
}



