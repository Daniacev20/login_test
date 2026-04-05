// auth.middleware.js

const { verifyToken } = require("../services/jwt.service");
const { sendJSON } = require("../services/utils.service");

function authMiddleware(req, res) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return sendJSON(res, 401, {
			ok: false,
			data: "Unauthorized."
		});
	}

	const parts = authHeader.split(" ");

	if (parts.length !== 2 || parts[0] !== "Bearer") {
		return sendJSON(res, 401, {
			ok: false,
			data: "Invalid authorization header."
		});
	}

	const token = parts[1];
	const payload = verifyToken(token);

	if (!payload) {
		return sendJSON(res, 401, {
			ok: false,
			data: "Invalid or expired token."
		});
	}

	return {
		ok: true,
		data: payload
	};
}

module.exports = authMiddleware;