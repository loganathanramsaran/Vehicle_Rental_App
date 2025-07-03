const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { verifyToken } = require("../middleware/auth"); 
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const Payment = require("../models/payment"); 
const Vehicle = require("../models/Vehicle"); // top of file

router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      vehicle,
      startDate,
      endDate,
      totalPrice,
      razorpayOrderId,
      razorpayPaymentId,
    } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    // Check for overlapping bookings
    const conflict = await Booking.findOne({
      vehicle,
      $or: [
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        },
      ],
    });

    if (conflict) {
      return res
        .status(400)
        .json({ error: "Vehicle already booked for the selected dates" });
    }

    // ✅ Create payment record
    const payment = await Payment.create({
      userId: req.user.id,
      vehicleId: vehicle,
      razorpayOrderId,
      razorpayPaymentId,
      amount: totalPrice * 100,
      status: "success",
    });

    // ✅ Create booking and link payment
    const booking = await Booking.create({
      vehicle,
      user: req.user.id,
      startDate,
      endDate,
      totalPrice,
      payment: payment._id,
      status: "confirmed",
    });

    const user = await User.findById(req.user.id);
    const vehicleData = await Vehicle.findById(vehicle);
    await sendEmail({
  to: user.email,
  subject: "✅ Booking Confirmation",
  html: `
    <h2>Booking Confirmed!</h2>
    <p>Hi ${user.name},</p>
    <p>Your booking for <strong>${vehicleData.title}</strong> from <strong>${new Date(startDate).toLocaleDateString()}</strong> to <strong>${new Date(endDate).toLocaleDateString()}</strong> is confirmed.</p>
    <p>Total: ₹${totalPrice}</p>
    <br/>
    <p>Thank you for using Vehicle Rental!</p>
  `,
});

    return res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("❌ Booking failed:", err);
    return res.status(500).json({ error: "Booking failed" });
  }
});

// ✅ PROTECTED: Get bookings by user ID
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const bookings = await Booking.find({ user: req.params.userId })
      .populate("vehicle")
      .populate("payment"); // ✅ populate payment details here

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
});

// ✅ PROTECTED: Get all bookings (admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const bookings = await Booking.find()
      .populate("vehicle user")
      .populate("payment");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking cancelled" });

    const user = await User.findById(booking.user);

    await sendEmail({
      to: user.email,
      subject: "❌ Booking Cancelled",
      html: `
    <h2>Booking Cancelled</h2>
    <p>Hi ${user.name},</p>
    <p>Your booking has been successfully cancelled.</p>
    <p>Booking ID: ${booking._id}</p>
  `,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// Get all bookings for a specific vehicle
router.get("/vehicle/:vehicleId", async (req, res) => {
  try {
    const bookings = await Booking.find({ vehicle: req.params.vehicleId });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings for vehicle:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;
