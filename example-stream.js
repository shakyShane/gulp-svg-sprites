var fs  = require("vinyl-fs");
var svgSprites = require("./index");

var svg = svgSprites.svg;
var png = svgSprites.png;

var paths = {
    svgSrc: ["test/fixtures/svg/*.svg"],
    svgDest: "./test/fixtures"
};

fs.src(paths.svgSrc)
    .pipe(svg())
    .pipe(fs.dest(paths.svgDest))
    .pipe(png());
