# gulp-svg-sprites [![Build Status](https://travis-ci.org/shakyShane/gulp-svg-sprites.png?branch=master)](https://travis-ci.org/shakyShane/gulp-svg-sprites)

Gulp plugin for working with SVGs

**Notice** - This is a new project with a deliberately minimal feature set. If there's something missing that would help you though, post an issue
and we'll try to get it implemented.

## Usage
Install it locally to your project.

`npm install gulp-svg-sprites`

##Screencasts
1. [Simple usage](http://quick.as/ebeh4va)
2. [Configuration](http://quick.as/bdpiolw)
3. [Support for `<defs>` output](http://quick.as/3v0svmo) (as per [Chris Coyiers article](http://css-tricks.com/svg-sprites-use-better-icon-fonts/))

## Example 1 - Sprite Sheet
This will take a bunch of SVGs, create a sprite-sheet out of it (in both SVG & PNG) & write all the CSS for you (including `.no-svg` prefixes for the fallback)

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

## Example 2 - using `<defs>`
As explained in [this article by Chris Coyier](http://css-tricks.com/svg-sprites-use-better-icon-fonts/), there's an even better way to use SVGs, if you are not concerned with old versions of IE.
Setting the config option `defs: true` will create the required output for using that technique.

**NOTE:** when using this mode, you cannot generate a PNG fallback from the SVG output. Trying to do so will cause an error.

```
var gulp = require('gulp');
var svgSprites = require('gulp-svg-sprites');

var svg = svgSprites.svg;

gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
            .pipe(svg({defs: true}))
            .pipe(gulp.dest("assets"));
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


##Common options

**padding**

Add some spacing around your sprite sheet items by setting this option

```js
// Add 5px padding to the sprite sheet
gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
            .pipe(svg({padding: 5))
            .pipe(gulp.dest("assets"))
            .pipe(png())
});
```

**disabling previews**

Disable the generation of HTML previews

```js
gulp.task('sprites', function () {
    gulp.src('assets/svg/*.svg')
            .pipe(svg({generatePreview: false}))
            .pipe(gulp.dest("assets"))
            .pipe(png())
});
```

Take a look at [index.js](https://github.com/shakyShane/gulp-svg-sprites/blob/master/index.js#L15) to see which other options you can override.




## Contributors

```
    44	Shane Osbourne
     5	thomaswelton
     3	David Mair Spiess
     1	Alexander Flatscher
     1	David Blurton
     1	Thomas Welton
```

## License
Copyright (c) 2014 Shane Osbourne
Licensed under the MIT license.
