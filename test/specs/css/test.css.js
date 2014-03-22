"use strict";

var svgSprites   = require("../../../index");
var streamHelper = require("../init");

var assert       = require("chai").assert;
var fs           = require("fs");

var cwd          = process.cwd();

var expectedCss     = fs.readFileSync(cwd + "/test/fixtures/expected/sprites.css", "utf-8");
var expectedPreview = fs.readFileSync(cwd + "/test/fixtures/expected/svg-sprite.html", "utf-8");

describe("Creating SVG Spritesheets", function () {

    var stream, expectedFiles, actual;

    before(function (done) {

        stream = svgSprites.svg();
        expectedFiles = ["preview-svg-sprite.html", "sprites/svg-sprite.svg", "css/sprites.css"];

        streamHelper(stream, function (data) {
            actual = data;
            done();
        });
    });

    it("should pass the svgs, sprite & the CSS down stream", function () {
        assert.deepEqual(Object.keys(actual), expectedFiles);
    });
    it("should render CSS correctly", function () {
        assert.deepEqual(expectedCss, actual["css/sprites.css"]);
    });
    it("should render HTML Preview correctly", function () {
        assert.deepEqual(expectedPreview, actual["preview-svg-sprite.html"]);
    });
});