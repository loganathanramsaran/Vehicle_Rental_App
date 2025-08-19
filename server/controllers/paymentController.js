const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ✅ Verify payment + save booking + send email
exports.verifyPayment = async (req, res) => {
  try {
    console.log("🎯 verifyPayment controller called");
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      vehicleId,
      startDate,
      endDate,
      amount,
    } = req.body;

    // 1. Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.error("❌ Invalid Razorpay signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // 2. Save booking
    const booking = new Booking({
      user: req.user.id,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalAmount: amount,
      paymentId: razorpay_payment_id,
      status: "confirmed",
    });

    await booking.save();

    // 3. Send confirmation email
    const bookedUser = await User.findById(req.user.id).select("email name");
    console.log("📩 Sending confirmation email to:", bookedUser.email);

    await sendEmail(
      bookedUser.email,
      "Booking Confirmation",
      `<p>Hi ${bookedUser.name || "User"},</p>
       <p>Your booking has been <b>confirmed</b> from ${startDate} to ${endDate}.</p>
       <p>Payment ID: <b>${razorpay_payment_id}</b></p>
       <p>Amount Paid: ₹${amount}</p>`
    );

    res.status(200).json({ message: "Payment verified & booking confirmed" });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
