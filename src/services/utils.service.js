// utils.service.js

const fs = require("fs");
const path = require("path");

function getDirFilesPaths(dir) {
	return new Promise((resolve, reject) => {
		const is_src = __dirname.endsWith("src");
		
		const fullPath = is_src ?
			path.resolve(__dirname, dir) :
			path.resolve(__dirname, "../", dir);

		fs.readdir(fullPath, (err, list) => {
			if (err) return reject(err);

			const absolutes = list.map(f => {
				if (is_src)
					return path.resolve(__dirname, dir, f);
				else
					return path.resolve(__dirname, "../", dir, f);
			});

			return resolve(absolutes);
		});
	});
}

function parseBody(req) {
	return new Promise((resolve, reject) => {
		let body = "";

		req.on("data", chunk => body += chunk.toString());

		req.on("end", () => {
			try {
				resolve(JSON.parse(body));
			} catch (err) {
				reject(err);
			}
		});
	});
}

async function getCertOptions() {
	try {
		const [key, cert] = await Promise.all([
			fs.readFileSync(process.env.NODE_EXTRA_CA_KEY),
			fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS)
		]);

		return { key, cert };
	} catch (err) {
		console.error(err);
		process.exitCode = 1;
	}
}

function validateCORS(res, origin) {
	const goodOrigins = process.env.ALLOWED_ORIGINS.split(",");
	const allowedOrigins = new Set(goodOrigins);

	if (allowedOrigins.has(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		return true;
	}
	
	return false;
}

function sendJSON(res, statusCode, data) {
	res.writeHead(statusCode, { "Content-Type": "application/json" });
	res.end(JSON.stringify(data));
	return true;
}

const regexValidators = {
	PHONE: /^\(?\d{3}\)?(\s|\.|-)?\d{3}(\s|\.|-)?\d{4}$/,
	EMAIL: /^(?!.*\.\.)[a-zA-z0-9._%+-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,}$/,
	DATE: null, // wip
}

module.exports = {
	getDirFilesPaths,
	parseBody,
	getCertOptions,
	validateCORS,
	sendJSON,
	regexValidators
};