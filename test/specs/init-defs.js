"use strict";

var File = require("vinyl");



/**
 * @param {Stream} stream
 * @param {Function} cb
 */
module.exports = function (stream, cb) {

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
        contents: new Buffer("<svg version='1.1' baseProfile='full' width='20' height='20' xmlns='http://www.w3.org/2000/svg'></svg>")
    }));
    stream.write(new File({
        cwd:  "test/fixtures",
        base: "./",
        path: "facebook.svg",
        contents: new Buffer("<svg version='1.1' baseProfile='full' width='30' height='30' xmlns='http://www.w3.org/2000/svg'></svg>")
    }));

    /**
     * End the stream to allow tests to start
     */
    stream.end();
};