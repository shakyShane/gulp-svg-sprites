var gulp = require('gulp');
var jshint = require('gulp-jshint');
var contribs = require('gulp-contribs');
var clean = require('gulp-clean');


gulp.task('clean:output', function() {
  return gulp.src('test/fixtures/output', { read: false })
    .pipe(clean());
});

require('./examples/gulpfile.basic');
require('./examples/gulpfile.options');
require('./examples/gulpfile.scss');

gulp.task('lint', function() {
  gulp.src(['test/specs/**/*.js', '!test/fixtures/**', 'index.js'])
    .pipe(jshint('test/specs/.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
});

gulp.task('contribs', function() {
  gulp.src('README.md')
    .pipe(contribs())
    .pipe(gulp.dest("./"))
});




gulp.task('default', ['lint']);

gulp.task("docs", function() {

  var yuidoc = require("gulp-yuidoc");

  gulp.src(["./index.js"])
    .pipe(yuidoc.parser({ spaces: 4 }))
    .pipe(gulp.dest("./doc"));
});
