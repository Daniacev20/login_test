// users.seed.js

const fs = require("fs");
const path = require("path");
const { hashPassword } = require("../services/hash.service");
const UsersModel = require("../models/users.model");

async function seedUsers() {
	try {
		const fullPath = path.resolve(__dirname, "users.json");
		const rawData = fs.readFileSync(fullPath);
		const data = JSON.parse(rawData);

		for (let user of data) {
			const pw = await hashPassword(user.password);
			
			await UsersModel.upsertUser({
				username: user.username,
				email: user.email,
				password: pw,
				phone: user.phone,
				isAdmin: user.isAdmin
			});
		}

		console.log("Users seeded correctly.");
	} catch (err) {
		console.error(err);
		process.exitCode = 1;
	}
}

module.exports = seedUsers;