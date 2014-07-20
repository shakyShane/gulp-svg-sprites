"use strict";

var streamTester = require("./init").streamTester;

describe("Sending Correct files downstream", function () {

    it("sends DEFS files", function (done) {

        var config = {
            mode: "defs"
        };

        streamTester(config, [
            "svg/defs.svg",
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
            "defs.html"
        ], done);
    });
    it("sends DEFS files with NO PREVIEW", function (done) {

        var config = {
            mode: "defs",
            preview: false
        };

        streamTester(config, [
            "svg/defs.svg"
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
            "index.html"
        ], done);
    });
});