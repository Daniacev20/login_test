// bookings.controller.js

const BookingsModel = require("../models/bookings.model");
const { ObjectId } = require("mongodb");

class BookingsController {
	static async getBookings(user = {}) {
		const options = { sort: { datetime: 1 } };

		if (!user.isAdmin)
			options.projection = { _id: 0, datetime: 1 };

		return await BookingsModel.findAll(options);
	}

	static async addBooking(user, booking) {
		const { datetime } = booking;
		const formattedDate = new Date(datetime);

		if (isNaN(formattedDate.getTime()))
			throw new Error("Invalid datetime.");

		const newBooking = {
			datetime: formattedDate.toISOString(),
			name: user.username,
			phone: user.phone,
			userId: new ObjectId(user.id)
		}

		return await BookingsModel.insert(newBooking);
	}

	static async deleteBooking(user, datetime) {
		const parsedParam = decodeURIComponent(datetime);
		const dateObj = new Date(parsedParam);

		if (isNaN(dateObj.getTime()))
			throw new Error("Invalid date to delete.");

		const query = { userId: user.id, datetime: dateObj.toISOString() };

		const result = await BookingsModel.delete(query);

		if (result.deletedCount > 0) {
			return {
				ok: true,
				data: result
			}
		}

		return {
			ok: false,
			data: "Appointment not found."
		}
	}
}

module.exports = BookingsController;