import mongoose from "mongoose";

const dailyChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["interview", "coding", "technical", "hr"],
      required: true,
    },

    xpReward: {
      type: Number,
      default: 50,
    },

    date: {
      type: Date,
      required: true,
    },

    completedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DailyChallenge = mongoose.model(
  "DailyChallenge",
  dailyChallengeSchema
);

export default DailyChallenge;
