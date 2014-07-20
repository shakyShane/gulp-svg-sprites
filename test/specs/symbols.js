"use strict";

var streamTester = require("./init").streamTester;

describe("Sending Correct files downstream", function () {

    it("sends Symbols files", function (done) {

        var config = {
            mode: "symbols"
        };

        streamTester(config, [
            "svg/symbols.svg",
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
            "symbols.html"
        ], done);
    });
    it("sends Symbols files with NO PREVIEW", function (done) {

        var config = {
            mode: "symbols",
            preview: false
        };

        streamTester(config, [
            "svg/symbols.svg"
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
            "index.html"
        ], done);
    });
});