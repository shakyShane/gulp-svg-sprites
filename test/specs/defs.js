"use strict";

var streamTester = require("./init").streamTester;

describe("Sending Correct files downstream", function () {

    it("sends DEFS files", function (done) {

        var config = {
            mode: "defs"
        };

        streamTester(config, [
            "svg/defs.svg",
            "loader.js",
            "defs.html"
        ], done);
    });
    it("sends DEFS files with custom name", function (done) {

        var config = {
            mode: "defs",
            svg: {
                defs: "def.svg"
            }
        };

        streamTester(config, [
            "def.svg",
            "loader.js",
            "defs.html"
        ], done);
    });
    it("sends DEFS files with NO PREVIEW", function (done) {

        var config = {
            mode: "defs",
            preview: false
        };

        streamTester(config, [
            "svg/defs.svg",
            "loader.js"
        ], done);
    });
    it("sends DEFS files with Custom PREVIEW", function (done) {

        var config = {
            mode: "defs",
            preview: {
                defs: "index.html"
            }
        };

        streamTester(config, [
            "svg/defs.svg",
            "loader.js",
            "index.html"
        ], done);
    });
    it("sends DEFS files with NO LOADER", function (done) {

        var config = {
            mode: "defs",
            loader: false
        };

        streamTester(config, [
            "svg/defs.svg",
            "defs.html"
        ], done);
    });
    it("sends DEFS files with NO LOADER and NO PREVIEW", function (done) {

        var config = {
            mode: "defs",
            preview: false,
            loader: false
        };

        streamTester(config, [
            "svg/defs.svg"
        ], done);
    });
    it("sends DEFS files with Custom LOADER", function (done) {

        var config = {
            mode: "defs",
            loader: "customLoader.js"
        };

        streamTester(config, [
            "svg/defs.svg",
            "customLoader.js",
            "defs.html"
        ], done);
    });
});
