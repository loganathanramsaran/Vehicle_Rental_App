const Booking = require("../models/Booking");

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("vehicle");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Get booked dates for a vehicle (excluding cancelled bookings)
const getBookedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({
      vehicle: req.params.vehicleId,
      status: { $ne: "cancelled" },
    }).select("startDate endDate");

    res.json(
      bookings.map((b) => ({
        start: b.startDate,
        end: b.endDate,
      }))
    );
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    res.status(500).json({ message: "Failed to fetch booked dates" });
  }
};

// Create booking (block overlapping active bookings)
const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, amount } = req.body;
    const userId = req.user.id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check for overlap with non-cancelled bookings
    const overlappingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: { $ne: "cancelled" },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } } // overlapping dates
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: "Vehicle already booked for the selected dates",
      });
    }

    // Create booking
    const booking = new Booking({
      user: userId,
      vehicle: vehicleId,
      startDate: start,
      endDate: end,
      amount,
      status: "confirmed",
    });

    await booking.save();
    res.status(201).json(booking);

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking" });
  }
};


const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("vehicle user");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

const getBookingsByVehicleId = async (req, res) => {
  try {
    const bookings = await Booking.find({
      vehicle: req.params.vehicleId,
      status: { $ne: "cancelled" }
    });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
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
