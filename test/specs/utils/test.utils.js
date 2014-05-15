"use strict";

var utils           = require("../../../lib/utils");
var substitute      = utils.substitute;
var roundUpToUnit   = utils.roundUpToUnit;
var joinName        = utils.joinName;
var swapFileName    = utils.swapFileName;
var makePath        = utils.makePath;

var templates      = require("../../../lib/css-render").templates;

var assert          = require("chai").assert;

describe("String Utils:", function () {
    describe("joinName():", function () {
        it("should join sections correctly", function () {
            var actual   = joinName("one");
            var expected = "one";
            assert.equal(actual, expected);
        });
        it("should join sections correctly", function () {
            var actual   = joinName("one", "two", "three");
            var expected = "one-two-three";
            assert.equal(actual, expected);
        });
        it("should join sections correctly", function () {
            var actual   = joinName("one", "two");
            var expected = "one-two";
            assert.equal(actual, expected);
        });
    });
    describe("roundUpToUnit():", function () {
        it("should round up", function () {
            var actual   = roundUpToUnit(300, 10);
            var expected = 300;
            assert.equal(actual, expected);
        });
        it("should round up", function () {
            var actual   = roundUpToUnit(301, 10);
            var expected = 310;
            assert.equal(actual, expected);
        });
        it("should round up", function () {
            var actual   = roundUpToUnit(309, 10);
            var expected = 310;
            assert.equal(actual, expected);
        });
        it("should round up", function () {
            var actual   = roundUpToUnit(311, 10);
            var expected = 320;
            assert.equal(actual, expected);
        });
        it("should round up", function () {
            var actual   = roundUpToUnit(311, 2);
            var expected = 312;
            assert.equal(actual, expected);
        });
    });
    describe("swapFileName():", function () {
        it("should replace svg with png", function(){
            var actual   = swapFileName("assets/svg-sprite.svg");
            var expected = swapFileName("assets/png-sprite.png");
            assert.equal(actual, expected);
        });
        it("should replace svg with png", function(){
            var actual   = swapFileName("assets/svg.svg");
            var expected = swapFileName("assets/png.png");
            assert.equal(actual, expected);
        });
        it("should replace svg with png", function(){
            var actual   = swapFileName("svg.svg");
            var expected = swapFileName("png.png");
            assert.equal(actual, expected);
        });
    });
});

describe("substitute(): CSS ELEMENT", function () {
    it("can render", function () {
        var template = "{:selector:}";
        var actual   = substitute(template, {selector:"shane"});
        var expected = "shane";
        assert.equal(actual, expected);
    });
    it("can render", function () {
        var template = templates.cssElement;
        var params = {
            selector: ".shane",
            width: 1.2,
            height: 1.3,
            relativex: 54,
            backgroundSize: 100
        };
        var actual   = substitute(template, params);
        var expected = "\n.shane:before {\n\twidth: 1.2em;\n\theight: 1.3em;\n\tbackground-position: 54% 0;\n\tbackground-size: auto 100%;\n}\n";
        assert.equal(actual, expected);
    });
});


describe("makePath(): ", function () {
    it("Should make a file path", function () {
        var template = "../%f";
        var svgFile  = "sprites/svg-sprite.svg";
        var actual   = makePath(template, svgFile);
        var expected = "../sprites/svg-sprite.svg";
        assert.equal(actual, expected);
    });
    it("Should make a file path from function", function () {
        var template = function (svgfile, config) {
            var sections = svgfile.split("/");
            return "dist/" + sections[1];
        };
        var svgFile  = "sprites/svg-sprite.svg";
        var actual   = makePath(template, svgFile);
        var expected = "dist/svg-sprite.svg";
        assert.equal(actual, expected);
    });
});