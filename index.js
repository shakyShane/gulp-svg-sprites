var _          = require("lodash");
var Q          = require("q");
var fs         = require("fs");
var dust       = require("dustjs-linkedin");

dust.optimizers.format = function(ctx, node) { return node; };

/**
 * DEVELOP
 * @type {SpriteData|exports}
 */
var SpriteData = require("svg-sprite-data");

var gutil    = require("gulp-util");
var File     = gutil.File;
var path     = require("path");
var through2 = require("through2");

var PLUGIN_NAME = "gulp-svg-sprites";

var defaults = {
    common:    "icon",
    selector:  "%f",
    layout:    "vertical",
    svgId:     "%f",
    cssFile:   "css/sprites.css",
    svgPath:   "../%f",
    pngPath:   "../%f",
    preview: {
        sprite:  "sprite.html",
        defs:    "defs.html",
        symbols: "symbols.html"
    },
    svg: {
        sprite:  "svg/sprite.svg",
        defs:    "svg/defs.svg",
        symbols: "svg/symbols.svg"
    },
    refSize: 26,
    padding: 0,
    dims: true,
    hideSvg: true,
    mode: "sprite",
    transformData: transformData,
    afterTransform: function (data, config) {
        return data;
    }
};

/**
 * Default templates, can be overridden by supplying the same keys in the
 * templates: { } option
 */
var templatePaths = {
    css:            "/tmpl/sprite.css",
    defs:           "/tmpl/defs.svg",
    symbols:        "/tmpl/symbols.svg",
    previewSprite:  "/tmpl/preview.html",
    previewDefs:    "/tmpl/preview-defs.html",
    previewSymbols: "/tmpl/preview-symbol.html"
};

/**
 * Use user-provided templates first, defaults as fallback
 * @param {Object} config
 * @returns {Object}
 */
function getTemplates(config) {

    var templates = {};

    Object.keys(templatePaths).forEach(function (key) {
        if (config.templates && config.templates[key]) {
            templates[key] = config.templates[key];
        } else {
            templates[key] = fs.readFileSync(__dirname + templatePaths[key], "utf-8");
        }
    });

    return templates;
}

/**
 * Any last-minute data transformations before handing off to templates,
 * can be overridden by supplying a 'transformData' option
 * @param data
 * @param config
 * @returns {*}
 */
function transformData(data, config) {

    data.svgPath = config.svgPath.replace("%f", config.svg.sprite);
    data.pngPath = config.pngPath.replace("%f", config.svg.sprite.replace(/\.svg$/, ".png"));

    data.svg = data.svg.map(function (item) {

        item.relHeight = item.height/10;
        item.relWidth  = item.width/10;
        item.relPositionX  = item.positionX/10;
        item.relPositionY  = item.positionY/10;

        return item;
    });

    data.relWidth  = data.swidth/10;
    data.relHeight = data.sheight/10;

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
 * @param stream
 * @param config
 * @param svg
 * @param data
 * @param cb
 */
function writeFiles(stream, config, svg, data, cb) {

    var temps = getTemplates(config);

    data.config = config;

    var promises = [];

    if (!config.svg) {
        cb(null);
    }

    // Create SVG sprite
    if (config.mode === "sprite") {

        stream.push(new File({
            cwd:  "./",
            base: "./",
            path: config.svg.sprite,
            contents: new Buffer(svg)
        }));

        if (config.cssFile) {
            promises.push(makeFile(temps.css, config.cssFile, stream, data));
        }

        if (config.preview && config.preview.sprite) {
            promises.push(makeFile(temps.previewSprite, config.preview.sprite, stream, data));
        }

        return Q.all(promises).then(cb.bind(null, null));
    }

    var template = "defs";
    var preview  = "previewDefs";


    if (config.mode === "symbols") {
        template = "symbols";
        preview  = "previewSymbols";
    }

    makeFile(temps[template], config.svg[template], stream, data).then(function (output) {

        data.svgInline = output;

        if (config.preview && config.preview[config.mode]) {
            promises.push(makeFile(temps[preview], config.preview[template], stream, data));
            Q.all(promises).then(cb);
        } else {
            cb(null);
        }
    });
}

/**
 * @param template
 * @param fileName
 * @param stream
 * @param data
 * @returns {Promise.promise|*}
 */
function makeFile(template, fileName, stream, data) {

    var deferred = Q.defer();
    var id = _.uniqueId();

    dust.compileFn(template, id, false);

    dust.render(id, data, function (err, out) {

        stream.push(new File({
            cwd:  "./",
            base: "./",
            path: fileName,
            contents: new Buffer(out)
        }));

        deferred.resolve(out);
    });

    return deferred.promise;
}

/**
 * @returns {*}
 */
module.exports = function (config) {

    config = _.merge(_.cloneDeep(defaults), config || {});

    // Backwards compatibility
    if (typeof config.svgFile === "string") {
        config.svg.sprite = config.svgFile;
    }
    if (config.unit) {
        config.padding = config.unit;
    }

    if (config.mode === "defs" || config.mode === "symbols") {
        config.inline = true;
    } else {
        config.inline = false;
    }

    var spriter = new SpriteData(config);

    return through2.obj(function (file, enc, cb) {

        spriter.add(file.path, file.contents.toString());

        cb(null);

    }, function (cb) {

        var stream = this;

        spriter.compile(config, function (err, svg) {

            // Get data
            var data = config.transformData(svg.data, config);
            data = config.afterTransform(data, config);
            writeFiles(stream, config, svg.svg, data, cb.bind(null, null));
        });
    });
};