import { getAnalytics } from "../services/analytics.service.js";

export const getUserAnalytics = async (req, res) => {
  try {
    const analytics = await getAnalytics(req.user._id);

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics.",
    });
  }
};
