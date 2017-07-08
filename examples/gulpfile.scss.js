var path      = require('path');
var gulp      = require('gulp');
var svgSprite = require('../index'); // replace with gulp-svg-sprites in your project
var filter    = require('gulp-filter');
var svg2png   = require('gulp-svg2png-fix');

var template = require('fs').readFileSync(path.resolve(__dirname, '../tmpl/sprite.scss'), 'utf-8');



var config = {
    /**
     *
     * By default, the class `icon` will be used as the common class.
     * but you can chose your own here
     *
     */
    mode: "sprite",
    common: "icon",
    templates: {
      css: template
    },
    cssFile: 'scss/_sprite.scss',
    svg: {
      sprite: 'img/sprite.svg'
    },
    preview: false,
    padding: 10,
    /**
     *
     * Easily add
     *
     *
     */
    selector: "svg-%f"
};


gulp.task('sprite:scss', ["clean:output"], function() {

  return gulp.src("test/fixtures/basic/*.svg")
      .pipe(svgSprite(config))
      .pipe(gulp.dest("./test/fixtures/output"))
      .pipe(filter('**/*.svg'))  // Filter out everything except the SVG file
      .pipe(svg2png())           // Create a PNG
      .pipe(gulp.dest("./test/fixtures/output"));
});
