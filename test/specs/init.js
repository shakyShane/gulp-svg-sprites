"use strict";

var File       = require("vinyl");
var assert     = require("chai").assert;
var svgSprites = require("../../index");
/**
 * @param {Stream} stream
 * @param {Function} cb
 */
function streamHelper(stream, cb) {

    var actual = {};

    stream.on("data", function (file) {
        if (typeof file === "string") {
            actual[file] = null;
        } else {
            actual[file.path] = file.contents.toString();
        }
    }).on("end", function () {
        cb(actual);
    });

    /**
     * Write 2 files to the stream
     */
    stream.write(new File({
        cwd:  "test/fixtures",
        base: "./",
        path: "unicorn.svg",
        contents: new Buffer("<svg version='1.1' baseProfile='full' width='300' height='200' xmlns='http://www.w3.org/2000/svg'><g></g></svg>")
    }));
    stream.write(new File({
        cwd:  "test/fixtures",
        base: "./",
        path: "facebook.svg",
        contents: new Buffer("<svg version='1.1' baseProfile='full' width='100' height='70' xmlns='http://www.w3.org/2000/svg'><g></g></svg>")
    }));

    /**
     * End the stream to allow tests to start
     */
    stream.end();
}

module.exports = streamHelper;

/**
 * @param config
 * @param expected
 * @param done
 */
module.exports.streamTester = function (config, expected, done) {
    streamHelper(svgSprites(config), function (data) {
        assert.deepEqual(Object.keys(data), expected);
        done();
    });
};