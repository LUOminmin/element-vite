//让外部调用服务的service
window["htjsonp"] = {
};
htjsonp.loadJs = function (url, callback) {
    var script = document.createElement('script');
    var fn = callback || function () { };
    script.type = 'text/javascript';
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                fn();
            }
        };
    } else {
        script.onload = function () {
            fn();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
htjsonp.jsonp = function (url, str, callback) {
    if (callback) {
        var context = 'k=' + guidKey;
        url = url + '?' + context;
        if (str != null) {
            if (typeof str != "string") {
                for (var fi in str) {
                    if (fi == "Each" || fi == "Text") {
                        continue;
                    }
                    url += "&" + fi + "=" + str[fi];
                }
            } else {
                url = url + str;
            }
        }
        htjsonp.loadJs(url, callback);
    }
}