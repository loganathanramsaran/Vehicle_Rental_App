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
  isRejected: {
  type: Boolean,
  default: false,
},
  averageRating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  
});

module.exports = mongoose.model("Vehicle", vehicleSchema);