### gulp-svg-sprites


## Install
Install it locally to your project.

```js
$ npm install --save-dev gulp-svg-sprites
```

**Windows note:** Using Version < 4.0.0 Make sure, you also have all [prerequisities for node-gyp](https://github.com/TooTallNate/node-gyp#installation).

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
You can easily support old browsers by piping the new SVG sprite through to another gulp task. There will be a
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

###Base Size
Set the font-size of the .icon class. Just pass a plain number, no units.

```js
gulp.task('sprites', function () {
    return gulp.src('assets/svg/*.svg')
        .pipe(svgSprite({
            baseSize: 16
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
Templates use Lodash Templates - checkout [their docs](https://lodash.com/docs#template) for usage instructions. Or take a look at the [default css](https://github.com/shakyShane/gulp-svg-sprites/blob/master/tmpl/sprite.css)
or the [default scss](https://github.com/shakyShane/gulp-svg-sprites/blob/master/tmpl/sprite.scss) for tips.

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

// Synchronous
var config = {
    transformData: function (data, config) {
        return data; // modify the data and return it
    },
    templates: {
        css: require("fs").readFileSync("./path/to/your/template.css", "utf-8")
    }
};

// Asynchronous
var config = {
    asyncTransforms: true,
    transformData: function (data, config, done) {
        done(data); // modify the data and pass it
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

You can override all the [templates used here](https://github.com/shakyShane/gulp-svg-sprites/blob/master/index.js#L172-L179) in the same way. If you are doing any async work in these callbacks set `asyncTransforms` to `true` in the config. 

## Options
<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead>
<tbody>

<tr>
    <td><b>mode</b></td>
    <td>String</td>
    <td><code>sprite</code></td>
    <td><p>Define which mode to run in. Can be either &quot;sprite&quot;, &quot;defs&quot; or &quot;symbols&quot;</p>
</td>
</tr>


<tr>
    <td><b>common</b></td>
    <td>String</td>
    <td><code>icon</code></td>
    <td><p>By default, the class <code>icon</code> will be used as the common class.
 but you can also choose your own</p>
</td>
</tr>


<tr>
    <td><b>selector</b></td>
    <td>String</td>
    <td><code>%f</code></td>
    <td><p>Easily add prefixes/suffixes to the generated CSS classnames. The <code>%f</code> will
 be replaced by the filename</p>
</td>
</tr>


<tr>
    <td><b>layout</b></td>
    <td>String</td>
    <td><code>vertical</code></td>
    <td><p>Define the layout of the items in the sprite. Can be either
 &quot;vertical&quot;, &quot;horizontal&quot; or &quot;diagonal&quot;</p>
</td>
</tr>


<tr>
    <td><b>svgId</b></td>
    <td>String</td>
    <td><code>%f</code></td>
    <td><p>In <code>symbols</code> or <code>defs</code> mode, you&#39;ll probably want to override the ID on each element.
 The filename will be used as a default, but can be overridden.</p>
</td>
</tr>


<tr>
    <td><b>cssFile</b></td>
    <td>String</td>
    <td><code>css/sprite.css</code></td>
    <td><p>Define the path &amp; filename of the CSS file. Using this, you could easily create a SASS
 partial for example</p>
</td>
</tr>


<tr>
    <td><b>svgPath</b></td>
    <td>String</td>
    <td><code>../%f</code></td>
    <td><p>Define the path to the SVG file that be written to the CSS file. Note: this does NOT alter
 the actual write-path of the SVG file. See the <code>svg</code> option for that.</p>
</td>
</tr>


<tr>
    <td><b>pngPath</b></td>
    <td>String</td>
    <td><code>../%f</code></td>
    <td><p>If you&#39;re creating a PNG fallback, define the path to it that be written to the CSS file.</p>
</td>
</tr>


<tr>
    <td><b>preview</b></td>
    <td>Object</td>
    <td></td>
    <td><p>Paths to preview files.</p>
</td>
</tr>

<tr>
    <td> preview.sprite</td>
    <td>String</td>
    <td><code>sprite.html</code></td>
    <td></td>
</tr>

<tr>
    <td> preview.defs</td>
    <td>String</td>
    <td><code>defs.html</code></td>
    <td></td>
</tr>

<tr>
    <td> preview.symbols</td>
    <td>String</td>
    <td><code>symbols.html</code></td>
    <td></td>
</tr>


<tr>
    <td><b>svg</b></td>
    <td>Object</td>
    <td></td>
    <td><p>Paths to SVG files.</p>
</td>
</tr>

<tr>
    <td> svg.sprite</td>
    <td>String</td>
    <td><code>svg/sprite.svg</code></td>
    <td></td>
</tr>

<tr>
    <td> svg.defs</td>
    <td>String</td>
    <td><code>svg/defs.svg</code></td>
    <td></td>
</tr>

<tr>
    <td> svg.symbols</td>
    <td>String</td>
    <td><code>svg/symbols.svg</code></td>
    <td></td>
</tr>


<tr>
    <td><b>padding</b></td>
    <td>Number</td>
    <td><code>0</code></td>
    <td><p>Add padding to sprite items</p>
</td>
</tr>


<tr>
    <td><b>asyncTransforms</b></td>
    <td>Boolean</td>
    <td><code>false</code></td>
    <td><p>Use async transforms</p>
</td>
</tr>


<tr>
    <td><b>baseSize</b></td>
    <td>Number</td>
    <td><code>10</code></td>
    <td><p>Set the base font-size for the icon element</p>
</td>
</tr>


<tr>
    <td><b>transformData</b></td>
    <td>Function</td>
    <td><code>transformData</code></td>
    <td><p>Override the default data transforms</p>
</td>
</tr>


<tr>
    <td><b>afterTransform</b></td>
    <td>Function</td>
    <td><code>afterTransform</code></td>
    <td><p>Apply additional data transforms AFTER the defaults</p>
</td>
</tr>


</tbody>
</table>
## License
Copyright (c) 2014 Shane Osbourne
Licensed under the MIT license.
