var fs  = require("vinyl-fs");
var svgSprites = require("./index");

var svg = svgSprites.svg;
var png = svgSprites.png;

var paths = {
    svgSrc: ["test/fixtures/svg/*.svg"],
    svgDest: "./test/fixtures"
};

var config = {
    className: ".svg-%f-icon",
    unit: 0
};

fs.src(paths.svgSrc)
    .pipe(svg(config))
    .pipe(fs.dest(paths.svgDest))
    .pipe(png());
