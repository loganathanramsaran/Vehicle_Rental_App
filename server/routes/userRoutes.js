// 📁 server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const User = require("../models/User");

// Setup multer for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// GET /api/user/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// PUT /api/user/me
router.put("/me", verifyToken, async (req, res) => {
  try {
    const { name, address, aadhar, mobile } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (address) user.address = address;
    if (aadhar) user.aadhar = aadhar;
    if (mobile) user.mobile = mobile;

    await user.save();

    res.json({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      address: user.address,
      aadhar: user.aadhar,
      mobile: user.mobile,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// POST /api/user/avatar
router.post("/avatar", verifyToken, upload.single("avatar"), async (req, res) => {
  const user = await User.findById(req.user.id);
  user.avatar = "/uploads/avatars/" + req.file.filename;
  await user.save();
  res.json({ avatar: user.avatar });
});

// DELETE /api/user/me
router.delete("/me", verifyToken, async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "Account deleted" });
});

// POST /api/user/request-password-otp
router.post("/request-password-otp", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.passwordOtp = otp;
    user.passwordOtpExpires = expiry;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "OTP for Password Change",
      html: `<p>Your OTP for changing password is <b>${otp}</b>. It is valid for 10 minutes.</p>`
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// PUT /api/user/change-password
router.put("/change-password", verifyToken, async (req, res) => {
  const { otp, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (!user || !user.passwordOtp || !user.passwordOtpExpires) {
    return res.status(400).json({ error: "No OTP request found" });
  }

  if (Date.now() > user.passwordOtpExpires) {
    return res.status(400).json({ error: "OTP expired" });
  }

  if (user.passwordOtp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  user.password = newPassword;
  user.passwordOtp = undefined;
  user.passwordOtpExpires = undefined;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

module.exports = router;
