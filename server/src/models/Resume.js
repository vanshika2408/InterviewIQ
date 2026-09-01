import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    filePath: {
  type: String,
  default: "",
},

    fileSize: {
      type: Number,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
      enum: ["application/pdf"],
    },

    extractedData: {
      skills: {
        type: [String],
        default: [],
      },

      experience: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },

      projects: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },

      education: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },

      atsScore: {
        type: Number,
        default: 0,
      },

      summary: {
        type: String,
        default: "",
      },

      recommendations: {
        type: [String],
        default: [],
      },

      breakdown: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    extractionStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
