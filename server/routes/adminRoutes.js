const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserRole } = require("../controllers/adminController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

// Admin: Get all users
router.get("/users", verifyToken, requireAdmin, getAllUsers);

// Admin: Update role (admin ↔ user)
router.put("/user-role", verifyToken, requireAdmin, updateUserRole);

module.exports = router;
