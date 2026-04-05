// bookings.model.js

class BookingsModel {
	static #db = null;

	static injectDB(database) {
		this.#db = database;
	}

	static async createIndexes() {
		const Bookings = this.#db.collection("bookings");

		await Bookings.createIndex({ datetime: 1 }, { unique: true });
	}

	static async upsertBooking(booking) {
		const Bookings = this.#db.collection("bookings");

		return await Bookings.updateOne(
			{ datetime: booking.datetime },
			{ $setOnInsert: booking },
			{ upsert: true }
		);
	}

	static async findAll(options = {}) {
		const Bookings = this.#db.collection("bookings");

		return await Bookings.find({}, options).toArray();
	}

	static async insert(booking) {
		const Bookings = this.#db.collection("bookings");

		return await Bookings.insertOne(booking);
	}

	static async delete(query) {
		const Bookings = this.#db.collection("bookings");

		return await Bookings.deleteOne(query);
	}
}

module.exports = BookingsModel;