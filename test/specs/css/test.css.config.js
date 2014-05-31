"use strict";

var svgSprites   = require("../../../index");
var streamHelper = require("../init");

var assert       = require("chai").assert;
var fs           = require("fs");

var cwd          = process.cwd();

var expectedCss     = fs.readFileSync(cwd + "/test/fixtures/expected/sprites.template.css", "utf-8");
var expectedPreview = fs.readFileSync(cwd + "/test/fixtures/expected/svg-sprite-template.html", "utf-8");

describe("Creating SVG Spritesheets", function () {

    var stream, expected, actual, config;

    before(function (done) {

        config = {
            className: ".svg-%f-icon",
            cssFile: "css/sprite-template.css"
        };

        stream = svgSprites.svg(config);
        expected = ["preview-svg-sprite.html", "sprites/svg-sprite.svg", "css/sprite-template.css"];

        streamHelper(stream, function (data) {
            actual = data;
            done();
        });
    });

    it("should pass the svgs, sprite & the CSS down stream", function () {
        assert.deepEqual(Object.keys(actual), expected);
    });
    it("should render CSS correctly", function () {
        assert.deepEqual(expectedCss, actual["css/sprite-template.css"]);
    });
});