"use strict";

var utils    = require("./utils");
var fs       = require("fs");

/**
 * @type {{cssElement: string, cssSprite: string, cssSpriteImage: string}}
 */
module.exports.templates = {
    /* jshint ignore:start */
    iconBox: fs.readFileSync(__dirname + "/../tmpl/icon-box.html", "utf-8"),
    html:    fs.readFileSync(__dirname + "/../tmpl/preview.html", "utf-8")
    /* jshint ignore:end */
};

/**
 * @param {Array} elements
 * @param {Object} config
 * @returns {{svgSprite: {content: String}}}
 */
module.exports.render = function (elements, config) {

    var len = elements.length;

    var boxes = elements.map(function (element) {
        return utils.substitute(exports.templates.iconBox, {
            name: element.className,
            classes: ["icon", element.name].join(" ")
        });
    });

    return {
        svgSprite: {
            content: utils.substitute(exports.templates.html, {
                iconBoxes: boxes.join("\n"),
                iconCount: len,
                cssFile: config.cssFile
            })
        }
    };
};