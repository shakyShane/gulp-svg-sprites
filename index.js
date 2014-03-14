/*
 * dr-svg-sprites
 *
 *
 * Copyright (c) 2013 drdk
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (config, callback) {

	var async = require("async");
	var _ = require("lodash");
	var phantomjs = require("phantomjs").path;
	var fs = require("fs");
	var path = require("path");
	var execFile = require("child_process").execFile;
	var fsutil = require("./lib/fsutil");
	var svgutil = require("./lib/svgutil");

	// Humble defaults
	var defaults = {
		unit: 10,
		prefix: "",
		cssSuffix: "css"
	};

	// Merge defaults with user configuration
	config = _.assign(defaults, config);

	var root = path.relative(process.cwd(), config.spriteElementPath);
	var spriteName = config.name;
	var unit = config.unit;
	var suffix = ".svg";

	if (config.prefix && !("cssPrefix" in config)) {
		config.cssPrefix = config.prefix;
	}

	config.spritePath = config.spritePath.replace(/\\/g, "/").replace(/\/$/, "");

	var spriteElements = fsutil.getFiles(root, suffix).map(function(spriteElement){
		return root + "/" + spriteElement;
	});
	spriteElements.sort();

	buildSVGSprite(spriteName, spriteElements, buildPNGSprites);

	function buildSVGSprite (spriteName, files, callback) {

		//console.log("building SVG sprite:", spriteName, "...");

		var tasks = {};

		files.forEach(function (file) {
			tasks[file] = function (_callback) {
				svgutil.loadShape(file, _callback);
			};
		});

		fsutil.mkdirRecursive(config.spritePath);

		async.parallel(tasks, function (err, results) {
			var spriteData = {
				elements: [],
				path: config.spritePath + "/" + joinName(config.prefix, spriteName, "sprite") + ".svg",
				sizes: {}
			};
			var spriteHeight = 0;
			var elementUnitWidth = 0;
			var elements = [];
			var x = 0;
			var resultsList = [];
			var filename;

			_.forOwn(results, function (svg, filename) {
				resultsList.push({
					className: joinName(config.prefix, filename.slice(filename.lastIndexOf("/") + 1, -suffix.length)),
					filename: filename,
					svg: svg
				});
			});

			resultsList.sort(function (a, b) {
				if (a.className > b.className) {
					return 1;
				}
				if (a.className < b.className) {
					return -1;
				}
				return 0;
			});

			resultsList.forEach(function (result) {
				var filename = result.filename;
				var svg = result.svg;
				var className = result.className;

				elementUnitWidth = roundUpToUnit(svg.info.width);
				if (spriteHeight < svg.info.height) {
					spriteHeight = svg.info.height;
				}
				spriteData.elements.push({
					className: className,
					width: Math.ceil(svg.info.width),
					height: svg.info.height,
					x: x
				});
				elements.push(svgutil.transform(svg.data, x, 0));
				x += elementUnitWidth + unit;
			});

			x = roundUpToUnit(x);
			spriteHeight = roundUpToUnit(spriteHeight);
			spriteData.width = x;
			spriteData.height = spriteHeight;

			var filepath = path.relative(process.cwd(), config.spritePath + "/" + joinName(config.prefix, spriteName, "sprite") + ".svg");
			fs.writeFileSync(filepath, svgutil.wrap(x, spriteHeight, elements), "utf8");

			callback(null, spriteData);
		});
	}

	// build fallback pngs for all sizes

	function buildPNGSprites (err, sprite) {
		var pngSpritesToBuild = [];
		var sizeLabel, size;
		var refSize = (typeof config.refSize == "string") ? config.sizes[config.refSize] : config.refSize;

		//_.forOwn(sprites, function (sprite, spriteName) {

			_.forOwn(config.sizes, function (size, sizeLabel) {
				var pngPath = config.spritePath + "/" + joinName(config.prefix, spriteName, sizeLabel, "sprite") + ".png";
				var width = scaleValue(sprite.width, size, refSize);
				var height = scaleValue(sprite.height, size, refSize);

				sprite.sizes[sizeLabel] = {
					path: pngPath,
					width: width,
					height: height
				};

				pngSpritesToBuild.push(function (callback) {
					buildPNGSprite(sprite.path, pngPath, width, height, callback);
				});
			});

		//});

		async.parallel(pngSpritesToBuild, function (err, result) {
			if (config.cssPath) {
				buildCSS(sprite);
			}
			else {
				callback(null, "sprites built");
			}
		});

	}

	function quotePaths(path) {
		path
	}

	function buildPNGSprite (input, output, width, height, callback) {

		var script = path.join(__dirname, "lib/phantomjs-sprite-renderer.js");

		var args = [script, path.join(process.cwd(), input).replace(/\\/g, "/"), path.join(process.cwd(), output).replace(/\\/g, "/"), width, height];

		execFile(phantomjs, args,  {
				cwd: __dirname,
				//timeout: 5000,
				maxBuffer: 5000*1024 // png data gets quite large
			}, function (error, stdout, stderr) {
			if (error) {
				console.error("Error", error);
			}
			else if (stderr) {
				console.error("Stderr", stderr);
			}
			else if (stdout) {
				console.log(stdout);
			}
			callback(null, output);
		});

	}


	function buildCSS (sprite) {

		var cssElementRule = "\n\
{selector} {\n\
	width: {width}px;\n\
	height: {height}px;\n\
	background-position: -{x}px 0;\n\
}\n\
";
		var cssSpriteRule = "\n\
{selector} {\n\
	background-image: url({spriteUrl});\n\
	background-size: {width}px {height}px;\n\
}\n\
";
		var cssSVGSpriteImageRule = "\n\
{selector} {\n\
	background-image: url({spriteUrl});\n\
}\n\
";

		var css = "";
		var refSize = (typeof config.refSize == "string") ? config.sizes[config.refSize] : config.refSize;


		var svgSelectors = [];

		_.forOwn(config.sizes, function (size, sizeLabel) {
			var spriteSelectors = [];

			sprite.elements.forEach(function (element) {
				var className = makeClassName(element.className, sizeLabel);
				spriteSelectors.push(className);
				svgSelectors.push(className);
				css += substitute(cssElementRule, {
					selector: className,
					width: scaleValue(element.width, size, refSize),
					height: scaleValue(element.height, size, refSize),
					x: scaleValue(element.x, size, refSize)
				});
			});

			var pngSprite = sprite.sizes[sizeLabel];

			// set image and size for png
			css += substitute(cssSpriteRule, {
				selector: spriteSelectors.join(",\n"),
				spriteUrl: path.relative(config.cssPath, pngSprite.path).replace(/\\/g, "/"),
				width: pngSprite.width,
				height: pngSprite.height
			});
		});

		// set image for svg
		css += substitute(cssSVGSpriteImageRule, {
			selector: ".svg " + svgSelectors.join(",\n.svg "),
			spriteUrl: path.relative(config.cssPath, sprite.path).replace(/\\/g, "/")
		});

		var cssFileName = config.cssPath + "/" + joinName(config.cssPrefix, config.name, "sprites") + "." + config.cssSuffix;
		var filepath = path.relative(process.cwd(), cssFileName).replace(/\\/g, "/");
		var pathToFile = filepath.replace(/\/[^\/]+$/, "");

		if (!fs.existsSync(pathToFile)) {
			fsutil.mkdirRecursive(pathToFile);
		}
		fs.writeFileSync(filepath, css, "utf8");

		callback(null, "sprites built");

	}

	// functions

	function scaleValue (value, newSize, oldSize) {
		return Math.ceil(value * newSize / oldSize);
	}

	function roundUpToUnit (num) {
		var dif = num % unit;
		return (dif) ? num + unit - dif : num;
	}

	function joinName () {
		var args = [].slice.call(arguments);
		return args.filter(function(arg){ return !!arg; }).join("-");
	}

	function makeClassName (string, sizeLabel) {

		if (string.indexOf("{size}") > -1) {
			string = substitute(string, {size: sizeLabel});
		}
		else {
			string += "-" + sizeLabel;
		}

		if (string[0] != "." && string.indexOf(config.prefix) != 0) {
			string = config.prefix + "-" + string;
		}

		return ((string[0] != ".") ? "." : "") + string;
	}

	function substitute (string, object) {
		return string.replace(/\{([a-zA-Z}]+)\}/g, function (match, token) {
			return (token in object) ? object[token]: match;
		});
	}

};