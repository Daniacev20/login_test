// auth.controller.js

const { signToken } = require("../services/jwt.service");
const { comparePassword } = require("../services/hash.service");
const UsersModel = require("../models/users.model");

async function login(email, password) {
	try {
		const user = await UsersModel.findByEmail(email);

		if (!user) {
			return {
				ok: false,
				data: "Invalid credentials."
			}
		}

		const validPassword = await comparePassword(password, user.password);

		if (!validPassword) {
			return {
				ok: false,
				data: "Invalid credentials."
			}
		}

		const token = signToken({
			id: user._id,
			username: user.username,
			email: user.email,
			phone: user.phone,
			isAdmin: user.isAdmin
		});

		return {
			ok: true,
			data: token
		}
	} catch (err) {
		return {
			ok: false,
			data: err
		}
	}
}

module.exports = login;