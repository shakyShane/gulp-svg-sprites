"use strict";

var utils    = require("./utils");
var cssUtils = require("./css-utils");

/**
 * @type {{cssElement: string, cssSprite: string, cssSpriteImage: string}}
 */
module.exports.templates = {
    cssElement:     "\n{:selector:} {\n\twidth: {:width:}px;\n\theight: {:height:}px;\n\tbackground-position: -{:x:}px 0;\n}\n",
    cssSprite:      "\n{:selector:} {\n\tbackground-image: url(\"{:spriteUrl:}\");\n\tbackground-size: {:width:}px {:height:}px;\n}\n",
    cssSpriteImage: "\n{:selector:} {\n\tbackground-image: url(\"{:spriteUrl:}\");\n}\n"
};

/**
 * @param sprite
 * @param config
 * @returns {string}
 */
module.exports.render = function (sprite, config) {

    var css = "";
    var svgSelectors = [];
    var spriteSelectors = [];

    sprite.elements.forEach(function (element) {
        var className = cssUtils.makeClassName(config.className, element.className, config);
        spriteSelectors.push(className);
        svgSelectors.push(className);
        css += exports.renderClass(exports.templates.cssElement, className, element);
    });

    // Render PNG CSS
    css += exports.renderPng(
        exports.templates.cssSprite,
        spriteSelectors,
        sprite,
        cssUtils.makePath(config.pngPath, utils.swapFileName(sprite.path), config)
    );

    // Render SVG CSS
    css += exports.renderSvg(
        exports.templates.cssSpriteImage,
        svgSelectors,
        cssUtils.makePath(config.svgPath, sprite.path, config)
    );

    return css;
};

/**
 * @param cssSpriteRule
 * @param spriteSelectors
 * @param sprite
 * @returns {XML|string|void|*}
 */
module.exports.renderPng = function (cssSpriteRule, spriteSelectors, sprite, path) {
    return cssUtils.substitute(cssSpriteRule, {
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
    return cssUtils.substitute(cssSVGSpriteImageRule, {
        selector: svgSelectors.join(",\n"),
        spriteUrl: path
    });
};

/**
 * @param cssElementRule
 * @param className
 * @param element
 * @returns {XML|string|void|*}
 */
module.exports.renderClass = function (cssElementRule, className, element) {
    return cssUtils.substitute(cssElementRule, {
        selector: className,
        width: utils.scaleValue(element.width),
        height: utils.scaleValue(element.height),
        x: utils.scaleValue(element.x)
    });
};
