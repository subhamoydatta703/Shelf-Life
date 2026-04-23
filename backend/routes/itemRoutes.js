// routes/itemRoutes.js
const express = require("express");
const router = express.Router();

const { createItem, getItems, updateItem,deleteItem } = require("../controllers/itemController");
const { authMiddleware } = require("../middleware/auth");

router.post("/items/create", authMiddleware, createItem);
router.get("/items", authMiddleware, getItems);
router.put("/items/:id", authMiddleware, updateItem);
router.delete("/items/:id", authMiddleware, deleteItem);

module.exports = router;