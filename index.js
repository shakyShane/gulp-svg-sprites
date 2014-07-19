var svgutil    = require("./lib/svg-utils");
var cssRender  = require("./lib/css-render");
var preview    = require("./lib/preview");
var utils      = require("./lib/utils");
var SpriteData = require("svg-sprite-data");


var _        = require("lodash");
var gutil    = require("gulp-util");
var File     = gutil.File;
var path     = require("path");
var through2 = require("through2");

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
    generatePreview: true,
    generateCSS: true
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


    config = _.merge(_.cloneDeep(defaults), config || {});

    // Backwards compatibility
    if (typeof config.svgFile === "string") {
        config.svg.sprite = config.svgFile;
    }
    if (config.unit) {
        config.padding = config.unit;
    }

    var libconfig = {
        common: "icon",
        dims: true,
        layout: "diagonal",
        render: {
            css: true
        }
    };

    var spriter = new SpriteData(libconfig);

    return through2.obj(function (file, enc, cb) {

        spriter.add(file.path, file.contents.toString());
        cb(null);

    }, function (cb) {

//        var combined    = svgutil.buildSVGSprite(config.classNameSuffix, tasks, config);
//        var css         = cssRender.render(combined.spriteData, config);
//
//        if (config.generatePreview) {
//            var previewPage = preview.render(css.elements, combined.content, config);
//
//            this.push(new File({
//                cwd:  "./",
//                base: "./",
//                path: config.defs ? config.preview.defs : config.preview.sprite,
//                contents: new Buffer(previewPage.svgSprite.content)
//            }));
//        }
//
//        this.push(new File({
//            cwd:  "./",
//            base: "./",
//            path: config.defs ? config.svg.defs : config.svg.sprite,
//            contents: new Buffer(combined.content)
//        }));
//
//        if (config.generateCSS) {
//        }

        var stream = this;

        // Compile
        spriter.compile(function (err, svg) {

            stream.push(new File({
                cwd:  "./",
                base: "./",
                path: config.svg.sprite,
                contents: new Buffer(svg.svg)
            }));

            // use the data to create some in-memory files and throw em down stream
            cb(null);
        });

    });
};
