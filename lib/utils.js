var path = require("path");

module.exports = {
    /**
     * @returns {string}
     */
    joinName: function () {
        var args = [].slice.call(arguments);
        return args.filter(function (arg) {
            return !!arg;
        }).join("-");
    },
    /**
     * @param num
     * @param unit
     * @returns {number}
     */
    roundUpToUnit: function (num, unit) {
        var dif = num % unit;
        return (dif) ? num + unit - dif : num;
    },
    /**
     * @param string
     * @param object
     * @returns {XML|string|void|*}
     */
    substitute: function (string, object) {
        return string.replace(/\{([a-zA-Z}]+)\}/g, function (match, token) {
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

        if (string.indexOf("{size}") > -1) {
            string = this.substitute(string, {size: suffix || ""});
        } else {
            if (suffix) {
                string += "-" + suffix;
            }
        }

        if (string[0] != "." && string.indexOf(prefix) != 0) {
            string = prefix + "-" + string;
        }

        var classname = ((string[0] != ".") ? "." : "") + string;
        return this.cleanClassName(classname);
    },
    /**
     * @param value
     * @returns {number}
     */
    scaleValue: function (value) {
        return Math.ceil(value);
    },
    /**
     * @param filePath
     * @returns {XML|string|void|*}
     */
    swapFileName: function (filePath) {

        var svgfile = path.basename(filePath);
        var pngfile = svgfile.replace(/svg/g, "png");

        return filePath.replace(svgfile, pngfile);
    }
};