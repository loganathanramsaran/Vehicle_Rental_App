const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: "", // URL to avatar image
  },
  verified: {
    type: Boolean,
    default: false,
  },
  emailToken: {
    type: String,
  },
  emailTokenExpires: {
    type: Date,
  },
  otp: String,
  otpExpires: Date,

  emailVerified: {
    type: Boolean,
    default: false,
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Format: 1234567890
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  aadhar: {
    type: String,
    required: [true, "Aadhaar number is required"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{4}\s\d{4}\s\d{4}$/.test(v); // Format: 1234 5678 9012
      },
      message: (props) => `${props.value} is not a valid Aadhaar number!`,
    },
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed one
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
