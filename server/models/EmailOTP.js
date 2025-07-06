const mongoose = require("mongoose");

const emailOtpSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 min TTL
});

module.exports = mongoose.model("EmailOTP", emailOtpSchema);
