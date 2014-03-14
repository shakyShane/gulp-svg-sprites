var fs = require("fs");

function getFiles (dir, type) {
	return getEntries(dir, type || "*");
}

function getDirs (dir) {
	return getEntries(dir, "dir");
}

function getEntries (dir, type) {
	var entries = fs.readdirSync(dir),
		entry,
		method = (type == "dir") ? "isDirectory" : "isFile",
		stat,
		i = 0,
		l = entries.length,
		result = [];
	
	while (i < l) {
		entry = entries[i];
		stat = fs.statSync(dir + "/" + entry);
		if (stat && stat[method]() && (!type || type == "dir" || entry.slice(-type.length) == type)) {
			result.push(entry);
		}
		i++;
	}
	
	return result;
}

function mkdirRecursive (dir) {
	if (dir && !fs.existsSync(dir)) {	
		var parent = dir.replace(/(^|\/)[^\/]*$/, "");
		if (dir != parent && parent && parent != "./" && parent != "../" && !fs.existsSync(parent)) {
			mkdirRecursive(parent);
		}
		fs.mkdirSync(dir);
	}
}

module.exports.getFiles = getFiles;

module.exports.getDirs = getDirs;

module.exports.mkdirRecursive = mkdirRecursive;