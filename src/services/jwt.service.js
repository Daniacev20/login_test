// jwt.service.js

const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

function signToken(payload) {
	return jwt.sign(payload, SECRET, { expiresIn: "4h" }); // original: 2h
}

function verifyToken(token) {
	try {
		return jwt.verify(token, SECRET);
	} catch {
		return null;
	}
}

module.exports = {
	signToken,
	verifyToken
}