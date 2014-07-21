/**
 *
 *
 * This example shows basic usage with no options/config
 *
 *
 */
var gulp      = require("gulp");
var svgSprite = require("../index"); // replace with gulp-svg-sprites in your project

gulp.task("sprite", function () {
    gulp.src("test/fixtures/svg/basic/*.svg")
        .pipe(svgSprite())
        .pipe(gulp.dest("../test/fixtures/output"))
});