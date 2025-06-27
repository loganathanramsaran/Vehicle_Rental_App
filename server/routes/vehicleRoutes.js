const express = require("express");
const Vehicle = require("../models/Vehicle");
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

// GET /api/vehicles - All vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

// GET /api/vehicles/:id - Single vehicle
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
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
