// users.model.js

class UsersModel {
	static #db = null;

	static injectDB(database) {
		this.#db = database;
	}

	static async createIndexes() {
		const Users = this.#db.collection("users");

		await Users.createIndex({ username: 1 }, { unique: true });
		await Users.createIndex({ email: 1 }, { unique: true });
	}

	static async upsertUser(user) {
		const Users = this.#db.collection("users");

		return await Users.updateOne(
			{ email: user.email },
			{ $setOnInsert: user },
			{ upsert: true }
		);
	}

	static async findByEmail(email) {
		const Users = this.#db.collection("users");
		return await Users.findOne({ email });
	}
}

module.exports = UsersModel;