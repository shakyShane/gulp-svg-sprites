var fs = require("fs"),
	path = require("path"),
	SVGO = require("svgo");

var svgo = new SVGO();

function loadShape (file, callback) {
	var _file = path.relative(process.cwd(), file);
	fs.readFile(_file, "utf8", function (err, data) {
		svgo.optimize(data, function (result) {
			result.data = result.data.replace(/^<svg[^>]+>|<\/svg>$/g, "");
			result.info.width = parseFloat(result.info.width);
			result.info.height = parseFloat(result.info.height);
			callback(null, result);
		});
	});
}

function loadShapeRaw (file, callback) {
	fs.readFile(file, "utf8", function (err, data) {
		var widthMatch = data.match(/ width="(\d+)/),
			heightMatch = data.match(/ height="(\d+)/),
			result = {
				data: data.replace(/^<svg[^>]+>|<\/svg>$/g, ""),
				info: {
					width: parseFloat(widthMatch[1]),
					height: parseFloat(heightMatch[1])
				}
			};
		callback(null, result);
	});
}

function transform (data, x, y, fill) {
	if (x == 0 && y == 0) {
		return data;
	}
	if (data != data.match(/^<g>(?:.*?)<\/g>/)) {
		data = "<g>" + data + "</g>";
	}
	var attributes = " transform=\"translate(" + x + ( y ? " " + y : "" ) + ")\"";
	if (fill) {
		if (data.match(/fill="/)) {
			data = data.replace(/(fill=")[^"]+(")/g, "$1" + fill + "$2");
		}
		else {
			attributes += " fill=\"" + fill + "\"";
		}
	}
	data = data.replace(/^<g/, "<g" + attributes);
	return data;
}

function wrap (width, height, shapes) {
	return '<svg baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" preserveAspectRatio="xMaxYMax meet" viewBox="0 0 ' + width + ' ' + height + '" >' + shapes.join("") + '</svg>';
}

module.exports.loadShape = loadShape;

module.exports.loadShapeRaw = loadShapeRaw;

module.exports.transform = transform;

module.exports.wrap = wrap;