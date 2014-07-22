var fs           = require("fs");
var cp           = require("child_process");
var doc          = "./doc/yuidoc.json";
var marked       = require("marked");
var dust         = require("dustjs-linkedin");
dust.optimizers.format = function(ctx, node) { return node; };

var mdTemp            = fs.readFileSync("./tmpl/readme.txt", "utf-8");
var readme            = fs.readFileSync("./README.md", "utf-8");

/**
 * Build docs & run
 */
cp.spawn('gulp', ['docs'], {stdio: 'inherit'}).on('close', function () {

    var data = require(doc);

    /**
     * Process API
     */
    var options = data.classitems
        .filter(function (item) {
            return item.itemtype && item.itemtype === "property";
        })
        .map(function (item) {
            if (item.subprops) {
                item.subprops = item.subprops.map(function (sub) {
                    sub.name = item.name + "." + sub.name;
                    return sub;
                });
            }
            return item;
        })
        .map(function (item) {
            if (item.description) {
                item.description = marked(item.description);
            }
            return item;
        });

    dust.compileFn(mdTemp, "docs", false);

    dust.render("docs", {options: options}, function (err, out) {

        var newReadme = readme.replace(/(## Options\n)([\s\S]+?)(\n## License)/, function () {
            return arguments[1] + out + arguments[3];
        });

        fs.writeFileSync("./README.md", newReadme);
    });
});