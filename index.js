var SpriteData = require("svg-sprite-data");
var through2   = require("through2");
var gutil      = require("gulp-util");
var File       = gutil.File;
var dust       = require("dustjs-linkedin");
var fs         = require("fs");
var Q          = require("q");
var _          = require("lodash");
var path       = require("path");

/**
 * Make Dust templates retain whitespace
 * @param ctx
 * @param node
 * @returns {*}
 */
dust.optimizers.format = function(ctx, node) { return node; };

var PLUGIN_NAME = "gulp-svg-sprites";

/**
 * @module gulp-svg-sprite.options
 * Default configuration. Everything here can be overridden
 */
var defaults = {
    /**
     *
     * Define which mode to run in. Can be either "sprite", "defs" or "symbols"
     *
     * @property mode
     * @type String
     * @default sprite
     */
    mode: "sprite",
    /**
     *
     * By default, the class `icon` will be used as the common class.
     * but you can also choose your own
     *
     * @property common
     * @type String
     * @default icon
     */
    common:    "icon",
    /**
     *
     * Easily add prefixes/suffixes to the generated CSS classnames. The `%f` will
     * be replaced by the filename
     *
     * @property selector
     * @type String
     * @default %f
     */
    selector:  "%f",
    /**
     *
     * Define the layout of the items in the sprite. Can be either
     * "vertical", "horizontal" or "diagonal"
     *
     * @property layout
     * @type String
     * @default vertical
     */
    layout:    "vertical",
    /**
     *
     * In `symbols` or `defs` mode, you'll probably want to override the ID on each element.
     * The filename will be used as a default, but can be overridden.
     *
     * @property svgId
     * @type String
     * @default %f
     */
    svgId:     "%f",
    /**
     *
     * Define the path & filename of the CSS file. Using this, you could easily create a SASS
     * partial for example
     *
     * @property cssFile
     * @type String
     * @default css/sprite.css
     */
    cssFile:   "css/sprite.css",
    /**
     *
     * Define the path to the SVG file that be written to the CSS file. Note: this does NOT alter
     * the actual write-path of the SVG file. See the `svg` option for that.
     *
     * @property svgPath
     * @type String
     * @default ../%f
     */
    svgPath:   "../%f",
    /**
     *
     * If you're creating a PNG fallback, define the path to it that be written to the CSS file.
     *
     * @property pngPath
     * @type String
     * @default ../%f
     */
    pngPath:   "../%f",
    /**
     *
     * Paths to preview files.
     *
     * @property preview
     * @type Object
     * @param {String} [sprite=sprite.html]
     * @param {String} [defs=defs.html]
     * @param {String} [symbols=symbols.html]
     */
    preview: {
        sprite:  "sprite.html",
        defs:    "defs.html",
        symbols: "symbols.html"
    },
    /**
     *
     * Paths to SVG files.
     *
     * @property svg
     * @type Object
     * @param {String} [sprite=svg/sprite.svg]
     * @param {String} [defs=svg/defs.svg]
     * @param {String} [symbols=svg/symbols.svg]
     */
    svg: {
        sprite:  "svg/sprite.svg",
        defs:    "svg/defs.svg",
        symbols: "svg/symbols.svg"
    },
    refSize: 26,
    /**
     *
     * Add padding to sprite items
     *
     * @property padding
     * @type Number
     * @default 0
     */
    padding: 0,
    dims: true,
    hideSvg: true,
    /**
     *
     * Override the default data transforms
     *
     * @property transformData
     * @type Function
     * @default transformData
     */
    transformData: transformData,
    /**
     *
     * Apply additional data transforms AFTER the defaults
     *
     * @property afterTransform
     * @type Function
     * @default afterTransform
     */
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
    
    // Set preview css file to first submitted path
    if (typeof(config.cssFile) === "object") {
        config.cssFileObj = config.cssFile;
        config.cssFile = config.cssFile[0];
    }

    data.svgPath = config.svgPath.replace("%f", config.svg.sprite);
    data.pngPath = config.pngPath.replace("%f", config.svg.sprite.replace(/\.svg$/, ".png"));

    data.svg = data.svg.map(function (item) {

        item.relHeight = item.height/10;
        item.relWidth  = item.width/10;

        item.relPositionX = item.positionX/10 - config.padding/10;
        item.relPositionY = item.positionY/10 - config.padding/10;
        item.normal = true;

        if (item.name.match(/~/g)) {
            if (config.mode !== "sprite") {
                return false;
            } else {
                var segs  = item.name.split("~");
                item.name = item.selector[0].expression + ":" + segs[1];
                item.normal = false;
            }
        } else {
            item.name = item.selector[0].expression;
        }

        return item;
    });

    data.svg = data.svg.filter(function (item) { return item; });

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
            if ( config.cssFileObj ) {
                _(config.cssFileObj).forEach(function(cssFile) { 
                    promises.push(makeFile( temps.css, cssFile, stream, data));
                });
            } else {
                promises.push(makeFile(temps.css, config.cssFile, stream, data));
            }
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
 * @returns {Function}
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
