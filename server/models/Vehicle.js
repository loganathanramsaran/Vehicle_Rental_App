const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  type: String,
  rentPerDay: Number,
  description: String,
  image: String,
  isApproved: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

});

module.exports = mongoose.model("Vehicle", vehicleSchema);