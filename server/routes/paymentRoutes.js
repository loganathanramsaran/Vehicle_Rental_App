const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { verifyToken, requireAdmin } = require("../middleware/auth");
const Payment = require("../models/payment");
const Booking = require("../models/Booking");
const { createOrder,verifyPayment } = require("../controllers/paymentController");
const Vehicle = require("../models/Vehicle");
const router = express.Router();
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/orders", verifyToken, createOrder);

// Verify and create Payment + Booking
router.post("/verify", verifyToken, verifyPayment);

// ===============================
// Get all payments (ADMIN only)
// ===============================
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("vehicleId", "name type rentPerDay")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching all payments:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// ===============================
// Get logged-in user's payments
// ===============================
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate("vehicleId", "name type rentPerDay")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (!payments.length) {
      return res.status(200).json([]); // return empty array if none
    }

    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching user payments:", err);
    res.status(500).json({ error: "Failed to fetch user payments" });
  }
});

// ===============================
// Get a single payment by ID
// ===============================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("userId", "name email")
      .populate("vehicleId", "name type rentPerDay");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
});

module.exports = router;
