const Vehicle = require("../models/Vehicle");
const fs = require("fs");
const path = require("path");

// Create vehicle (pending approval by default)
const createVehicle = async (req, res) => {
  try {
    const { name, type, rentPerDay, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !type || !rentPerDay || !description || !image) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const vehicle = await Vehicle.create({
      name,
      type,
      rentPerDay,
      description,
      image,
      owner: req.user.id,
      isApproved: false,
      available: true,
    });

    res.status(201).json(vehicle);
  } catch (err) {
    console.error("Create vehicle error:", err);
    res.status(500).json({ message: "Vehicle creation failed" });
  }
};

// Get all approved and available vehicles
const getAllApprovedVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isApproved: true, available: true }).populate("owner", "name email");
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vehicles" });
  }
};

// Get single vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    console.error("Get vehicle error:", err);
    res.status(500).json({ message: "Failed to fetch vehicle" });
  }
};

// Update vehicle (only by owner)
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this vehicle" });
    }

    const { name, type, rentPerDay, description } = req.body;
    const image = req.file ? req.file.filename : vehicle.image;

    if (req.file && vehicle.image) {
      // Delete old image
      const oldPath = path.join(__dirname, "..", "uploads", vehicle.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    vehicle.name = name || vehicle.name;
    vehicle.type = type || vehicle.type;
    vehicle.rentPerDay = rentPerDay || vehicle.rentPerDay;
    vehicle.description = description || vehicle.description;
    vehicle.image = image;
    vehicle.isApproved = false; // Re-approval required

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error("Update vehicle error:", err);
    res.status(500).json({ message: "Failed to update vehicle" });
  }
};

// Delete vehicle (only by owner)
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this vehicle" });
    }

    if (vehicle.image) {
      const imgPath = path.join(__dirname, "..", "uploads", vehicle.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await vehicle.deleteOne();
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    res.status(500).json({ message: "Failed to delete vehicle" });
  }
};

// Get vehicles listed by the logged-in user
const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id });
    res.json(vehicles);
  } catch (err) {
    console.error("Get my vehicles error:", err);
    res.status(500).json({ message: "Failed to fetch user vehicles" });
  }
};

// Get all vehicles (admin)
const getAllVehiclesForAdmin = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("owner", "name email");
    res.json(vehicles);
  } catch (err) {
    console.error("Get all vehicles error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch all vehicles" });
  }
};

// Approve vehicle
const approveVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    if (vehicle.isApproved) {
      return res.status(400).json({ success: false, message: "Vehicle is already approved" });
    }

    vehicle.isApproved = true;
    vehicle.available = true; // Optional: make available on approval
    await vehicle.save();

    res.json({ success: true, message: "Vehicle approved successfully" });
  } catch (err) {
    console.error("Approve vehicle error:", err);
    res.status(500).json({ success: false, message: "Failed to approve vehicle" });
  }
};

// Reject vehicle
const rejectVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    vehicle.isApproved = false;
    vehicle.available = false;
    await vehicle.save();

    res.json({ success: true, message: "Vehicle rejected successfully" });
  } catch (err) {
    console.error("Reject vehicle error:", err);
    res.status(500).json({ success: false, message: "Failed to reject vehicle" });
  }
};

// Export the router
module.exports = {
  createVehicle,
  getAllApprovedVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getMyVehicles,
  getAllVehiclesForAdmin,
  approveVehicle,
  rejectVehicle,
};