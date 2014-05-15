"use strict";

var utils    = require("./utils");
var cssUtils = require("./css-utils");

/**
 * @type {{cssElement: string, cssSprite: string, cssSpriteImage: string}}
 */
module.exports.templates = {
    cssElement:     "\n{:selector:}:before {\n\twidth: {:width:}em;\n\theight: {:height:}em;\n\tbackground-position: {:relativex:}% 0;\n\tbackground-size: auto {:backgroundSize:}%\n}\n",
    cssSprite:      "\n{:selector:} {\n\tbackground-image: url(\"{:spriteUrl:}\");\n}\n",
    cssSize:        "\n{:selector:} {\n\tfont-size:10px;\n}\n",
    cssSpriteImage: "\n{:selector:} {\n\tcontent:' ';\n\tdisplay:block;\n\tvertical-align:middle;\n\tdisplay: inline-block;\n\tbackground-image: url(\"{:spriteUrl:}\");\n\tbackground-repeat: no-repeat;\n}\n",
    cssDefs:        "\n{:selector:} {\n\twidth: {:width:}em;\n\theight: {:height:}em;\n}\n"
};

/**
 * @param sprite
 * @param config
 * @returns {string}
 */
module.exports.render = function (sprite, config) {

    var css = "";
    var templates = exports.templates;
    var svgSelectors = [];
    var spriteSelectors = [];
    var template = config.defs ? templates.cssDefs : templates.cssElement;

    var data = sprite.elements.map(function (element) {
        var className = element.className = cssUtils.makeClassName(config.className, element.className, config);
        element.name = className.replace(".", "");
        spriteSelectors.push(className);
        svgSelectors.push(className);

        // left = (container_width - image_width) * percentage
        element.relativex = -1 * (element.x / (element.width - sprite.width) * 100);
        element.backgroundSize = (sprite.height / element.height) * 100;

        css += exports.renderClass(template, element);
        return element;
    });

    if (!config.defs) {
        // Render font size selector
        css += exports.renderSize(templates.cssSize, spriteSelectors);

        // Render PNG CSS
        css += exports.renderPng(
            templates.cssSprite,
            spriteSelectors,
            sprite,
            utils.makePath(config.pngPath, utils.swapFileName(sprite.path), config)
        );

        // Render SVG CSS
        css += exports.renderSvg(
            templates.cssSpriteImage,
            svgSelectors,
            utils.makePath(config.svgPath, sprite.path, config)
        );
    }

    return {
        content: css,
        elements: data,
        svgFile: utils.makePath(config.svgPath, sprite.path, config)
    };
};

/**
 * @param cssSpriteRule
 * @param spriteSelectors
 * @param sprite
 * @returns {XML|string|void|*}
 */
module.exports.renderPng = function (cssSpriteRule, spriteSelectors, sprite, path) {
    return utils.substitute(cssSpriteRule, {
        selector: ".no-svg " + spriteSelectors.map(function (el){ return el + ":before" }).join(",\n.no-svg "),
        spriteUrl: path,
        width: utils.scaleValue(sprite.width),
        height: utils.scaleValue(sprite.height)
    });
};

/**
 * @param cssSVGSpriteImageRule
 * @param svgSelectors
 * @param path
 * @returns {XML|string|void|*}
 */
module.exports.renderSvg = function (cssSVGSpriteImageRule, svgSelectors, path) {
    return utils.substitute(cssSVGSpriteImageRule, {
        selector: svgSelectors.map(function (el){ return el + ":before" }).join(",\n"),
        spriteUrl: path
    });
};

/**
 * @param cssElementRule
 * @param element
 * @returns {XML|string|void|*}
 */
module.exports.renderClass = function (cssElementRule, element) {
    return utils.substitute(cssElementRule, {
        selector: element.className,
        width: utils.scaleValue(element.width) / 10,
        height: utils.scaleValue(element.height) / 10,
        relativex: element.relativex,
        backgroundSize: element.backgroundSize
    });
};

module.exports.renderSize = function (template, selectors) {
    return utils.substitute(template, {
        selector: selectors.join(",\n")
    });
};
