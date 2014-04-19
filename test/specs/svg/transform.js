"use strict";

var svgUtils         = require("../../../lib/svg-utils");
var transform        = svgUtils.transform;
var createAttributes = svgUtils.createAttributes;

var assert           = require("chai").assert;

/* jshint ignore:start */
var input = '<g fill="#fff"><path d="M14"/></g>';

describe("Transforming svgs", function(){
    var obj, config;
    beforeEach(function () {
        obj = {
            data:     input,
            filename: "facebook",
            id: "svg-facebook"
        };
        config = {};
    });
    it("should add transform & ID attrs", function(){
        var actual   = transform(obj, 0, 0, config);
        var expected = '<g id="svg-facebook" transform="translate(0,0)" fill="#fff"><path d="M14"/></g>';
        assert.equal(actual, expected);
    });
    it("should only add & IDs when defs = true", function(){
        config.defs = true;
        var actual   = transform(obj, 0, 0, config);
        var expected = '<g id="svg-facebook" fill="#fff"><path d="M14"/></g>';
        assert.equal(actual, expected);
    });
    it("should wrap items in <g> tags if not present", function(){
        obj.data = '<path d="M14"/>';
        var actual   = transform(obj, 0, 0, config);
        var expected = '<g id="svg-facebook" transform="translate(0,0)"><path d="M14"/></g>';
        assert.equal(actual, expected);
    });
});

describe("Generating the attributes", function(){
    var svg;
    beforeEach(function () {
        svg = {
            id: "icon-facebook",
            x: 0,
            y: 0
        };
    });
    it("it should generate attributes for SVG item", function(){
        var actual   = createAttributes(svg, ["id", "transform"]);
        var expected = 'id="icon-facebook" transform="translate(0,0)"';
        assert.equal(actual, expected);
    });
    it("it should generate attributes for SVG item", function(){
        var actual   = createAttributes(svg, ["id"]);
        var expected = 'id="icon-facebook"';
        assert.equal(actual, expected);
    });
//    it("it should generate attributes for SVG item (2)", function(){
//        svg.id = "icon-twitter";
//        var actual   = createAttributes(svg);
//        var expected = 'id="icon-twitter" transform="translate(0,0)"';
//        assert.equal(actual, expected);
//    });
//    it("it should generate attributes for SVG item (3)", function(){
//        svg.x = 120;
//        var actual   = createAttributes(svg);
//        var expected = 'id="icon-facebook" transform="translate(120,0)"';
//        assert.equal(actual, expected);
//    });
//    it("it should generate attributes for SVG item (4)", function(){
//        svg.x = 200;
//        svg.y = 120;
//        var actual   = createAttributes(svg);
//        var expected = 'id="icon-facebook" transform="translate(200,120)"';
//        assert.equal(actual, expected);
//    });
});
/* jshint ignore:end */