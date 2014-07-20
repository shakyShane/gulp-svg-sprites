# gulp-svg-sprites

Gulp plugin for working with SVGs

**Notice** See [README.old.md](https://github.com/shakyShane/gulp-svg-sprites/blob/master/README.old.md) for options/example pre `1.0.0`

#Version 1.0.0

## Install
Install it locally to your project.

```js
$ npm install gulp-svg-sprites
```

##Usage
With no configuration, `gulp-svg-sprites` will create the following files:

1. `svg/sprite.svg` - Sprite Sheet containing all of your SVGs.
2. `sprite.html`    - A preview page with instructions & snippets.
2. `css/sprite.css` - A CSS file with the code needed to use the sprite.

```js
var svgSprite = require("gulp-svg-sprites");

gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite())
        .pipe(gulp.dest("assets"));
});
```

Then, if you had a `facebook.svg` file, you'd be able to use the following markup in your webpage:

```html
<i class="icon facebook"></i>
```

##PNG fallback
You can easily support old browsers by piping the new SVG sprite through to another gulp task. There's 
`no-svg` class generated automatically in the CSS, so you'll just need to use something like Modernizr 
to set the `no-svg` class on the `<body>` tag of your website.

```js
var svgSprite = require("gulp-svg-sprites");
var filter    = require('gulp-filter');
var svg2png   = require('gulp-svg2png');

gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite())
        .pipe(gulp.dest("assets")) // Write the sprite-sheet + CSS + Preview
        .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
        .pipe(svg2png())           // Create a PNG
        .pipe(gulp.dest("assets"));
});
```

##Symbols mode
Pass `mode: "symbols"` to output SVG data as this [CSS TRICKS article](http://css-tricks.com/svg-symbol-good-choice-icons/) outlines.
You'll get an SVG file & a preview file showing how to use it.

```js
gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest("assets"));
});
```

##Defs mode
Pass `mode: "defs"` to output SVG data as this [CSS TRICKS article](http://css-tricks.com/svg-sprites-use-better-icon-fonts/) outlines.
You'll get an SVG file & a preview file showing how to use it.

```js
gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite({mode: "defs"}))
        .pipe(gulp.dest("assets"));
});
```

###Custom Selectors
By default, the filename will be used as the selector in the CSS, but this is how you'd override it (the `%f` will be replaced with the filename)
 
```js
gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite({
            selector: "icon-%f"
        }))
        .pipe(gulp.dest("assets"));
});
```

###Custom IDs
With the `symbols` or `defs` mode, it's probably the ID you'll want to override. No problem.
 
```js
gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite({
            svgId: "svg-%f"
        }))
        .pipe(gulp.dest("assets"));
});
```

###Custom filenames
Change the generated filenames with ease. For example, if you want to create a `scss` partial instead, you could just do:
 
```js
// Custom CSS filename
gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite({
            cssFile: "scss/_sprite.scss"
        }))
        .pipe(gulp.dest("assets"));
});
        
// Custom SVG filename
gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite({
            svg: {
                sprite: "svg.svg"
            }
        }))
        .pipe(gulp.dest("assets"));
});
        
// Custom Preview filename + Custom SVG filename
gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite({
            svg: {
                sprite: "svg.svg"
            },
            preview: {
                sprite: "index.html"
            }
        }))
        .pipe(gulp.dest("assets"));
});
```

###No previews
If you don't want 'em. Works in all modes.
 
```js
gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite({
            preview: false
        }))
        .pipe(gulp.dest("assets"));
});
```

##Advanced: Custom Templates
You can get your hands on JUST the SVG Data & provide your own templates. For example, if you want to provide
your own template for the CSS output, you could do this:

```js
var config = {
    templates: {
        css: require("fs").readFileSync("./path/to/your/template.css", "utf-8")
    }
};

gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest("assets"));
});
```

You can override all the [templates used](https://github.com/shakyShane/gulp-svg-sprites/blob/master/index.js#L57-L64) in the same way.

##Advanced: Data Transforms
If you want to do some custom stuff with your templates, you might need to transform the SVG data before it gets to your template. There
are two functions you can provide to do this & they'll override the internal ones. Override `transformData` and you'll have direct access
to the data returned from [svg-sprite-data](https://github.com/shakyShane/svg-sprite-data). This will skip the few transformation that 
this library applies - so use with caution. (if you want to modify the data aswell after our internal modifications, use `afterTransform` instead).

```js
var config = {
    transformData: function (data, config) {
        return data; // modify the data and return it
    },
    templates: {
        css: require("fs").readFileSync("./path/to/your/template.css", "utf-8")
    }
};

gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest("assets"));
});

```

You can override all the [templates used here](https://github.com/shakyShane/gulp-svg-sprites/blob/master/index.js#L57-L64) in the same way.

## License
Copyright (c) 2014 Shane Osbourne
Licensed under the MIT license.
