const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const EmailOTP = require("../models/EmailOTP");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// Send OTP to email
router.post("/send-otp", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "Name and Email required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    await EmailOTP.findOneAndUpdate(
      { email },
      { name, otp, createdAt: new Date() },
      { upsert: true }
    );

    // ✅ Correct sendEmail usage
    await sendEmail(
      email,
      "Your OTP - Vehicle Rental",
      `<p>Hi ${name},</p><p>Your OTP is: <strong>${otp}</strong></p>`
    );

    console.log("📩 OTP sent to:", email); // Optional log
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});


// Register
router.post("/register", async (req, res) => {
  try {
    console.log("📦 Register body:", req.body);

    const { name, email, password, otp, address, aadhar, mobile } = req.body;

    if (!name || !email || !password || !otp || !address || !aadhar || !mobile) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const validOtp = await EmailOTP.findOne({ email });
    if (!validOtp || validOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const isFirstUser = (await User.countDocuments()) === 0;

    const user = await User.create({
      name,
      email,
      password,
      address,
      aadhar,
      mobile,
      isAdmin: isFirstUser,
    });

    await EmailOTP.deleteOne({ email });

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
