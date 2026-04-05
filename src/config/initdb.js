// initdb.js

const path = require("path");
const connectDB = require("./db.js");
const { getDirFilesPaths } = require("../services/utils.service");
const runSeeders = require("../seeds/index.seed");

async function injectModelsDB(database) {
	try {
		const modelFiles = await getDirFilesPaths("models");

		for (let file of modelFiles) {
			if (!file.endsWith(".model.js")) continue;

			const modelModule = require(file);

			if (typeof modelModule.injectDB === "function")
				modelModule.injectDB(database);

			if (typeof modelModule.createIndexes === "function")
				await modelModule.createIndexes();
		}
	} catch (err) {
		console.error(err);
		process.exitCode = 1;
	}
}

async function initDB() {
	try {
		const db = await connectDB();
		await injectModelsDB(db);
		await runSeeders();
	} catch (err) {
		console.error(err);
		process.exitCode = 1;
	}
}

module.exports = initDB;