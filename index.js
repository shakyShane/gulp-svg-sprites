var svgutil    = require("./lib/svg-utils");
var cssRender  = require("./lib/css-render");
var preview    = require("./lib/preview");
var _          = require("lodash");
var fs         = require("fs");
var utils      = require("./lib/utils");
var dust       = require("dustjs-linkedin");
dust.optimizers.format = function(ctx, node) { return node };


/**
 * DEVELOP
 * @type {SpriteData|exports}
 */
var SpriteData = require("/Users/shakyshane/Sites/svg-sprite");

var _        = require("lodash");
var gutil    = require("gulp-util");
var File     = gutil.File;
var path     = require("path");
var through2 = require("through2");

var PLUGIN_NAME = "gulp-svg-sprites";

var defaults = {
    common: "icon",
    selector: "%f",
    layout: "diagonal",
    dims: true,
    svgId:     "%f",
    cssFile:   "css/sprites.css",
    svgPath:   "../%f",
    pngPath:   "../%f",
    preview: {
        sprite: "preview-svg-sprite.html",
        defs: "preview-svg.html"
    },
    svg: {
        sprite: "sprites/svg-sprite.svg",
        defs: "sprites/svg-defs.svg"
    },
    refSize: 26,
    padding: 0,
    defs: false,
    hideSvg: true,
    generatePreview: true,
    generateCSS: true
};

var templatePaths = {
    css: "./tmpl/sprite.css"
};

/**
 * @param config
 * @returns {{}}
 */
function getTemplates(config) {

    var templates = {};

    Object.keys(templatePaths).forEach(function (key) {
        if (config.templates && config.templates[key]) {
            templates[key] = config.templates[key];
        } else {
            templates[key] = fs.readFileSync(templatePaths[key], "utf-8");
        }
    });

    return templates;
}

/**
 * Any last-minute transformations before compiling templates
 * @param data
 * @param config
 * @returns {*}
 */
function transformData(data, config) {

    data.svgPath = config.svgPath.replace("%f", config.svg.sprite);
    data.pngPath = config.pngPath.replace("%f", config.svg.sprite.replace(/\.svg$/, ".png"));

    data.svg = data.svg.map(function (item) {

        item.height = item.height/10;
        item.width  = item.width/10;
        item.positionX  = item.positionX/10;
        item.positionY  = item.positionY/10;

        return item;
    });

    data.swidth  = data.swidth/10;
    data.sheight = data.sheight/10;
    return data;
}

/**
 * Helper for correct plugin errors
 * @param context
 * @param msg
 */
function error(context, msg) {
    context.emit("error", new gutil.PluginError(PLUGIN_NAME, msg));
}

/**
 * @returns {*}
 */
module.exports.svg = function (config) {


    config = _.merge(_.cloneDeep(defaults), config || {});

    // Backwards compatibility
    if (typeof config.svgFile === "string") {
        config.svg.sprite = config.svgFile;
    }
    if (config.unit) {
        config.padding = config.unit;
    }

    var spriter = new SpriteData(config);

    return through2.obj(function (file, enc, cb) {

        spriter.add(file.path, file.contents.toString());

        cb(null);

    }, function (cb) {

        var stream = this;

        spriter.compile(function (err, svg) {

            // Get data
            var data = transformData(svg.data, config);
            writeFiles(stream, config, svg.svg, data, cb);

        });
    });
};

/**
 * @param stream
 * @param config
 * @param svg
 * @param data
 * @param cb
 */
function writeFiles(stream, config, svg, data, cb) {

    var temps = getTemplates(config);

    dust.compileFn(temps.css, "css", false);

    dust.render("css", data, function (err, out) {

        stream.push(new File({
            cwd:  "./",
            base: "./",
            path: config.cssFile,
            contents: new Buffer(out)
        }));

        stream.push(new File({
            cwd:  "./",
            base: "./",
            path: config.svg.sprite,
            contents: new Buffer(svg)
        }));

        cb(null);
    });
}
