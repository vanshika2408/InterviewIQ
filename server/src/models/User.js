import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
  type: String,
  select: false,
  default: null,
},

emailVerificationExpires: {
  type: Date,
  select: false,
  default: null,
},

passwordResetToken: {
  type: String,
  select: false,
  default: null,
},

passwordResetExpires: {
  type: Date,
  select: false,
  default: null,
},

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    profile: {
      location: {
        type: String,
        default: "",
      },

      bio: {
        type: String,
        default: "",
      },

      skills: {
        type: [String],
        default: [],
      },

      education: {
        type: String,
        default: "",
      },

      university: {
        type: String,
        default: "",
      },

      profileImage: {
        type: String,
        default: "",
      },
    },

    stats: {
      completedInterviews: {
        type: Number,
        default: 0,
      },

      averageScore: {
        type: Number,
        default: 0,
      },

      hoursPracticed: {
        type: Number,
        default: 0,
      },

      streak: {
        type: Number,
        default: 0,
      },

      xp: {
        type: Number,
        default: 0,
      },

      level: {
        type: Number,
        default: 1,
      },
    },

    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      interviewReminders: {
        type: Boolean,
        default: true,
      },
      weeklyProgress: {
        type: Boolean,
        default: true,
      },
      soundEffects: {
        type: Boolean,
        default: true,
      },
      darkMode: {
        type: Boolean,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;