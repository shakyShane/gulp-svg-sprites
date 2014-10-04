"use strict";

var streamTester = require("./init").streamTester;

describe("Sending Correct files downstream", function () {

    it("sends Symbols files", function (done) {

        var config = {
            mode: "symbols"
        };

        streamTester(config, [
            "svg/symbols.svg",
            "loader.js",
            "symbols.html"
        ], done);
    });
    it("sends Symbols files", function (done) {

        var config = {
            mode: "symbols",
            svg: {
                symbols: "sym.svg"
            }
        };

        streamTester(config, [
            "sym.svg",
            "loader.js",
            "symbols.html"
        ], done);
    });
    it("sends Symbols files with NO PREVIEW", function (done) {

        var config = {
            mode: "symbols",
            preview: false
        };

        streamTester(config, [
            "svg/symbols.svg",
            "loader.js"
        ], done);
    });
    it("sends Symbols files with Custom preview", function (done) {

        var config = {
            mode: "symbols",
            preview: {
                symbols: "index.html"
            }
        };

        streamTester(config, [
            "svg/symbols.svg",
            "loader.js",
            "index.html"
        ], done);
    });
        it("sends DEFS files with NO LOADER", function (done) {

        var config = {
            mode: "symbols",
            loader: false
        };

        streamTester(config, [
            "svg/symbols.svg",
            "symbols.html"
        ], done);
    });
    it("sends DEFS files with NO LOADER and NO PREVIEW", function (done) {

        var config = {
            mode: "symbols",
            preview: false,
            loader: false
        };

        streamTester(config, [
            "svg/symbols.svg"
        ], done);
    });
    it("sends DEFS files with Custom LOADER", function (done) {

        var config = {
            mode: "symbols",
            loader: "customLoader.js"
        };

        streamTester(config, [
            "svg/symbols.svg",
            "customLoader.js",
            "symbols.html"
        ], done);
    });
});
