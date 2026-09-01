import User from "../models/User.js";
import Interview from "../models/Interview.js";
import Resume from "../models/Resume.js";
import Feedback from "../models/Feedback.js";
import Achievement from "../models/Achievement.js";
import DailyChallenge from "../models/DailyChallenge.js";

export const getDashboard = async (userId) => {
  const user = await User.findById(userId)
    .select("firstName lastName email role profile stats")
    .lean();

  if (!user) {
    throw new Error("User not found.");
  }

  const [
    interviews,
    completedInterviews,
    resume,
    recentFeedback,
    achievements,
  ] = await Promise.all([
    Interview.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Interview.find({
      user: userId,
      status: "completed",
    })
      .sort({ completedAt: -1 })
      .limit(5)
      .lean(),

    Resume.findOne({
      user: userId,
    }).lean(),

    Feedback.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),

    Achievement.find({
      user: userId,
    })
      .sort({ unlockedAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const totalInterviews = await Interview.countDocuments({
    user: userId,
  });

  const completedCount = await Interview.countDocuments({
    user: userId,
    status: "completed",
  });

  const inProgressCount = await Interview.countDocuments({
    user: userId,
    status: "in-progress",
  });

  const averageScore =
    completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce(
            (sum, interview) =>
              sum + (interview.score || 0),
            0
          ) / completedInterviews.length
        )
      : 0;

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  let dailyChallenge = await DailyChallenge.findOne({
    date: {
      $gte: start,
      $lt: end,
    },
  }).lean();

  if (!dailyChallenge) {
    try {
      const created = await DailyChallenge.create({
        title: "Complete an Interview",
        description: "Complete one practice interview today.",
        type: "interview",
        xpReward: 50,
        date: start,
        completedBy: [],
      });
      dailyChallenge = created.toObject();
    } catch (e) {
      // Ignore if duplicate creation race condition
    }
  }

  let challenge = null;

  if (dailyChallenge) {
    challenge = {
      ...dailyChallenge,
      completed: Array.isArray(dailyChallenge.completedBy)
        ? dailyChallenge.completedBy.some((id) => id.toString() === userId.toString())
        : false,
    };

    delete challenge.completedBy;
  }

  return {
    user,

    stats: {
      ...(user.stats || {}),
      totalInterviews,
      completedInterviews: completedCount,
      inProgressInterviews: inProgressCount,
      averageScore,
      xp: user.stats?.xp || 0,
      level: user.stats?.level || 1,
      streak: user.stats?.streak || 0,
    },

    recentInterviews: interviews,

    recentCompletedInterviews:
      completedInterviews,

    resume: resume
      ? {
          id: resume._id,
          fileName: resume.fileName,
          fileSize: resume.fileSize,
          mimeType: resume.mimeType,
          extractionStatus:
            resume.extractionStatus,
          extractedData:
            resume.extractedData,
          createdAt: resume.createdAt,
          updatedAt: resume.updatedAt,
        }
      : null,

    recentFeedback,

    achievements,

    dailyChallenge: challenge,
  };
};