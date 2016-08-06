/**
 *
 *
 * This example shows basic usage with no options/config
 *
 *
 */
var gulp      = require("gulp");
var svgSprite = require("../index"); // replace with gulp-svg-sprites in your project

gulp.task("sprite:basic", ["clean:output"], function () {
    return gulp.src("test/fixtures/basic/*.svg")
        .pipe(svgSprite())
        .pipe(gulp.dest("./test/fixtures/output"))
});
