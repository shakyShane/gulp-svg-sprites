"use strict";

var utils          = require("../../../lib/css-utils");
var makePath       = utils.makePath;
var cleanClassName = utils.cleanClassName;

var assert         = require("chai").assert;

describe("makeClassName(): ", function () {
    it("should create class names", function () {
        var template = ".%f-icon";
        var name     = "facebook";
        var actual   = utils.makeClassName(template, name);
        var expected =  ".facebook-icon";
        assert.equal(actual, expected);
    });
    it("should create class names", function () {
        var template = ".%f";
        var name     = "facebook";
        var actual   = utils.makeClassName(template, name);
        var expected =  ".facebook";
        assert.equal(actual, expected);
    });
    it("should create class names from a callback", function () {
        var template = function (name) {
            return name;
        };
        var name     = "facebook";
        var actual   = utils.makeClassName(template, name);
        var expected =  ".facebook";
        assert.equal(actual, expected);
    });
    it("should create class names from a callback", function () {
        var template = function (name) {
            return name + "-icon";
        };
        var name     = "facebook";
        var actual   = utils.makeClassName(template, name);
        var expected =  ".facebook-icon";
        assert.equal(actual, expected);
    });
    it("should create class names from a callback", function () {
        var template = function (name) {
            return name + "-icon";
        };
        var name     = "facebook";
        var actual   = utils.makeClassName(template, name);
        var expected =  ".facebook-icon";
        assert.equal(actual, expected);
    });
    it("should create class names from a callback", function () {
        var config = {
            prefix: "svg"
        };
        var template = function (name, config) {
            return config.prefix + "-"  + name + "-icon";
        };
        var name     = "facebook";
        var actual   = utils.makeClassName(template, name, config);
        var expected =  ".svg-facebook-icon";
        assert.equal(actual, expected);
    });
});
describe("cleanClassName(): ", function () {
    it("should accept valid classnames", function () {
        var actual   = cleanClassName(".shane");
        var expected = ".shane";
        assert.equal(actual, expected);
    });
    it("should accept valid classnames", function () {
        var actual   = cleanClassName("._82342");
        var expected = "._82342";
        assert.equal(actual, expected);
    });
    it("should clean classnames starting with numbers", function () {
        var actual   = cleanClassName(".82342");
        var expected = "._82342";
        assert.equal(actual, expected);
    });
    it("should return false if class contains invalid", function () {
        var actual   = cleanClassName(".82342-12");
        var expected = "._82342-12";
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