const express = require("express");
const Vehicle = require("../models/Vehicle");
const Review = require("../models/Review");
const { verifyToken, requireAdmin } = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/vehicles"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ GET /api/vehicles/available - all available vehicles
// MUST BE ABOVE "/:id"
router.get("/available", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ available: true });
    res.json(vehicles);
  } catch (err) {
    console.error("Error fetching available vehicles:", err.message);
    res.status(500).json({ error: "Failed to fetch available vehicles" });
  }
});

// 🔐 POST /api/vehicles - Create vehicle
router.post("/", verifyToken, requireAdmin, upload.single("image"), async (req, res) => {
  const data = {
    ...req.body,
    image: req.file ? `/uploads/vehicles/${req.file.filename}` : "",
  };

  try {
    const vehicle = await Vehicle.create(data);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Vehicle creation failed", details: err.message });
  }
});

// 📦 GET /api/vehicles - All vehicles with average ratings
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().lean();

    const vehicleWithRatings = await Promise.all(
      vehicles.map(async (vehicle) => {
        const reviews = await Review.find({ vehicle: vehicle._id });
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : null;

        return {
          ...vehicle,
          averageRating: avgRating ? Number(avgRating.toFixed(1)) : null,
          reviewCount: reviews.length,
        };
      })
    );

    res.json(vehicleWithRatings);
  } catch (err) {
    console.error("Error fetching vehicles with ratings:", err);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

// 🔍 GET /api/vehicles/:id - Single vehicle (MUST BE LAST)
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Error fetching vehicle" });
  }
});

// ❌ DELETE /api/vehicles/:id
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Vehicle not found" });
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// ✏️ PUT /api/vehicles/:id
router.put("/:id", verifyToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.image = `/uploads/vehicles/${req.file.filename}`;
    }

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: "Vehicle not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
