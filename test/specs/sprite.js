"use strict";

var streamTester = require("./init").streamTester;

describe("Sending Correct files downstream", function () {

    it("sends default files with no config", function (done) {

        streamTester({}, [
            "svg/sprite.svg",
            "css/sprite.css",
            "sprite.html"
        ], done);
    });
    it("sends default files with no PREVIEW", function (done) {

        streamTester({preview: false}, [
            "svg/sprite.svg",
            "css/sprite.css"
        ], done);
    });
    it("sends default files with custom SVG file", function (done) {

        var config = {
            svg: {
                sprite: "all.svg"
            }
        };

        streamTester(config, [
            "all.svg",
            "css/sprite.css",
            "sprite.html"
        ], done);
    });
    it("sends default files with custom CSS file", function (done) {

        var config = {
            cssFile: "scss/_sprite.scss"
        };

        streamTester(config, [
            "svg/sprite.svg",
            "scss/_sprite.scss",
            "sprite.html"
        ], done);
    });
    it("sends default files with custom PREVIEW file", function (done) {

        var config = {
            preview: {
                sprite: "index.html"
            }
        };

        streamTester(config, [
            "svg/sprite.svg",
            "css/sprite.css",
            "index.html"
        ], done);
    });

    it("works with async transforms", function (done) {

        var config = {
            asyncTransforms: true
        };

        streamTester(config, [
            "svg/sprite.svg",
            "css/sprite.css",
            "sprite.html"
        ], done);
    });
});