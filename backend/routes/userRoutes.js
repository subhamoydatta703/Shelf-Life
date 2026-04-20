// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;