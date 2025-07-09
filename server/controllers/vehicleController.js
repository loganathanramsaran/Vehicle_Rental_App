const Vehicle = require("../models/vehicleModel");

const createVehicle = async (req, res) => {
  try {
    const { title, brand, price } = req.body;
    const imagePath = req.file ? `/uploads/vehicles/${req.file.filename}` : "";

    const vehicle = new Vehicle({
      title,
      brand,
      price,
      image: imagePath,
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Failed to create vehicle" });
  }
};
