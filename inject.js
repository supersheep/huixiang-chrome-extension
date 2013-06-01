function inject(src,cb){
    inject.injected = inject.injected || {};
    if(inject.injected[src]){return cb;}
    var script = document.createElement("script");
    script.src = chrome.extension.getURL(src+".js");

    script.onload = cb || function(){};
    document.head.appendChild(script);
}

(function(){
    // if(location.host.match("weibo.com")){
    inject("weibo");
    // }

    inject("select-detection");

})();