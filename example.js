var builder = require("./index");

var options = {
    prefix: "",
    cssSuffix: "css",
    spritePath: "img/sprites"
};

options.spriteElementPath = "test/fixtures";

options.name = this.target;

builder(options, function () {
    console.log("Done.");
});
