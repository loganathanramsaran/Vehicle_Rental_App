const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { verifyToken } = require("../middleware/auth");
const Payment = require("../models/payment");
const Booking = require("../models/Booking");
const { createOrder } = require("../controllers/paymentController");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/orders", verifyToken, createOrder);

// Verify and create Payment + Booking
router.post("/verify", verifyToken, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    vehicleId,
    startDate,
    endDate,
    amount,
  } = req.body;

  const isValid =
    crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex") === razorpay_signature;

  if (!isValid)
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });

  try {
    const payment = await Payment.create({
      userId: req.user.id,
      vehicleId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount,
      status: "success",
    });

    await Booking.create({
      vehicle: vehicleId,
      user: req.user.id,
      startDate,
      endDate,
      totalPrice: amount,
      payment: payment._id,
      status: "confirmed",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
});

// Get all payments for a user
router.get("/mine", verifyToken, async (req, res) => {
  try {
    console.log("Fetching payments for user:", req.user.id); // Add this
    const payments = await Payment.find({ userId: req.user.id })
      .populate("vehicleId", "name type")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

module.exports = router;
