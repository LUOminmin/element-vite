//外部调用服务
let ht3D = {};
ht3D.winName = "_blank";
ht3D.load = function () {
    if (!ht3D[ht3D.winName + "loaded"]) {
        ht3D[ht3D.winName + "loaded"] = true;
        window.addEventListener("message", ht3D.onMessage);
    }
}

ht3D.call = function (url, method, ps, ele) {
    if (ps["img"]) {
        ps["method"] = method;
        ht3D.loadmg(url, ps, ele);
    } else if (ps["video"]) {
        ps["method"] = method;
        ht3D.loadVideo(url, ps, ele);
    } else {
        var open3dWin = ht3D[ht3D.winName];
        if (!open3dWin || !open3dWin["window"]) {
            open3dWin = window.open(url, ht3D.winName);
            ht3D[ht3D.winName] = open3dWin;
            ht3D.onLoadObj = {
                method: method,
                ps: ps
            };
        } else {
            ht3D.callU3d(method, ps);
            open3dWin.focus();
        }
    }
}

ht3D.ht3DLoaded = function () {
    if (ht3D.onLoadObj) {
        ht3D.callU3d(ht3D.onLoadObj.method, ht3D.onLoadObj.ps);
        ht3D.onLoadObj = null;
    }
}

ht3D.onMessage = function (ev) {
    let data = ev.data;
    let method = data.method;
    if (method) {
        if (method == "ht3DLoaded") {
            ht3D.ht3DLoaded();
        } else {
            //这个项目不需要回调，所以注释
            // let ps = data.ps;
            // let m = eval("ht3D." + method);
            // if (m) {
            //     m.apply(ht3D, ps);
            // }
        }
    }
}

ht3D.callU3d = function () {
    if (!ht3D._callU3dGetValCallBack) {
        ht3D._callU3dGetValCallBack = {};
        ht3D._callU3dGetValCallBackIndex = 0;
    }
    let method = arguments[0];
    let ps = [];
    for (let i = 1, len = arguments.length; i < len; i++) {
        let a = arguments[i];
        if (a.apply) {
            let id = "$callback_" + ht3D._callU3dGetValCallBackIndex++;
            ht3D._callU3dGetValCallBack[id] = a;
            ps.push(id);
        } else {
            ps.push(a);
        }
    }
    ht3D[ht3D.winName].postMessage(
        { method: method, ps: ps },
        "*"
    );
    return new Promise((resolve, reject) => {
        ht3D._callU3dGetValCallBack[method] = resolve;
    });
}

ht3D.setFrameVal = function (m, val) {
    if (ht3D._callU3dGetValCallBack.hasOwnProperty(m)) {
        let resolve = ht3D._callU3dGetValCallBack[m];
        resolve(val);
        delete ht3D._callU3dGetValCallBack[m];
    }
}

ht3D.setFrameCallbak = function (m, val) {
    m = "$callback_" + m;
    if (ht3D._callU3dGetValCallBack.hasOwnProperty(m)) {
        let resolve = ht3D._callU3dGetValCallBack[m];
        resolve.apply(ht3D, val);
    }
}
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
ht3D.loadJs = function (url, callback) {
    var script = document.createElement("script");
    var fn = callback || function () { };
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
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
    document.getElementsByTagName("head")[0].appendChild(script);
}
ht3D.jsonp = function (url, str, callback) {
    if (callback) {
        var context = "k=" + guidKey;
        url = url + "?" + context;
        if (str) {
            url = url + str;
        }
        ht3D.loadJs(url, callback);
    }
}
ht3D.loadmg = function (url, ps, ele) {
    if (!ele) {
        console.log("img元素为空，请赋值ele参数");
        return;
    }
    url = url.split("#")[0];
    url = url + "/img/room/" + ps["bdcdyh"] + ".jpg";
    ele.src = url;
}

ht3D.loadVideo = function (url, ps, ele) {
    if (!ele) {
        console.log("video元素为空，请赋值ele参数");
        return;
    }
    url = url.split("#")[0];
    if (!ps["fw"]) {
        ps["fw"] = 1;
    }
    if (ps["gn"]) {
        url = url + "/video/" + ps["method"] + "_" + ps["gn"] + "_" + ps["fw"] + ".mp4";
    } else {
        url = url + "/video/" + ps["method"] + "_" + ps["fw"] + ".mp4";
    }
    console.log(url);
}