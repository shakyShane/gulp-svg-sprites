var compare = require("img-compare");
var fs  = require("vinyl-fs");
var svgSprites = require("../../index");
var svg2png = require("gulp-svg2png");
var filter = require("gulp-filter");
var assert = require("chai").assert;

var paths = {
    svgSrc: ["test/fixtures/basic/*.svg"],
    svgDest: "./test/fixtures/output"
};

var config = {
    mode: "sprite"
};

describe("checking visual differences", function () {
    this.timeout(10000);
    before(function (done) {
        fs.src("test/fixtures/basic/*.svg")
            .pipe(svgSprites(config))
            .pipe(fs.dest(paths.svgDest))
            .pipe(filter("**/*.svg"))
            .pipe(svg2png())
            .pipe(fs.dest(paths.svgDest))
            .on("close", done);
    });
    it("should work", function (done) {
        compare([
            "test/fixtures/output/svg/sprite.png",
            "test/fixtures/base-files/sprite.png"
        ], {
            output: "test/diff.png",
            threshold: 5
        }, function (err, out) {
            if (err) {
                done(err);
            } else {
                if (out.status !== "success") {
                    console.log(out);
                }
                assert.equal(out.status, "success");
                done();
            }
        });
    });
});