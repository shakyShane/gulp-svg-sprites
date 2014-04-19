"use strict";

var svgSprites   = require("../../../index");
var streamHelper = require("../init-defs");

var assert       = require("chai").assert;
var fs           = require("fs");

var cwd          = process.cwd();

var expectedDefsPreview = fs.readFileSync(cwd + "/test/fixtures/expected/svg-defs.html", "utf-8");
var expectedDefs        = fs.readFileSync(cwd + "/test/fixtures/expected/defs.css", "utf-8");


describe("Creating SVG DEFS", function () {

    var stream, expectedFiles, actual;

    before(function (done) {

        stream = svgSprites.svg({
            defs: true,
            svgFile: "defs/defs.php"
        });

        expectedFiles = ["preview-svg-sprite.html", "defs/defs.php", "css/sprites.css"];

        streamHelper(stream, function (data) {
            actual = data;
            done();
        });
    });

    it("should pass the svgs, sprite & the CSS down stream", function () {
        assert.deepEqual(Object.keys(actual), expectedFiles);
    });
    it("should render CSS correctly", function () {
        assert.deepEqual(expectedDefs, actual["css/sprites.css"]);
    });
});