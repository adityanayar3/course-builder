const express = require("express");
const router = express.Router();

const { googleLogin, getMe } = require("../controllers/authController");

router.post("/google", googleLogin);
router.get("/me", getMe);

module.exports = router;