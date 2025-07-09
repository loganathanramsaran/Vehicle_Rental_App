const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password"); // exclude passwords
  res.status(200).json(users);
};

module.exports = { getAllUsers };
