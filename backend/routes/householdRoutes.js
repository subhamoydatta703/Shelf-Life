// routes/householdRoutes.js
const express = require("express");
const router = express.Router();

const { createHousehold, joinHousehold, getHousehold } = require("../controllers/householdController");
const { authMiddleware } = require("../middleware/auth");

router.post("/household/create", authMiddleware, createHousehold);
router.post("/household/join", authMiddleware, joinHousehold);
router.get("/household", authMiddleware, getHousehold);

module.exports = router;