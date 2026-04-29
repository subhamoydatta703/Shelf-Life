// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();

const { getNotification } = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, getNotification);

module.exports = router;
