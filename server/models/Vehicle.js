const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // "Hyundai i20"
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["SUV", "Sedan", "Bike", "Hatchback", "Truck", "Van"],
    },
    model: { type: String, trim: true },
    year: { type: Number },
    pricePerDay: { type: Number, required: true },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    available: { type: Boolean, default: true },
    image: { type: String, trim: true }, // Image URL
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    brand: String,
    fuelType: String,
    transmission: String,
    seats: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
