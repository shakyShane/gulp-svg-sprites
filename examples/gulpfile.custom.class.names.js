var gulp = require('gulp');
var svgSprites = require('gulp-svg-sprites');

var svg = svgSprites.svg;
var png = svgSprites.png;

var config = {
    className: ".svg-%f-icon" // EG: .svg-facebook-icon
};

gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
        .pipe(svg(config)) // pass config option
        .pipe(gulp.dest("assets"))
        .pipe(png())
});