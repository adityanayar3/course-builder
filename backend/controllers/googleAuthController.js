const User = require("../models/user");
const {
  REFRESH_COOKIE_NAME,
  clearAuthCookies,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  verifyRefreshToken,
} = require("../utils/tokenUtils");

async function findOrCreateUser(profile) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value?.toLowerCase();
  const picture = profile.photos?.[0]?.value || "";
  const name = profile.displayName || "Course Builder User";

  if (!email) {
    throw new Error("Google account email is required");
  }

  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (!user) {
    user = await User.create({
      auth0Sub: `google|${googleId}`,
      googleId,
      email,
      name,
      picture,
      role: "creator",
    });
  } else {
    user.googleId = googleId;
    user.auth0Sub = `google|${googleId}`;
    user.email = email;
    user.name = name;
    user.picture = picture;
  }

  user.lastLoginAt = new Date();
  return user;
}

async function issueSession(res, user) {
  const refreshToken = generateRefreshToken(user, user.tokenVersion);
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  const accessToken = generateAccessToken(user);
  setAuthCookies(res, accessToken, refreshToken);

  return {
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
    },
  };
}

exports.googleAuth = (req, res, next) => {
  next();
};

exports.googleCallback = async (req, res) => {
  try {
    const user = await findOrCreateUser(req.user);
    const session = await issueSession(res, user);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = new URL("/dashboard", frontendUrl);

    redirectUrl.searchParams.set("login", "success");
    redirectUrl.searchParams.set("name", session.user.name || "");

    res.redirect(redirectUrl.toString());
  } catch (error) {
    res.status(500).json({ message: error.message || "Auth failed" });
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);

    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ message: "Refresh session not found" });
    }

    if (user.refreshTokenHash !== hashToken(refreshToken)) {
      return res.status(401).json({ message: "Refresh token mismatch" });
    }

    const session = await issueSession(res, user);
    return res.status(200).json(session);
  } catch (error) {
    return res.status(401).json({ message: "Refresh token is invalid or expired" });
  }
};

exports.me = async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
      role: req.user.role,
    },
  });
};

exports.logout = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.refreshTokenHash = undefined;
    await user.save();
  }

  clearAuthCookies(res);
  res.status(200).json({ message: "Logged out successfully" });
};
