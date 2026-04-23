// routes/itemRoutes.js
const express = require("express");
const router = express.Router();

const { createItem, getItems } = require("../controllers/itemController");
const { authMiddleware } = require("../middleware/auth");

router.post("/create", authMiddleware, createItem);
router.get("/", authMiddleware, getItems);

module.exports = router;