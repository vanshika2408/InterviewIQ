import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    certificateId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      default: "InterviewIQ Interview Certificate",
    },

    role: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
