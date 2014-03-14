var fs = require("fs"),
	webpage = require("webpage"),
	system = require("system");

phantom.onError = function (msg, trace) {
        var msgStack = ["PHANTOM ERROR: " + msg];
        if (trace && trace.length) {
                msgStack.push("TRACE:");
                trace.forEach(function (t) {
                        msgStack.push(" -> " + (t.file || t.sourceURL) + ": " + t.line + (t.function ? " (in function " + t.function + ")" : ""));
                });
        }
        system.stderr.write(msgStack.join("\n"));
        phantom.exit(1);
};

var	input = system.args[1],
	output = system.args[2],
	width = system.args[3],
	height = system.args[4];

var page = webpage.create();

page.viewportSize = {
	width: width,
	height: height
};

page.clipRect = { 
	top: 0,
	left: 0,
	width: width,
	height: height
};


page.onLoadFinished = function () {

	page.render(output);
	phantom.exit();
	
}


var html = "\
<!doctype html>\
<html>\
	<head>\
		<style>\
			* {\
				padding: 0;\
				margin: 0;\
			}\
			img {\
				display: block;\
			}\
		</style>\
	</head>\
	<body>\
		<img src=\"" + input.replace(/^.*\/([^\/]+)$/, "$1") + "\" width=\"" + width + "\" height=\"" + height + "\" />\
	</body>\
</html>\
";

var url = "file://" + input.replace(/^|\//, "/").replace(/(\/[^\/]+)$/, "/") + "index.html";

page.setContent(html, url);