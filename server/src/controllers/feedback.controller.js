import {
  generateFeedback,
  getFeedback,
} from "../services/feedback.service.js";

export const createFeedback = async (req, res) => {
  try {
    const feedback = await generateFeedback(
      req.params.id,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Interview feedback generated.",
      feedback,
    });
  } catch (error) {
    console.error("Feedback generation error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInterviewFeedback = async (req, res) => {
  try {
    const feedback = await getFeedback(
      req.params.id,
      req.user._id
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback.",
    });
  }
};
