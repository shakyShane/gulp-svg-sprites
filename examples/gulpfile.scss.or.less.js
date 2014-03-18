var gulp = require('gulp');
var svgSprites = require('gulp-svg-sprites');

var svg = svgSprites.svg;
var png = svgSprites.png;

var config = {
    cssFile:  "scss/_sprites.scss" // write a SCSS file instead
//    cssFile:  "less/_sprites.less" // write a LESS file instead
};

gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
        .pipe(svg(config)) // pass config option
        .pipe(gulp.dest("assets"))
        .pipe(png())
});