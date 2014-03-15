"use strict";

var utils          = require("../../../lib/css-utils");
var substitute     = utils.substitute;
var cleanClassName = utils.cleanClassName;

var templates      = require("../../../lib/css-render").templates;

var assert         = require("chai").assert;

describe("makeClassName(): ", function () {
    it("should create class names", function () {
        var actual = utils.makeClassName("facebook", "", "icon");
        var expected =  ".facebook-icon";
        assert.equal(actual, expected);
    });
    it("should create class names", function () {
        var actual = utils.makeClassName("12345", "", "icon");
        var expected =  "._12345-icon";
        assert.equal(actual, expected);
    });
    it("should create class names", function () {
        var actual = utils.makeClassName("facebook", "svg", "icon");
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
            width: 12,
            height: 13,
            x: 54
        };
        var actual   = substitute(template, params);
        var expected = "\n.shane {\n\twidth: 12px;\n\theight: 13px;\n\tbackground-position: -54px 0;\n}\n";
        assert.equal(actual, expected);
    });
});