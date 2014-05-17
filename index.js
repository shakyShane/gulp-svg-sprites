var svgutil   = require("./lib/svg-utils");
var cssRender = require("./lib/css-render");
var preview   = require("./lib/preview");
var utils     = require("./lib/utils");

var _        = require("lodash");
var gutil    = require("gulp-util");
var path     = require("path");
var through2 = require("through2");
var File     = require("vinyl");
var svg2png  = require("svg2png");

var PLUGIN_NAME = "gulp-svg-sprites";

var defaults = {
    className: ".%f",
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
    generatePreview: true
};

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


    var tasks = [];
    config = _.merge(_.cloneDeep(defaults), config || {});

    // Backwards compatibility
    if (typeof config.svgFile === "string") {
        config.svg.sprite = config.svgFile;
    }
    if (config.unit) {
        config.padding = config.unit;
    }

    return through2.obj(function (file, enc, cb) {

        var contents = file.contents.toString();

        svgutil.addSvgFile(contents, file, tasks, function () {
            cb(null);
        }.bind(this));

    }, function (cb) {

        var combined    = svgutil.buildSVGSprite(config.classNameSuffix, tasks, config);
        var css         = cssRender.render(combined.spriteData, config);

        if (config.generatePreview) {
            var previewPage = preview.render(css.elements, combined.content, config);
            
            this.push(new File({
                cwd:  "./",
                base: "./",
                path: config.defs ? config.preview.defs : config.preview.sprite,
                contents: new Buffer(previewPage.svgSprite.content)
            }));
        }

        this.push(new File({
            cwd:  "./",
            base: "./",
            path: config.defs ? config.svg.defs : config.svg.sprite,
            contents: new Buffer(combined.content)
        }));

        this.push(new File({
            cwd:  "./",
            base: "./",
            path: config.cssFile,
            contents: new Buffer(css.content)
        }));
        cb(null);
    });
};

/**
 * Create the PNG Fallback
 */
module.exports.png = function () {
    return through2.obj(function (file, enc, cb) {
        var stream = this;
        if (path.extname(file.path) === ".svg") {

            if (file.contents.toString().indexOf(svgutil.templates.prefix) < 0) {
                error(stream, "This SVG format is not supported");
            }

            var svgPath = path.resolve(file.path);
            var pngPath = path.resolve(utils.swapFileName(file.path));

            svg2png(svgPath, pngPath, function (err) {
                if (err) {
                    error(stream, "Could not create the PNG format");
                }
                return cb();
            });
        } else {
            return cb();
        }
    });
};
