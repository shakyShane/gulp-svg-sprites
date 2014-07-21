/**
 *
 *
 * These examples show some of the different options
 * that can be used
 *
 *
 */
var gulp      = require("gulp");
var svgSprite = require("../index"); // replace with gulp-svg-sprites in your project


var config = {
    /**
     *
     * By default, the class `icon` will be used as the common class.
     * but you can chose your own here
     *
     */
    common: "svg-icon",
    /**
     *
     * Easily add
     *
     *
     */
    selector: "icon-%f"
};


gulp.task("sprite", function () {
    gulp.src("test/fixtures/svg/basic/*.svg")
        .pipe(svgSprite(config))
        .pipe(gulp.dest("../test/fixtures/output"))
});