const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { verifyToken } = require("../middleware/auth"); // ✅ Import middleware

// ✅ PROTECTED: Create a new booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const { vehicle, startDate, endDate, totalPrice } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "End date must be after start date" });
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

    // Create booking
    const booking = await Booking.create({
      vehicle,
      user: req.user.id,
      startDate,
      endDate,
      totalPrice,
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("Booking failed:", err);
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
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});



module.exports = router;
