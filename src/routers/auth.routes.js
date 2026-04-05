// auth.routes.js

const login = require("../controllers/auth.controller");
const { parseBody, sendJSON, regexValidators } = require("../services/utils.service");

async function loginRoutes(req, res) {
	try {
		if (req.method === "POST" && req.url === "/login") {
			const body = await parseBody(req);
			const { email, password } = body;

			if (Object.keys(body).length !== 2 || !email || !password)
				return sendJSON(res, 400, { message: "Missing fields." });
			else if (!regexValidators.EMAIL.test(email))
				return sendJSON(res, 400, { message: "Invalid email." });

			const result = await login(email, password);

			if (!result.ok)
				return sendJSON(res, 401, result);

			return sendJSON(res, 200, { message: "Login successful.", token: result.data });
		}
		
		return false;
	} catch (err) {
		console.log(err);
		process.exitCode = 1;
	}
}

module.exports = loginRoutes;