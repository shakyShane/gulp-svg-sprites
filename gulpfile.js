var gulp = require('gulp');
var jshint = require('gulp-jshint');
var contribs = require('gulp-contribs');

gulp.task('lint', function () {
    gulp.src(['test/specs/**/*.js', '!test/fixtures/**', 'lib/*'])
            .pipe(jshint('test/specs/.jshintrc'))
            .pipe(jshint.reporter('default'))
            .pipe(jshint.reporter('fail'))
});

gulp.task('contribs', function () {
    gulp.src('README.md')
            .pipe(contribs())
            .pipe(gulp.dest("./"))
});

gulp.task('default', ['lint']);

var svgSprites = require("./index");

var svg = svgSprites.svg;
var png = svgSprites.png;

var paths = {
    svgSrc: ["test/fixtures/svg/*.svg"],
    svgDest: "./test/fixtures"
};

var config = {
    svgId: "svg-%f-icon"
};

gulp.task('sprites', function () {
    gulp.src(paths.svgSrc)
        .pipe(svg(config))
        .pipe(gulp.dest(paths.svgDest))
        .pipe(png())
});
