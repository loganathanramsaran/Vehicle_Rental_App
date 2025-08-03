const express = require("express");
const router = express.Router();
const { verifyToken,requireAdmin } = require("../middleware/auth");

const {
  getMyBookings,
  createBooking,
  getBookedDates,
  cancelBooking,
  deleteBooking,
  getAllBookingsForAdmin,
  getBookingsByVehicleId,
} = require("../controllers/bookingController");

router.get("/my-bookings", verifyToken, getMyBookings);
router.get("/booked-dates/:vehicleId", getBookedDates);
router.patch("/cancel/:id", verifyToken, cancelBooking);
router.delete("/delete/:id", verifyToken, deleteBooking);
router.get("/admin", verifyToken, requireAdmin, getAllBookingsForAdmin);
router.post("/", verifyToken, createBooking);
router.get("/vehicle/:vehicleId", getBookingsByVehicleId);

module.exports = router;
