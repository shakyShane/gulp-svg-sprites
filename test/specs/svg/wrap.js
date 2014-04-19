"use strict";

var svgUtils         = require("../../../lib/svg-utils");
var wrap             = svgUtils.wrap;
var prefix           = svgUtils.templates.prefix;

var assert           = require("chai").assert;

/* jshint ignore:start */
var mockItems = ['<g id="item1"></g>', '<g id="item2"></g>'];

describe("Wrapping SVGs", function(){
    var config;
    beforeEach(function () {
        config = {};
    });
    it("should wrap in sprite output", function() {
        var actual   = wrap(1000, 200, mockItems, config);
        var expected = prefix + '<svg baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="1000" height="200" preserveAspectRatio="xMaxYMax meet" viewBox="0 0 1000 200"><g id="item1"></g><g id="item2"></g></svg>';
        assert.equal(actual, expected);
    });
    it("should wrap in DEF output if enabled in config", function() {
        config.defs = true;
        var actual   = wrap(1000, 200, mockItems, config);
        var expected = '<svg><defs><g id="item1"></g><g id="item2"></g></defs></svg>';
        assert.equal(actual, expected);
    });
    it("should wrap in DEF output & be hidden if enabled in config", function() {
        config.defs    = true;
        config.hideSvg = true;
        var actual   = wrap(1000, 200, mockItems, config);
        var expected = '<svg style="display:none"><defs><g id="item1"></g><g id="item2"></g></defs></svg>';
        assert.equal(actual, expected);
    });
});
/* jshint ignore:end */
