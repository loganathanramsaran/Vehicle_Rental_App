const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { verifyToken } = require("../middleware/auth");

// POST /api/reviews - Create a review
router.post("/", verifyToken, async (req, res) => {
  try {
    const { vehicle, rating, comment } = req.body;

    // Check if the user already reviewed this vehicle
    const existing = await Review.findOne({
      vehicle,
      user: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ error: "You already reviewed this vehicle" });
    }

    const review = await Review.create({
      vehicle,
      user: req.user.id,
      rating,
      comment
    });

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    console.error("Review creation error:", err);
    res.status(500).json({ error: "Failed to add review" });
  }
});

// GET /api/reviews/vehicle/:vehicleId - Fetch all reviews for a vehicle
router.get("/vehicle/:vehicleId", async (req, res) => {
  try {
    const reviews = await Review.find({ vehicle: req.params.vehicleId }).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ✅ Public route to fetch all reviews
router.get("/all", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("vehicle", "title image");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});


module.exports = router;
