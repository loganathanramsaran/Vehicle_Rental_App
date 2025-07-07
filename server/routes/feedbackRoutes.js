const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { verifyToken } = require("../middleware/auth");

// Public: Submit feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const feedback = await Feedback.create({ name, email, message });
    res.status(201).json({ success: true, message: "Feedback sent", feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send feedback" });
  }
});

// Admin: View all feedbacks
router.get("/", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

module.exports = router;
