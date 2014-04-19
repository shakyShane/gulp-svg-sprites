"use strict";

var utils    = require("./utils");
var cssUtils = require("./css-utils");

/**
 * @type {{cssElement: string, cssSprite: string, cssSpriteImage: string}}
 */
module.exports.templates = {
    cssElement:     "\n{:selector:} {\n\twidth: {:width:}px;\n\theight: {:height:}px;\n\tbackground-position: -{:x:}px 0;\n}\n",
    cssSprite:      "\n{:selector:} {\n\tdisplay: inline-block;\n\tbackground-image: url(\"{:spriteUrl:}\");\n\tbackground-size: {:width:}px {:height:}px;\n}\n",
    cssSpriteImage: "\n{:selector:} {\n\tdisplay: inline-block;\n\tbackground-image: url(\"{:spriteUrl:}\");\n\tbackground-repeat: no-repeat;\n}\n",
    cssDefs:        "\n{:selector:} {\n\twidth: {:width:}px;\n\theight: {:height:}px;\n}\n"
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
        css += exports.renderClass(template, element);
        return element;
    });

    if (!config.defs) {

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
        selector: ".no-svg " + spriteSelectors.join(",\n.no-svg "),
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
        selector: svgSelectors.join(",\n"),
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
        width: utils.scaleValue(element.width),
        height: utils.scaleValue(element.height),
        x: utils.scaleValue(element.x)
    });
};
