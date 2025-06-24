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
    res.status(500).json({ error: "Vehicle creation failed" });
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

module.exports = router;
