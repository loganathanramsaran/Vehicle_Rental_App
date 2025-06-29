// 📁 server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// PUT /api/user/me
router.put("/me", verifyToken, async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findById(req.user.id);
  if (name) user.name = name;
  if (password) user.password = password;
  await user.save();
  res.json({ name: user.name, email: user.email, avatar: user.avatar });
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

module.exports = router;
