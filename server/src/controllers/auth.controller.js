import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import env from "../config/env.js";

import {
  comparePassword,
  hashPassword,
} from "../utils/hashPassword.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";


// --------------------------------------------------
// AUTH RESPONSE
// --------------------------------------------------

const sendAuthResponse = async (res, user, statusCode, message) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.status(statusCode).json({
    success: true,
    message,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      profile: user.profile,
      stats: user.stats,
    },
  });
};


// --------------------------------------------------
// REGISTER
// --------------------------------------------------

export const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,

      emailVerificationToken:
        hashedVerificationToken,

      emailVerificationExpires:
        new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Development only.
    // Later this token will be sent through email.
    if (env.nodeEnv !== "production") {
      console.log(
        `Email verification token for ${user.email}: ${verificationToken}`
      );
    }

    await sendAuthResponse(
      res,
      user,
      201,
      "Account created successfully."
    );
  } catch (error) {
    next(error);
  }
};


// --------------------------------------------------
// LOGIN
// --------------------------------------------------

export const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    const passwordMatch = await comparePassword(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    await sendAuthResponse(
      res,
      user,
      200,
      "Login successful."
    );
  } catch (error) {
    next(error);
  }
};


// --------------------------------------------------
// REFRESH ACCESS TOKEN
// --------------------------------------------------

export const refreshAccessToken = async (
  req,
  res,
  next
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required.",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      env.jwtRefreshSecret
    );

    const user = await User.findById(
      decoded.userId
    ).select("+refreshToken");

    if (
      !user ||
      !user.refreshToken ||
      user.refreshToken !== refreshToken
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // Rotate refresh token
    const newAccessToken =
      generateAccessToken(user._id);

    const newRefreshToken =
      generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;

    await user.save();

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    next(error);
  }
};


// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

export const logout = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("+refreshToken");

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};


// --------------------------------------------------
// VERIFY EMAIL
// --------------------------------------------------

export const verifyEmail = async (
  req,
  res,
  next
) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: {
        $gt: new Date(),
      },
    }).select(
      "+emailVerificationToken +emailVerificationExpires"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired verification token.",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    next(error);
  }
};


// --------------------------------------------------
// FORGOT PASSWORD
// --------------------------------------------------

export const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Don't reveal whether an account exists.
    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been generated.",
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;

    user.passwordResetExpires =
      new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    // Development only.
    // Replace with actual email delivery later.
    if (env.nodeEnv !== "production") {
      console.log(
        `Password reset token for ${user.email}: ${resetToken}`
      );
    }

    res.json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been generated.",
    });
  } catch (error) {
    next(error);
  }
};


// --------------------------------------------------
// RESET PASSWORD
// --------------------------------------------------

export const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    const {
      token,
      password,
    } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Token and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: new Date(),
      },
    }).select(
      "+passwordResetToken +passwordResetExpires"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired password reset token.",
      });
    }

    user.password = await hashPassword(password);

    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    // Invalidate existing sessions
    user.refreshToken = null;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    next(error);
  }
};