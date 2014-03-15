"use strict";

var utils    = require("./utils");

/**
 * @param sprite
 * @param config
 * @returns {string}
 */
module.exports.render = function (sprite, config) {

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

    var svgSelectors = [];

        var spriteSelectors = [];

        sprite.elements.forEach(function (element) {
            var className = utils.makeClassName(element.className, config.prefix, config.classNameSuffix);
            spriteSelectors.push(className);
            svgSelectors.push(className);
            css += utils.substitute(cssElementRule, {
                selector: className,
                width: utils.scaleValue(element.width),
                height: utils.scaleValue(element.height),
                x: utils.scaleValue(element.x)
            });
        });

        // set image and size for png
        css += utils.substitute(cssSpriteRule, {
            selector: ".no-svg " + spriteSelectors.join(",\n.no-svg "),
            spriteUrl: config.pngPath,
            width: utils.scaleValue(sprite.width),
            height: utils.scaleValue(sprite.height)
        });

    // set image for svg
    css += utils.substitute(cssSVGSpriteImageRule, {
        selector: svgSelectors.join(",\n"),
        spriteUrl: config.svgPath
    });

    return css;

};