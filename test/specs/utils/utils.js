"use strict";

var utils           = require("../../../lib/utils");
var roundUpToUnit   = utils.roundUpToUnit;
var joinName        = utils.joinName;
var swapFileName    = utils.swapFileName;
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