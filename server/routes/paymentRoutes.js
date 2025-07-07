const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/payment");
const Vehicle = require("../models/Vehicle")
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post("/orders", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

// Verify Razorpay payment
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      vehicleId,
      amount,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !vehicleId ||
      !amount
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Save payment
    await Payment.create({
      userId: req.user.id,
      vehicleId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount,
      status: "success",
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});


// Get logged-in user's payment history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate("vehicleId", "title")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error("Error fetching payment history:", err);
    res.status(500).json({ error: "Failed to load payment history" });
  }
});

module.exports = router;
