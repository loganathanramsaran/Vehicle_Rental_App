const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const Payment = require("../models/payment");
const generateInvoiceHTML = require("../utils/generateInvoiceHTML");

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

// ✅ Verify payment, save booking, and send confirmation email
exports.verifyPayment = async (req, res) => {
  try {
    console.log("🎯 verifyPayment controller called");
    console.log("📥 Request body:", req.body);
    console.log("👤 Authenticated user:", req.user);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      vehicleId,
      startDate,
      endDate,
      amount,
    } = req.body;

    // 1️⃣ Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("🔑 Generated signature:", generatedSignature);
    console.log("🔑 Razorpay signature:", razorpay_signature);

    if (razorpay_signature !== generatedSignature) {
      console.error("❌ Invalid Razorpay signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    console.log("✅ Razorpay signature verified");

    // 2️⃣ Save Payment in DB
    const payment = new Payment({
      userId: req.user.id, // ✅ as per schema
      vehicleId: vehicleId,
      amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "success",
    });
    await payment.save();
    console.log("💾 Payment saved:", payment);

    // 3️⃣ Create Booking (⚡ fixed: match schema)
    const booking = new Booking({
      user: req.user.id,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalPrice: amount, // ✅ FIXED: schema uses totalPrice not totalAmount
      payment: payment._id, // ✅ FIXED: schema expects ObjectId reference, not string
      status: "confirmed",
    });
    await booking.save();
    console.log("💾 Booking saved:", booking);

    // 4️⃣ Send confirmation email
    const bookedUser = await User.findById(req.user.id).select("email name");
    console.log("📧 Sending email to:", bookedUser.email);

    try {
      await sendEmail(
        bookedUser.email,
        "Booking Confirmation - Vehicle Rental",
        `<p>Hi ${bookedUser.name || "User"},</p>
         <p>Your booking has been <b>confirmed</b> from ${new Date(
           startDate
         ).toDateString()} to ${new Date(endDate).toDateString()}.</p>
         <p>Payment ID: <b>${razorpay_payment_id}</b></p>
         <p>Amount Paid: ₹${amount}</p>
         <p>Thank you for choosing our service!</p>`
      );
      console.log("📩 Confirmation email sent successfully");
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
    }

    // 5️⃣ Generate Invoice HTML
    const vehicle = await Vehicle.findById(vehicleId).select(
      "name type description"
    );

    // Generate invoice HTML once (pass all data as an object)
    const invoiceHTML = await generateInvoiceHTML({
      booking,
      payment,
      user: bookedUser,
      vehicle,
      status: "Paid",
    });

    // Send invoice email
    await sendEmail(
      bookedUser.email, // ✅ fixed
      `GoRent Invoice - Booking ${booking._id}`,
      invoiceHTML
    );
    console.log("📧 Invoice email sent to:", bookedUser.email);

    // ✅ Final response
    res.status(200).json({
      success: true,
      message: "Payment verified, booking confirmed & payment saved",
      booking,
      payment,
    });
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
