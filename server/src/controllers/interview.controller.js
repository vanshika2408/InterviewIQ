import {
  createInterview,
  getUserInterviews,
  getInterviewById,
  startInterview,
  submitAnswer,
  completeInterview,
} from "../services/interview.service.js";

import {
  transcribeAudio,
  analyzeSpeech,
} from "../services/speech.service.js";

export const create = async (req, res) => {
  try {
    const interview = await createInterview(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Interview created successfully.",
      interview,
    });
  } catch (error) {
    console.error("Create interview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create interview.",
    });
  }
};


export const getAll = async (req, res) => {
  try {
    const interviews = await getUserInterviews(
      req.user._id
    );

    res.json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Get interviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interviews.",
    });
  }
};


export const getOne = async (req, res) => {
  try {
    const interview = await getInterviewById(
      req.params.id,
      req.user._id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    res.json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Get interview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interview.",
    });
  }
};


export const start = async (req, res) => {
  try {
    const interview = await startInterview(
      req.params.id,
      req.user._id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    res.json({
      success: true,
      message: "Interview started.",
      interview,
    });
  } catch (error) {
    console.error("Start interview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to start interview.",
    });
  }
};


export const answer = async (req, res) => {
  try {
    const interview = await getInterviewById(
      req.params.id,
      req.user._id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    if (interview.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message:
          "Answers can only be submitted while the interview is in progress.",
      });
    }

    const savedAnswer = await submitAnswer(
      req.user._id,
      interview,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Answer submitted.",
      answer: savedAnswer,
    });
  } catch (error) {
    console.error("Submit answer error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const complete = async (req, res) => {
  try {
    const interview = await getInterviewById(
      req.params.id,
      req.user._id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview is already completed.",
      });
    }

    if (interview.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message:
          "Only an in-progress interview can be completed.",
      });
    }

    const completedInterview = await completeInterview(
      req.params.id,
      req.user._id
    );

    res.json({
      success: true,
      message: "Interview completed.",
      interview: completedInterview,
    });
  } catch (error) {
    console.error("Complete interview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to complete interview.",
    });
  }
};


export const processVoiceAnswer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required.",
      });
    }

    const interview = await getInterviewById(
      req.params.id,
      req.user._id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    if (interview.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message:
          "Voice answers can only be submitted while the interview is in progress.",
      });
    }

    const transcription = await transcribeAudio({
      audioBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    const speechAnalysis = await analyzeSpeech({
      transcript: transcription.text,
      duration: Number(req.body.duration || 0),
    });

    res.json({
      success: true,
      transcription,
      speechAnalysis,
    });
  } catch (error) {
    console.error(
      "Voice processing error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to process voice answer.",
    });
  }
};