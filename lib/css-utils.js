"use strict";

/**
 * @param sprite
 * @param config
 * @returns {string}
 */
module.exports = {
    /**
     * @param string
     * @param object
     * @returns {XML|string|void|*}
     */
    substitute: function (string, object) {
        return string.replace(/\{:([a-zA-Z}]+):\}/g, function (match, token) {
            return (token in object) ? object[token] : match;
        });
    },
    /**
     * @param className
     * @returns {*}
     */
    cleanClassName: function (className) {
        if (typeof className === "string") {
            if (className.match(/^\.\d/)) {
                return className.replace(/^\.(\d)/, "._$1");
            }
        }
        return className;
    },
    /**
     * @param string
     * @param prefix
     * @param [suffix]
     * @returns {string}
     */
    makeClassName: function (string, prefix, suffix) {

        if (suffix) {
            string += "-" + suffix;
        }

        if (string[0] !== "." && string.indexOf(prefix) !== 0) {
            string = prefix + "-" + string;
        }

        var classname = ((string[0] !== ".") ? "." : "") + string;

        return this.cleanClassName(classname);
    }
};