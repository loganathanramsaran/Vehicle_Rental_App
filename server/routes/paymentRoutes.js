const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { verifyToken } = require("../middleware/auth");
const Payment = require("../models/payment");
const Booking = require("../models/Booking");
const { createOrder,verifyPayment } = require("../controllers/paymentController");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/orders", verifyToken, createOrder);

// Verify and create Payment + Booking
router.post("/verify", verifyToken, verifyPayment);


module.exports = router;
