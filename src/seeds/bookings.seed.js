// bookings.seed.js

const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const BookingsModel = require("../models/bookings.model");

async function seedBookings() {
	try {
		const fullPath = path.resolve(__dirname, "bookings.json");
		const rawData = fs.readFileSync(fullPath);
		const data = JSON.parse(rawData);

		for (let booking of data) {
			await BookingsModel.upsertBooking({
				datetime: booking.datetime,
				name: booking.name,
				phone: booking.phone,
				userId: new ObjectId(booking.userId)
			});
		}

		console.log("Bookings seeded correctly.");
	} catch (err) {
		console.error(err);
		process.exitCode = 1;
	}
}

module.exports = seedBookings;