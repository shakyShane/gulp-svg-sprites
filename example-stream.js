var fs  = require("vinyl-fs");
var svgSprites = require("./index");

var svg = svgSprites.svg;
var png = svgSprites.png;

var paths = {
    svgSrc: ["test/fixtures/basic/*.svg"],
    svgDest: "./test/fixtures/output"
};

var config = {};

fs.src(paths.svgSrc)
    .pipe(svg(config))
    .pipe(fs.dest(paths.svgDest));