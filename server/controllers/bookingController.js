const Booking = require("../models/Booking"); 
const Vehicle = require("../models/Vehicle");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

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
// Create booking
const createBooking = async (req, res) => {
  try {
    console.log("📥 Incoming booking request:", req.body);

    const { vehicleId, startDate, endDate, amount } = req.body;
    const userId = req.user.id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check for overlap
    console.log("🔎 Checking overlapping bookings...");
    const overlappingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: { $ne: "cancelled" },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (overlappingBooking) {
      console.log("❌ Overlapping booking found");
      return res.status(400).json({
        message: "Vehicle already booked for the selected dates",
      });
    }

    // Create booking
    console.log("✅ No overlaps. Creating booking...");
    const booking = new Booking({
      user: userId,
      vehicle: vehicleId,
      startDate: start,
      endDate: end,
      amount,
      status: "confirmed",
    });

    await booking.save();
    console.log("💾 Booking saved to DB:", booking._id);

    // Fetch user's email
    const bookedUser = await User.findById(userId).select("email name");
    console.log("👤 User fetched for email:", bookedUser);

    if (!bookedUser || !bookedUser.email) {
      console.log("⚠️ No user email found, skipping email sending.");
      return res.status(201).json(booking);
    }

    // Log before sending
    console.log("📩 Sending confirmation email to:", bookedUser.email);

    // Send confirmation email
    try {
      await sendEmail(
        bookedUser.email,
        "Booking Confirmation",
        `<p>Hi ${bookedUser.name || "User"},</p>
         <p>Your booking has been <b>confirmed</b> from 
         ${start.toDateString()} to ${end.toDateString()}.</p>`
      );
      console.log("✅ Confirmation email sent!");
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error("🔥 Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking" });
  }
};


// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user", "email name");
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    console.log("Booking cancelled:", booking);
    console.log("📩 Sending confirmation email to:", bookedUser.email);


    // Send cancellation email
    try {
      await sendEmail(
        booking.user.email,
        "Booking Cancelled",
        `<p>Hi ${booking.user.name || "User"},</p>
         <p>Your booking from <b>${booking.startDate.toDateString()}</b> 
         to <b>${booking.endDate.toDateString()}</b> has been <b>cancelled</b>.</p>`
      );
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

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
      status: { $ne: "cancelled" },
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
