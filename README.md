# gulp-svg-sprites [![Build Status](https://travis-ci.org/shakyShane/gulp-svg-sprites.png?branch=master)](https://travis-ci.org/shakyShane/gulp-svg-sprites)

Create SVG sprites with PNG fallbacks

## Usage
Install it locally to your project.

`npm install gulp-svg-sprites`

## Example

```js
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
```

## License
Copyright (c) 2013 Shane Osbourne
Licensed under the MIT license.
