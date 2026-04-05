// server.js

const https = require("https");
const utilsService = require("./services/utils.service");
const initDB = require("./config/initdb");

async function startServer() {
	await initDB(); // init everything, including dotenv

	const PORT = Number(process.env.PORT);
	const certOptions = await utilsService.getCertOptions();
	const routersFiles = await utilsService.getDirFilesPaths("routers");
	let routers = [];

	const server = https.createServer(certOptions, async (req, res) => {
		if (!utilsService.validateCORS(res, req.headers.origin))
			return utilsService.sendJSON(res, 403, { error: "Site not allowed." });
		
		for (let file of routersFiles) {
			if (!file.endsWith(".routes.js")) continue;

			const router = require(file);

			if (typeof router === "function")
				routers.push(router);
		}

		for (let router of routers)
			if (await router(req, res)) return;

		return utilsService.sendJSON(res, 404, { message: "Site not found." });
	});

	server.listen(PORT);
}

startServer();