const express = require("express");
const Vehicle = require("../models/Vehicle");
const Review = require("../models/Review");
const { verifyToken, requireAdmin } = require("../middleware/auth");
const router = express.Router();

// POST /api/vehicles - Create vehicle (admin only)
router.post("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    console.error("Vehicle creation failed:", err);
    res.status(500).json({ error: "Vehicle creation failed",details: err.message });
  }
});

// GET /api/vehicles - All vehicles with average rating
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


// GET /api/vehicles/:id - Single vehicle
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.status(200).json({
  _id: vehicle._id,
  title: vehicle.title,
  description: vehicle.description,
  image: vehicle.image,
  brand: vehicle.brand,
  model: vehicle.model,
  pricePerDay: vehicle.pricePerDay,
  fuelType: vehicle.fuelType,
  transmission: vehicle.transmission,
  seats: vehicle.seats,
  available: vehicle.available,
  year: vehicle.year,
});

  } catch (err) {
    res.status(500).json({ error: "Error fetching vehicle" });
  }
});

// DELETE /api/vehicles/:id - Delete vehicle (admin only)
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Vehicle not found" });
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});


// PUT /api/vehicles/:id - Update vehicle (admin only)
router.put("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Vehicle not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});


module.exports = router;
