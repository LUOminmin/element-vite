window["htframe"] = {
};
htframe.methods = null;
htframe.addSafeMethods = (methods) => {
    if (!htframe.methods) {
        htframe.methods = {};
    }
    if (methods.length && methods.push) {
        for (let i = 0, len = methods.length; i < len; i++) {
            htframe.methods[methods[i].toString()] = true;
        }
    } else {
        htframe.methods[methods.toString()] = true;
    }
}

htframe.load = () => {
    window.addEventListener("message", (ev) => {
        let data = ev.data;
        let method = data.method;
        let ps = data.ps;
        for (let i = 0, len = ps.length; i < len; i++) {
            let p = ps[i];
            if (p.indexOf && p.split) {
                if (p.indexOf("_") > -1) {
                    let p2 = p.split("_");
                    if (p2[0] == "$callback") {
                        let pi = p2[1];
                        ps[i] = function () {
                            let ps1 = [];
                            for (let j = 0, jlen = arguments.length; j < jlen; j++) {
                                ps1.push(arguments[j]);
                            }
                            htframe.callParent("setFrameCallbak", pi, ps1);
                        };
                    }
                }
            }
        }
        if (!htframe.methods || htframe.methods[method]) {
            let m = eval(method);
            if (m) {
                if (m.apply) {
                    let val = m.apply(this, ps);
                    htframe.callParent("setFrameVal", method, val);
                } else {
                    val = m;
                    htframe.callParent("setFrameVal", method, val);
                }
            }
        }
    });
}

htframe.callParent = function () {
    try {
        let method = arguments[0];
        let ps = [];
        for (let i = 1, len = arguments.length; i < len; i++) {
            ps.push(arguments[i]);
        }
        //if (window.parent && window.parent != window) {
        if (window.opener && window.opener != window) {
            window.opener.postMessage(
                { method: method, ps: ps },
                "*"
            );
        }
    } catch (ex) {
        console.error(ex);
    }
}

htframe.registerMethod = function (key, func) {
    if (!htframe._registerMethods) {
        htframe._registerMethods = {}
    }
    if (!htframe._registerMethods[key]) {
        htframe._registerMethods[key] = [];
    }
    htframe._registerMethods[key].push(func);
}

htframe.callMethod = function () {
    let method = arguments[0];
    let ps = [];
    for (let i = 1, len = arguments.length; i < len; i++) {
        ps.push(arguments[i]);
    }
    if (htframe._registerMethods && htframe._registerMethods[method]) {
        let ms = htframe._registerMethods[method];
        for (let i = 0, len = ms.length; i < len; i++) {
            ms[i].apply(window, ps);
        }
    }
}

htframe.htframeLoaded = function () {
    return true;
}

window.addEventListener("load", () => {
    htframe.load();
    setTimeout(() => {
        htframe.callParent("htframeLoaded");
    }, 5000)
    htframe.addSafeMethods(["browser", "analysis", "video", "statistic", "splitView", "rollBlind"]);
});
