"use strict";

var utils   = require("./utils");

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
        path: config.spritePath + "/" + utils.joinName(config.classNamePrefix, spriteName, "sprite") + ".svg",
        sizes: {}
    };

    var spriteHeight = 0;
    var elementUnitWidth = 0;
    var elements = [];
    var x = 0;
    var resultsList = [];

    Object.keys(tasks).forEach(function (item) {
        resultsList.push({
            className: utils.joinName(config.classNamePrefix, item.slice(item.lastIndexOf("/") + 1, -suffix.length)),
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

    resultsList.forEach(function (result) {
        var svg = result.svg;
        var className = result.className;

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

        elements.push(exports.transform(svg.data, x, 0));

        x += elementUnitWidth + config.unit;

    });

    x = utils.roundUpToUnit(x);
    spriteHeight = utils.roundUpToUnit(spriteHeight);
    spriteData.width = x;
    spriteData.height = spriteHeight;


    return {
        spriteData: spriteData,
        content: exports.wrap(x, spriteHeight, elements)
    };
};

/**
 * @param data
 * @param x
 * @param y
 * @param fill
 * @returns {*}
 */
module.exports.transform = function (data, x, y, fill) {
    if (x === 0 && y === 0) {
        return data;
    }
    if (data !== data.match(/^<g>(?:.*?)<\/g>/)) {
        data = "<g>" + data + "</g>";
    }
    var attributes = " transform=\"translate(" + x + ( y ? " " + y : "" ) + ")\"";
    if (fill) {
        if (data.match(/fill="/)) {
            data = data.replace(/(fill=")[^"]+(")/g, "$1" + fill + "$2");
        }
        else {
            attributes += " fill=\"" + fill + "\"";
        }
    }
    data = data.replace(/^<g/, "<g" + attributes);
    return data;
};

/* jshint ignore:start */
module.exports.wrap = function (width, height, shapes) {
    return '<svg baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" preserveAspectRatio="xMaxYMax meet" viewBox="0 0 ' + width + ' ' + height + '" >' + shapes.join("") + '</svg>';
};
/* jshint ignore:end */