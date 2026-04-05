// db.js

require("dotenv").config();
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
	try {
		await client.connect();
		console.log("Connected to MongoDB.");
		return client.db();
	} catch (err) {
		console.error(err);
		process.exitCode = 1;
	}
}

module.exports = connectDB;