var gulp      = require("gulp");
var svgSprite = require("../index"); // replace with gulp-svg-sprites in your project

gulp.task("sprite:defs", ["clean:output"], function() {
    return gulp.src("test/fixtures/basic/*.svg")
        .pipe(svgSprite({mode: "defs"}))
        .pipe(gulp.dest("./test/fixtures/output"));
  });
