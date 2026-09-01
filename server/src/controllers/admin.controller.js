import User from "../models/User.js";
import Interview from "../models/Interview.js";
import Feedback from "../models/Feedback.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const [users, interviews, feedback] = await Promise.all([
      User.countDocuments(),
      Interview.countDocuments(),
      Feedback.countDocuments(),
    ]);

    const completedInterviews = await Interview.countDocuments({
      status: "completed",
    });

    res.json({
      success: true,
      reports: {
        totalUsers: users,
        totalInterviews: interviews,
        completedInterviews,
        totalFeedback: feedback,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalInterviews,
      completedInterviews,
      activeUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Interview.countDocuments(),
      Interview.countDocuments({ status: "completed" }),
      User.countDocuments({
        updatedAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalInterviews,
        completedInterviews,
        activeUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAIUsage = async (req, res, next) => {
  try {
    const totalInterviews = await Interview.countDocuments();

    const completedInterviews = await Interview.countDocuments({
      status: "completed",
    });

    res.json({
      success: true,
      aiUsage: {
        totalRequests: totalInterviews,
        completedRequests: completedInterviews,
        estimatedUsage: totalInterviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPlans = async (req, res) => {
  res.json({
    success: true,
    plans: [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: [
          "Limited AI interviews",
          "Basic feedback",
          "Basic analytics",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        price: 999,
        features: [
          "Unlimited interviews",
          "Advanced AI feedback",
          "Advanced analytics",
          "Certificates",
        ],
      },
    ],
  });
};

export const moderateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    if (!["activate", "deactivate"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid moderation action.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isActive = action === "activate";
    await user.save();

    res.json({
      success: true,
      message: `User ${action}d successfully.`,
    });
  } catch (error) {
    next(error);
  }
};