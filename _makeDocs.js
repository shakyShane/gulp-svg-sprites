var fs           = require("fs");
var cp           = require("child_process");
var doc          = "./doc/yuidoc.json";
var _            = require("lodash");
_.templateSettings.interpolate = /{:([\s\S]+?):}/g;

//var mdTemp          = _.template(fs.readFileSync("./_docs/api.md", "utf-8"));
//var optTemp         = _.template(fs.readFileSync("./_docs/options.md", "utf-8"));
//var commandLineTemp = _.template(fs.readFileSync("./_docs/command-line.md", "utf-8"));


var excluded = [
    "use"
];


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
        });

    console.log(options);

//
//    fs.writeFileSync("./docs/api.md", mdTemp({data: apiItems}));
//
//    /**
//     * Process OPTIONS
//     */
//    var optItems = docGen.prepareOptions(data.classitems)
//        .reduce(optionsMarkup, "");
//
//    fs.writeFileSync("./docs/options.md", optTemp({data: optItems}));
//
//    /**
//     * Process Command-line args
//     */
//
//    var commands = require("./_includes/snippets/commands/commands.json");
//
//    var formattedCommands = _.map(commands, function (value, key) {
//        return {
//            title: key,
//            items: value
//        }
//    });
//
//
//    var commandOpts = docGen.prepareCommandLineOptions(opts);
//    var temp = getTemplate("command-line")({options: commandOpts, examples: formattedCommands});
//
//    fs.writeFileSync("./docs/command-line.md", commandLineTemp({
//        data: temp
//    }));

});

/**
 * Resolve path to snippets
 * @param name
 * @param path
 * @returns {string}
 */
function getSnippetPath(name, path) {
    return "./_includes/snippets/%p/%s.js".replace("%s", name).replace("%p", path);
}

/**
 * Don't allow any method that are present in 'excluded' list
 * @param item
 * @returns {*}
 */
function removeExcluded(item) {
    return !_.contains(excluded, item.name);
}

/**
 * Final tweaks to preview snippet
 * @param item
 * @returns {*}
 */
function previewTweaks(item) {
    if (item.name === "browserSync") {
        item.preview = item.preview.replace(".", "");
    }
    return item;
}

/**
 * Build the markup for each item
 * @param combined
 * @param item
 * @returns {*}
 */
function buildMarkup (combined, item) {

    item.snippet = getSnippet(item, "api");

    if (!item.description) {
        item.description = "";
    } else {
        item.description = marked(item.description);
    }

    if (item.params) {
        item.params = item.params.map(fixDescription);
    }

    return combined + getTemplate("api")(item);
}

/**
 * @param item
 * @returns {*}
 */
function fixDescription(item) {

    if (item.description) {
        item.description = marked(item.description);
    } else {
        item.description = "";
    }

    return item;
}

/**
 * Build the markup for each item
 * @param combined
 * @param item
 * @returns {*}
 */
function optionsMarkup (combined, item) {

    item.snippet = getSnippet(item, "options");

    if (!item.description) {
        item.description = "";
    } else {
        item.description = marked(item.description);
    }

    return combined + getTemplate("option")(item);
}

/**
 * Look for related snippet
 * @param item
 * @param type
 * @returns {*}
 */
function getSnippet(item, type) {

    var snippet = null;

    try {

        var snippetPath = getSnippetPath(item.name, type);

        if (fs.existsSync(snippetPath)) {
            snippet = fs.readFileSync(snippetPath, "utf-8");
        }

    } catch (e) {

        console.log(e.message);

    }

    return snippet;
}
