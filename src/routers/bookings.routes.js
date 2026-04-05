// bookings.routes.js

const BookingsController = require("../controllers/bookings.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { sendJSON, parseBody } = require("../services/utils.service");

async function bookingsRoutes(req, res) {
	try {
		if (req.method === "GET" && req.url === "/availability") {
			const data = await BookingsController.getBookings();
			return sendJSON(res, 200, { data });
		}

		if (req.method === "GET" && req.url === "/bookings") {
			const userLogged = await authMiddleware(req, res);

			if (!userLogged.ok) return;

			const user = userLogged.data;
			const data = await BookingsController.getBookings(user);

			return sendJSON(res, 200, { data });
		}

		if (req.method === "POST" && req.url === "/bookings") {
			const userLogged = await authMiddleware(req, res);

			if (!userLogged.ok) return;

			const user = userLogged.data;
			const inputData = await parseBody(req);
			const result = await BookingsController.addBooking(user, inputData);

			if (!!result.insertedId)
				return sendJSON(res, 201, { message: "Cita agendada." });

			return sendJSON(res, 400, { message: "Error creando la cita." });
		}

		if (req.method === "DELETE" && /\/bookings\/[^/]+$/.test(req.url)) {
			const userLogged = await authMiddleware(req, res);

			if (!userLogged.ok) return;

			const user = userLogged.data;
			const dateParam = req.url.substring(req.url.lastIndexOf('/') + 1);

			const result = await BookingsController.deleteBooking(user, dateParam);

			if (!result.ok)
				return sendJSON(res, 404, { error: result.data });
			return sendJSON(res, 200, { message: "Cita cancelada." });
		}

		return false;
	} catch (err) {
		console.log(err);
		process.exitCode = 1;
	}
}

module.exports = bookingsRoutes;