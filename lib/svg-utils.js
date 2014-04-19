"use strict";

var utils   = require("./utils");
var path    = require("path");
var SVGO    = require("svgo");
var svgo    = new SVGO();

/**
 * @param contents
 * @param file
 * @param tasks
 * @param cb
 */
module.exports.addSvgFile = function (contents, file, tasks, cb) {
    svgo.optimize(contents, function (result) {
        result.data = result.data.replace(/^<svg[^>]+>|<\/svg>$/g, "");
        result.info.width = parseFloat(result.info.width);
        result.info.height = parseFloat(result.info.height);
        tasks[file.path] = result;
        cb(null, file);
    });
};

/**
 * @param spriteName
 * @param tasks
 * @param config
 * @returns {{spriteData: {elements: Array, path: string, sizes: {}}, content: *}}
 */
module.exports.buildSVGSprite = function (spriteName, tasks, config) {

    var suffix = ".svg";

    var spriteData = {
        elements: [],
        path: config.svgFile,
        sizes: {}
    };

    var spriteHeight = 0;
    var elementUnitWidth = 0;
    var elements = [];
    var x = 0;
    var resultsList = [];

    Object.keys(tasks).forEach(function (item) {
        resultsList.push({
            className: path.basename(item, suffix),
            filename: item,
            svg: tasks[item]
        });
    });

    resultsList.sort(function (a, b) {
        if (a.className > b.className) {
            return 1;
        }
        if (a.className < b.className) {
            return -1;
        }
        return 0;
    });

    resultsList.forEach(function (result, i) {
        var svg = result.svg;
        var className = result.className;
        svg.filename = result.className;

        elementUnitWidth = utils.roundUpToUnit(svg.info.width, config.unit);

        if (spriteHeight < svg.info.height) {
            spriteHeight = svg.info.height;
        }

        spriteData.elements.push({
            className: className,
            width: Math.ceil(svg.info.width),
            height: Math.ceil(svg.info.height),
            x: x
        });

        elements.push(exports.transform(svg, x, 0, config));

        x += elementUnitWidth + config.unit;

    });

    x = utils.roundUpToUnit(x);
    spriteHeight = utils.roundUpToUnit(spriteHeight);
    spriteData.width = x;
    spriteData.height = spriteHeight;


    return {
        spriteData: spriteData,
        content: exports.wrap(x, spriteHeight, elements, config)
    };
};

/**
 * @param {{id: string, x: number, y: number}} obj
 * @returns {string}
 */
/* jshint ignore:start */
exports.createAttributes = function (obj, opts) {

    var attrs = {
        id: 'id="%s"'.replace("%s", obj.id),
        transform: 'transform="translate(%d1,%d2)"'.replace("%d1", obj.x).replace("%d2", obj.y)
    };

    return opts.reduce(function (combined, item, i) {
        return combined + (i ? " " : "") + attrs[item]
    }, "");

};
/* jshint ignore:end */

/**
 * In:
 *  `facebook.svg`
 *  <g fill="#fff"><path d="M14 0c-7.732.5h10.5v5.25l7-7z"/></g>
 * Out:
 *  <g fill="#fff" transform="translate(28)" id="svg-icon-facebook"><title/><g fill="#320082"><path d="M43.482 28.161v-5.35h5.352v-4.407h-5.352v-5.35h-4.406v5.35h-5.349v4.407h5.349v5.35zM42.119 40.75s0-2.77-.23-4.217c-.189-1.144-1.773-2.654-8.508-5.131-6.631-2.434-6.223-1.248-6.223-5.728 0-2.906 1.48-1.217 2.424-6.735.367-2.172.662-.724 1.459-4.207.42-1.825-.283-1.962-.199-2.833s.168-1.647.324-3.431c.189-2.203-1.855-8.005-9.19-8.005-7.333 0-9.379 5.802-9.18 8.015.157 1.773.241 2.56.325 3.431.084.871-.618 1.007-.199 2.833.798 3.472 1.091 2.024 1.458 4.207.944 5.518 2.424 3.829 2.424 6.735 0 4.49.409 3.306-6.221 5.729-6.735 2.466-8.33 3.986-8.509 5.13-.241 1.437-.241 4.207-.241 4.207h40.286z"/></g></g>
 *
 * @returns {string}
 */
module.exports.transform = function (obj, x, y, config) {

    var data  = obj.data;
    var attrs = ["id"];

    if (!config.defs) {
        attrs.push("transform");
    }

    var id   = utils.makePath(config.svgId, obj.filename, config);

    var attributes = exports.createAttributes({
        id: id,
        x: x,
        y: y
    }, attrs);

    if (!data.match(/^<g(?:.*?)<\/g>/)) {
        data = "<g>%s</g>".replace("%s", data);
    }

    return data.replace(/^<g/, "<g " + attributes);
};

/* jshint ignore:start */
/**
 * @type {{prefix: string, sprite: string}}
 */
module.exports.templates = {
    prefix: '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">',
    sprite: '<svg baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="{:width:}" height="{:height:}" preserveAspectRatio="xMaxYMax meet" viewBox="0 0 {:width:} {:height:}">{:shapes:}</svg>',
    defs: '<svg{:styles:}><defs>{:shapes:}</defs></svg>'
};

/**
 * @param width
 * @param height
 * @param shapes
 * @param config
 * @returns {string}
 */
module.exports.wrap = function (width, height, shapes, config) {

    var joinedShapes = shapes.join("");

    if (config.defs) {
        return utils.substitute(exports.templates.defs, {
            shapes: joinedShapes,
            styles: config.hideSvg
                ? ' style="display:none"'
                : ''
        });
    }

    return exports.templates.prefix + utils.substitute(exports.templates.sprite, {
        width: width,
        height: height,
        shapes: joinedShapes
    });
};
/* jshint ignore:end */