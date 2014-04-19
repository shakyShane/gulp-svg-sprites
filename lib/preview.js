"use strict";

var utils    = require("./utils");
var fs       = require("fs");

/**
 * @type {{cssElement: string, cssSprite: string, cssSpriteImage: string}}
 */
module.exports.templates = {
    iconBox: fs.readFileSync(__dirname + "/../tmpl/icon-box.html", "utf-8"),
    defBox:  fs.readFileSync(__dirname + "/../tmpl/icon-box-defs.html", "utf-8"),
    defHtml: fs.readFileSync(__dirname + "/../tmpl/preview-defs.html", "utf-8"),
    html:    fs.readFileSync(__dirname + "/../tmpl/preview.html", "utf-8"),
    css:     fs.readFileSync(__dirname + "/../tmpl/styles.css", "utf-8")
};
/**
 * @param {Array} elements
 * @param {Object} config
 * @returns {{svgSprite: {content: String}}}
 */
module.exports.render = function (elements, svg, config) {

    var len             = elements.length;
    var iconTemplate    = config.defs ? exports.templates.defBox  : exports.templates.iconBox;
    var previewTemplate = config.defs ? exports.templates.defHtml : exports.templates.html;

    var boxes = elements.map(function (element) {
        return utils.substitute(iconTemplate, {
            name: element.className,
            id: element.id,
            height: element.height,
            width: element.width,
            classes: ["icon", element.name].join(" ")
        });
    });

    return {
        svgSprite: {
            content: utils.substitute(previewTemplate, {
                iconBoxes: boxes.join("\n"),
                iconCount: len,
                cssFile: config.cssFile,
                svgFile: config.defs ? config.svg.defs : config.svg.sprite,
                svg: svg,
                css: exports.templates.css
            })
        }
    };
};