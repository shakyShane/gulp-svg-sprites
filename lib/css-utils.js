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
            if (!className.match(/^\./)) {
                return this.cleanClassName("." + className);
            }
        }
        return className;
    },
    /**
     * @param {String|Function} template
     * @param {String} name
     * @param {Object} [config]
     * @returns {string}
     */
    makeClassName: function (template, name, config) {

        var className = "";

        if (typeof template === "string") {
            className = template.replace("%f", name);
        }

        if (typeof template === "function") {
            className = template(name, config);
        }

        return this.cleanClassName(className);
    },
    /**
     * @param {String|Function} template
     * @param {String} file
     * @param {Object} [config]
     */
    makePath: function (template, file, config) {

        var path = "";

        if (typeof template === "string") {
            path = template.replace("%f", file);
        }

        if (typeof template === "function") {
            path = template(file, config);
        }

        return path;
    }
};