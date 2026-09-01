import {
  getLeaderboard,
  getAchievements,
  getDailyChallenge,
  completeDailyChallenge,
} from "../services/leaderboard.service.js";

export const leaderboard = async (req, res) => {
  try {
    const users = await getLeaderboard();

    res.json({
      success: true,
      leaderboard: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard.",
    });
  }
};

export const achievements = async (req, res) => {
  try {
    const data = await getAchievements(req.user._id);

    res.json({
      success: true,
      achievements: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements.",
    });
  }
};

export const dailyChallenge = async (req, res) => {
  try {
    const data = await getDailyChallenge(req.user._id);

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily challenge.",
    });
  }
};

export const completeChallenge = async (req, res) => {
  try {
    const data = await completeDailyChallenge(
      req.params.id,
      req.user._id
    );

    res.json({
      success: true,
      message: "Challenge completed.",
      ...data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
