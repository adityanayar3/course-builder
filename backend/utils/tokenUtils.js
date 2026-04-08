const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ACCESS_COOKIE_NAME = "course_builder_access";
const REFRESH_COOKIE_NAME = "course_builder_refresh";

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || getJwtSecret();
}

function getCookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function buildTokenPayload(user) {
  return {
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function generateAccessToken(user) {
  return jwt.sign(buildTokenPayload(user), getJwtSecret(), {
    expiresIn: process.env.ACCESS_TOKEN_TTL || "15m",
  });
}

function generateRefreshToken(user, tokenVersion = 0) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tokenVersion,
    },
    getRefreshSecret(),
    {
      expiresIn: process.env.REFRESH_TOKEN_TTL || "7d",
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret());
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshSecret());
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, getCookieOptions(15 * 60 * 1000));
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
}

function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE_NAME, getCookieOptions(0));
  res.clearCookie(REFRESH_COOKIE_NAME, getCookieOptions(0));
}

module.exports = {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  clearAuthCookies,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  verifyAccessToken,
  verifyRefreshToken,
};
