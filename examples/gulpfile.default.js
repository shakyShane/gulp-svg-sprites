var gulp = require('gulp');
var svgSprites = require('gulp-svg-sprites');

var svg = svgSprites.svg;
var png = svgSprites.png;

gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
        .pipe(svg())
        .pipe(gulp.dest("assets"))
        .pipe(png())
});