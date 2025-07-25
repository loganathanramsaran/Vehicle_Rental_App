const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password"); // exclude passwords
  res.status(200).json(users);
};

// ✅ Admin can change roles, but NOT their own
const updateUserRole = async (req, res) => {
  const { userId, isAdmin } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Prevent self-demotion
    if (userId === req.user.id) {
      return res.status(403).json({ error: "You cannot change your own admin role" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    console.error("❌ Error updating user role:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllUsers, updateUserRole };
