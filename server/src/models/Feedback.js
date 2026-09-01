import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    confidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    grammar: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    technicalAccuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completeness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    communication: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    summary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
