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
    },
    /**
     * @param string
     * @param object
     * @returns {String}
     */
    substitute: function (string, object) {
        return string.replace(/\{:([a-zA-Z}]+):\}/g, function (match, token) {
            return (token in object) ? object[token] : match;
        });
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