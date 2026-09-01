import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { sendTestNotificationEmail } from "../services/email.service.js";

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  interviewReminders: true,
  weeklyProgress: true,
  soundEffects: true,
};

const sanitizeUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  profile: user.profile,
  stats: user.stats,
  settings: user.settings ? { ...DEFAULT_SETTINGS, ...user.settings.toObject() } : DEFAULT_SETTINGS,
  createdAt: user.createdAt,
});

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      profile,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (firstName !== undefined) {
      user.firstName = firstName;
    }

    if (lastName !== undefined) {
      user.lastName = lastName;
    }

    if (profile) {
      user.profile = {
        ...user.profile?.toObject?.(),
        ...profile,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const settings = user.settings ? { ...DEFAULT_SETTINGS, ...user.settings.toObject() } : DEFAULT_SETTINGS;

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const currentSettings = user.settings ? user.settings.toObject() : DEFAULT_SETTINGS;
    user.settings = {
      ...currentSettings,
      ...req.body,
    };

    await user.save();

    res.json({
      success: true,
      message: "Settings saved successfully.",
      settings: user.settings,
    });
  } catch (error) {
    next(error);
  }
};

export const sendTestEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const userSettings = user.settings ? { ...DEFAULT_SETTINGS, ...user.settings.toObject() } : DEFAULT_SETTINGS;

    if (userSettings.emailNotifications === false) {
      return res.status(400).json({
        success: false,
        message: "Email notifications are disabled in your settings. Please enable Email Notifications first.",
      });
    }

    const result = await sendTestNotificationEmail({
      to: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });

    res.json({
      success: true,
      message: result.simulated
        ? `Test email notification logged for ${user.email} (simulated, no SMTP server configured).`
        : `Test email notification sent successfully to ${user.email}!`,
      simulated: result.simulated,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const passwordMatch = await comparePassword(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = await hashPassword(newPassword);

    // Invalidate existing refresh token after password change.
    user.refreshToken = null;

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};