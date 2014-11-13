var fs  = require("vinyl-fs");
var svgSprites = require("./index");
var svg2png = require('gulp-svg2png');
var filter = require('gulp-filter');

var paths = {
    svgSrc: ["test/fixtures/basic/*.svg"],
    svgDest: "./test/fixtures/output"
};

var config = {
    mode: "sprite"
};

fs.src("test/fixtures/basic/*.svg")
    .pipe(svgSprites(config))
    .pipe(fs.dest(paths.svgDest))
    .pipe(filter("**/*.svg"))
    .pipe(svg2png())
    .pipe(fs.dest(paths.svgDest));
