const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// GET /api/bookings/my-bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: "vehicle",
        populate: { path: "owner", select: "name email" },
      })
      .populate("payment")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

const createBooking = async (req, res) => {
  const {
    vehicle,
    startDate,
    endDate,
    totalPrice,
    razorpayOrderId,
    razorpayPaymentId,
  } = req.body;
  const userId = req.user.id;

  try {
    const newBooking = await Booking.create({
      user: userId,
      vehicle,
      startDate,
      endDate,
      totalPrice,
      razorpayOrderId,
      razorpayPaymentId,
      status: "confirmed",
    });

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: "Booking creation failed." });
  }
};

// GET /api/bookings/booked-dates/:vehicleId
const getBookedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({ vehicle: req.params.vehicleId });
    const dateRanges = bookings.map((b) => ({
      start: b.startDate,
      end: b.endDate,
    }));
    res.json(dateRanges);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booked dates" });
  }
};

// PATCH /api/bookings/cancel/:id
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optional: Check if the booking belongs to the logged-in user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res
      .status(500)
      .json({ message: "Server error during booking cancellation" });
  }
};

// DELETE /api/bookings/delete/:id
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Optional: Check if the booking belongs to the logged-in user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await booking.deleteOne();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ message: "Server error during booking deletion" });
  }
};

// GET /api/bookings/admin
const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "name type rentPerDay")
      .populate({
        path: "payment",
        select: "razorpayPaymentId amount status createdAt",
      });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings for admin:", err);
    res.status(500).json({ message: "Failed to retrieve bookings" });
  }
};

const getBookingsByVehicleId = async (req, res) => {
  try {
    const bookings = await Booking.find({
      vehicle: req.params.vehicleId,
      status: "confirmed", // Only show confirmed bookings
    });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings for vehicle" });
  }
};

module.exports = {
  getMyBookings,
  createBooking,
  getBookedDates,
  cancelBooking,
  deleteBooking,
  getAllBookingsForAdmin,
  getBookingsByVehicleId,
};
