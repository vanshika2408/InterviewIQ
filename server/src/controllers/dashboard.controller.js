import { getDashboard } from "../services/dashboard.service.js";

export const dashboard = async (req, res) => {
  try {
    const data = await getDashboard(req.user._id);

    res.status(200).json({
      success: true,
      dashboard: data,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard.",
    });
  }
};