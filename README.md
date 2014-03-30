# gulp-svg-sprites [![Build Status](https://travis-ci.org/shakyShane/gulp-svg-sprites.png?branch=master)](https://travis-ci.org/shakyShane/gulp-svg-sprites)

Create SVG sprites with PNG fallbacks

**Notice** - This is a new project with a deliberately minimal feature set. If there's something missing that would help you though, post an issue
and we'll try to get it implemented.

## Usage
Install it locally to your project.

`npm install gulp-svg-sprites`

## Example, using defaults
There are more [examples here](https://github.com/shakyShane/gulp-svg-sprites/tree/master/examples).

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

## Example, with custom class names

You can pass a config object to the svg function that will allow full control over the resulting CSS.
For example, say you wanted all of your CSS classes to have `-icon` suffix, you could do this:

```js
var config = {
    className: ".%f-icon"
};

gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
            .pipe(svg(config))
            .pipe(gulp.dest("assets"))
            .pipe(png())
});
```

Which would create class names like this in the the CSS (where `facebook` was the filename)

```css
.facebook-icon {
	/* css generated here */
}
```

It's the `%f` from `.%f-icon` which gets replaced with the filename of the SVG - This means you can also add prefixes easily as well.

```js
var config = {
    className: ".svg-%f-icon"
};

gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
            .pipe(svg(config))
            .pipe(gulp.dest("assets"))
            .pipe(png())
});
```

Which would create:

```css
.svg-facebook-icon {
	/* css generated here */
}
```

You can also provide a callback function for the class names too. The first argument is the filename, the second is the entire config object

```js
var config = {
    className: function (file, object) {
        return ".svg-" + file;
    }
};

gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
            .pipe(svg(config))
            .pipe(gulp.dest("assets"))
            .pipe(png())
});
```

Take a look at the defaults in index.js:14 to see what else you can override.

## Contributors

```
    18	Shane Osbourne
     1	David Mair Spiess
```

## License
Copyright (c) 2013 Shane Osbourne
Licensed under the MIT license.
