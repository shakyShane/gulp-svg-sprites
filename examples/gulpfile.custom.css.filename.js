var gulp = require('gulp');
var svgSprites = require('gulp-svg-sprites');

var svg = svgSprites.svg;
var png = svgSprites.png;

var config = {
    cssFile:  "app/my-fancy-sprites.css"
};

gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
        .pipe(svg(config)) // pass config option
        .pipe(gulp.dest("assets"))
        .pipe(png())
});