const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { verifyToken } = require("../middleware/auth"); // ✅ Import middleware

// ✅ PROTECTED: Create a new booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const { vehicle, startDate, endDate, totalPrice } = req.body;

    const booking = await Booking.create({
      vehicle,
      user: req.user.id, // ✅ From decoded token
      startDate,
      endDate,
      totalPrice
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ error: "Booking failed" });
  }
});

// ✅ PROTECTED: Get bookings by user ID
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const bookings = await Booking.find({ user: req.params.userId }).populate("vehicle");
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

    const bookings = await Booking.find().populate("vehicle user");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;
