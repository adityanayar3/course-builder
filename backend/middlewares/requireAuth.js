const User = require("../models/user");
const { ACCESS_COOKIE_NAME, verifyAccessToken } = require("../utils/tokenUtils");

async function requireAuth(req, res, next) {
  try {
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;
    const accessToken = req.cookies?.[ACCESS_COOKIE_NAME] || bearerToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = verifyAccessToken(accessToken);
    const user = await User.findById(payload.sub).select("-refreshTokenHash");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}

module.exports = requireAuth;
