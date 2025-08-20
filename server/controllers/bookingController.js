const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const user = require("../models/User");
const generateInvoiceHTML = require("../utils/generateInvoiceHTML");
const sendEmail = require("../utils/sendEmail");

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate({
      path: "vehicle",
      populate: {
        path: "owner",
        select: "name email",
      },
    });
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

// Create booking
const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, amount } = req.body;
    const userId = req.user.id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check for overlap
    const overlappingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: { $ne: "cancelled" },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
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

    // Fetch user's email
    const bookedUser = await user.findById(userId).select("email");

    // Send confirmation email
    try {
      await transporter.sendEmail({
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: bookedUser.email,
        subject: "Booking Confirmation",
        text: `Your booking has been confirmed from ${start.toDateString()} to ${end.toDateString()}.`,
        html: `<p>Your booking has been <b>confirmed</b> from ${start.toDateString()} to ${end.toDateString()}.</p>`,
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking" });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vehicle");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Generate cancellation invoice
    const invoiceHTML = generateInvoiceHTML(booking, "Cancelled");

    // Send cancellation invoice email
    try {
      await sendEmail(
        booking.user.email,
        "GoRent | Booking Cancelled Invoice",
        invoiceHTML
      );
      console.log("📨 Cancellation invoice sent:", booking.user.email);
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
    }

    res.json({ message: "Booking cancelled & invoice sent" });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

// Delete booking
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
      status: { $ne: "cancelled" },
    });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// @desc Get invoice for a booking
const getInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("vehicle")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // generate invoice HTML
    const generateInvoiceHTML = require("../utils/generateInvoiceHTML");
    const invoiceHTML = generateInvoiceHTML(booking);

    res.send(invoiceHTML); // send raw HTML
  } catch (err) {
    console.error("❌ Invoice fetch error:", err);
    res.status(500).json({ error: "Failed to fetch invoice" });
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
  getInvoice,
};
