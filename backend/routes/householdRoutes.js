// routes/householdRoutes.js
const express = require("express");
const router = express.Router();

const { createHousehold } = require("../controllers/householdController");
const { authMiddleware } = require("../middleware/auth");

router.post("/createhousehold", authMiddleware, createHousehold);

module.exports = router;