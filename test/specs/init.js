"use strict";

var svgSprites  = require("../../index");
var assert      = require("chai").assert;
var fs          = require("fs");
var expectedCss = fs.readFileSync(process.cwd() + "/test/fixtures/expected/sprites.css", "utf-8");
var File        = require("vinyl");

describe("Creating SVG Spritesheets", function () {

    var stream, expected, actual;
    before(function (done) {

        stream = svgSprites.svg();
        expected = ["sprites/svg-sprite.svg", "css/sprites.css"];
        actual   = {};

        stream.on("data", function (file) {
            if (typeof file === "string") {
                actual[file] = null;
            } else {
                actual[file.path] = file.contents.toString();
            }
        }).on("end", function () {
            done();
        });

        /**
         * Write 2 files to the stream
         */
        stream.write(new File({
            cwd:  "test/fixtures",
            base: "./",
            path: "unicorn.svg",
            contents: new Buffer("<svg version='1.1' baseProfile='full' width='300' height='200' xmlns='http://www.w3.org/2000/svg'></svg>")
        }));
        stream.write(new File({
            cwd:  "test/fixtures",
            base: "./",
            path: "facebook.svg",
            contents: new Buffer("<svg version='1.1' baseProfile='full' width='100' height='70' xmlns='http://www.w3.org/2000/svg'></svg>")
        }));

        /**
         * End the stream to allow tests to start
         */
        stream.end();
    });

    it("should pass the svgs, sprite & the CSS down stream", function () {
        assert.deepEqual(Object.keys(actual), expected);
    });
    it("should render CSS correctly", function () {
        assert.deepEqual(expectedCss, actual["css/sprites.css"]);
    });
});