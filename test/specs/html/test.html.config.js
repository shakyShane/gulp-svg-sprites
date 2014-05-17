"use strict";

var svgSprites   = require("../../../index");
var streamHelper = require("../init");

var assert       = require("chai").assert;
var fs           = require("fs");

var cwd          = process.cwd();

describe("Creating HTML Previews", function () {

    var stream, expected, actual, config;

    before(function (done) {

        config = {
            generatePreview: false
        };

        stream = svgSprites.svg(config);
        expected = ["sprites/svg-sprite.svg", "css/sprites.css"];

        streamHelper(stream, function (data) {
            actual = data;
            done();
        });
    });

    it("should no generate a preview when generatePreview when specified", function () {
        assert.deepEqual(Object.keys(actual), expected);
    });
});