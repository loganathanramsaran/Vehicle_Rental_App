const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { verifyToken, requireAdmin } = require("../middleware/auth");
const {
  createVehicle,
  getAllApprovedVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getMyVehicles,
  getAllVehiclesForAdmin,
  approveVehicle,
  rejectVehicle,
} = require("../controllers/vehicleController");


// route using upload
router.post(
  "/vehicles",
  upload.single("image"),
  verifyToken,  // if auth is required
  createVehicle
);


// PUBLIC: Get all approved and available vehicles
router.get("/", getAllApprovedVehicles);

// verifyTokenED: User views own listed vehicles
router.get("/my", verifyToken, getMyVehicles);

// ADMIN: View all vehicles (approved/pending/rejected)
router.get("/admin/all", verifyToken, requireAdmin, getAllVehiclesForAdmin);

// ADMIN: Approve or Reject
router.put("/admin/approve/:id", verifyToken, requireAdmin, approveVehicle);
router.put("/admin/reject/:id", verifyToken, requireAdmin, rejectVehicle);

// PROTECTED: Create, Update, Delete
router.post("/", verifyToken, upload.single("image"), createVehicle);
router.put("/:id", verifyToken, upload.single("image"), updateVehicle);
router.delete("/:id", verifyToken, deleteVehicle);

// PUBLIC: Get single vehicle by ID (MUST BE LAST)
router.get("/:id", getVehicleById);

module.exports = router;
