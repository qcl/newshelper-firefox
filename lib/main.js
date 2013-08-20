var pageMod = require("sdk/page-mod");
var Request = require("sdk/request").Request;
var notifications = require("sdk/notifications");
var tabs = require("sdk/tabs"); 
var self = require("sdk/self");

pageMod.PageMod({
    include: ["*.facebook.com"],
    contentScriptFile: [self.data.url("jquery-2.0.3.min.js"),self.data.url("script.js")],
    contentStyleFile: self.data.url("content_style.css"),
    contentScriptWhen: "ready",
    onAttach: function(worker){
        
        //update
        worker.port.on("query_data",function(url){
            Request({
                url:url,
                onComplete:function(response){
                    worker.port.emit("get_data",response.json);
                }
            }).get();
        });

        //notifications
        worker.port.on("notify",function(request){
            notifications.notify({
                title:request.title,
                text:request.body,
                iconURL:self.data.url("newshelper48x48.png"),
                data:request.link,
                onClick:function(url){
                    tabs.open(url);
                }
            });
        });
    }
});

