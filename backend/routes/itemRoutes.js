// routes/itemRoutes.js
const express = require("express");
const router = express.Router();

const { createItem } = require("../controllers/itemController");
const { authMiddleware } = require("../middleware/auth");

router.post("/create", authMiddleware, createItem);

module.exports = router;