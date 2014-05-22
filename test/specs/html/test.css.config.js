"use strict";

var svgSprites   = require("../../../index");
var streamHelper = require("../init");

var assert       = require("chai").assert;

describe("Creating CSS Previews", function () {

    var stream, expected, actual, config;

    before(function (done) {

        config = {
            generatePreview: false,
            generateCSS: false
        };

        stream = svgSprites.svg(config);
        expected = ["sprites/svg-sprite.svg"];

        streamHelper(stream, function (data) {
            actual = data;
            done();
        });
    });

    it("should not generate a CSS file when generateCSS: false", function () {
        assert.deepEqual(Object.keys(actual), expected);
    });
});