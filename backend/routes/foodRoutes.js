const express = require("express");
const {
  getFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Anyone logged in can view foods
router.get("/", protect, getFoods);
router.get("/:id", protect, getFoodById);

// Admin only
router.post("/", protect, adminOnly, addFood);
router.put("/:id", protect, adminOnly, updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

module.exports = router;
