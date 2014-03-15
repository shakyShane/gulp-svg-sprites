var fs  = require("vinyl-fs");
var svgSprites = require("./index");

var svg = svgSprites.svgStream;
var png = svgSprites.createPng;

var paths = {
    svgSrc: ["test/fixtures/svg/*.svg"],
    svgDest: "./test/fixtures"
};

fs.src(paths.svgSrc)
    .pipe(svg())
    .pipe(fs.dest(paths.svgDest))
    .pipe(png());

