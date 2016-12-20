(function (factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define("BS.util", ["jquery"], function () {
            return factory(jQuery || $)
        })
    } else {
        factory(jQuery || $);
    }

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(jQuery || $)
    }


}(function ($, undefined) {
    "use strict";

    window['$'] = $ || {};
    var b$ = {};
    if (window.BS) {
        if (window.BS.b$) {
            b$ = window.BS.b$;
        }
    }

    //-----------------------------------------------------------------------------------------------------------------
    $(document).ready(function () {
        var $iap = window["APP_IAP"];
        $iap.init([
            b$.App.getAppId() + ".plugin.DateTime.Format"
        ]);
    });

    return $;
}));