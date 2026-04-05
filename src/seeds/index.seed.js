// index.seed.js

const { getDirFilesPaths } = require("../services/utils.service");

async function runSeeders() {
	const files = await getDirFilesPaths(__dirname);

	for (let file of files) {
		if (!file.endsWith(".seed.js") || /index/gi.test(file)) continue;

		const seederModule = require(file);

		if (typeof seederModule === "function")
			seederModule();
	}
}

module.exports = runSeeders;