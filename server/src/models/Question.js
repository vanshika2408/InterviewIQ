import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["technical", "hr", "coding", "voice"],
      required: true,
    },

    topic: {
      type: String,
      default: "",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    order: {
      type: Number,
      required: true,
    },

    timeLimit: {
      type: Number,
      default: 120,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
