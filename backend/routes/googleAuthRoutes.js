const express = require("express");
const router = express.Router();
const passport = require("../middlewares/googleAuth");
const controller = require("./../controllers/googleAuthController");
const requireAuth = require("../middlewares/requireAuth");

// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
  controller.googleCallback
);

router.post("/refresh", controller.refresh);
router.get("/me", requireAuth, controller.me);
router.post("/logout", requireAuth, controller.logout);

module.exports = router;
