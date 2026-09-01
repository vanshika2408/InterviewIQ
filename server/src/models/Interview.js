import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["technical", "hr", "coding", "voice"],
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    language: {
      type: String,
      default: "English",
      trim: true,
    },

    topics: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["created", "in-progress", "completed", "cancelled"],
      default: "created",
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
