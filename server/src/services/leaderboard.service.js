import User from "../models/User.js";
import Achievement from "../models/Achievement.js";
import DailyChallenge from "../models/DailyChallenge.js";
import Interview from "../models/Interview.js";
import Resume from "../models/Resume.js";

export const getLeaderboard = async () => {
  const users = await User.find({ isActive: { $ne: false } })
    .select("firstName lastName profile stats createdAt")
    .sort({ "stats.xp": -1, "stats.completedInterviews": -1 })
    .limit(50)
    .lean();

  return users.map((user, index) => ({
    id: user._id,
    rank: index + 1,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous Candidate",
    xp: user.stats?.xp || 0,
    level: user.stats?.level || Math.floor((user.stats?.xp || 0) / 500) + 1,
    interviewsCompleted: user.stats?.completedInterviews || 0,
    averageScore: user.stats?.averageScore || 0,
    streak: user.stats?.streak || 0,
    profileImage: user.profile?.profileImage || "",
  }));
};

export const getAchievements = async (userId) => {
  const user = await User.findById(userId).lean();
  const interviews = await Interview.find({ user: userId, status: "completed" }).lean();
  const resume = await Resume.findOne({ user: userId }).lean();

  const completedCount = interviews.length;
  const bestScore = interviews.length > 0 ? Math.max(...interviews.map((i) => i.score || 0)) : 0;
  const xp = user?.stats?.xp || 0;
  const level = Math.floor(xp / 500) + 1;
  const streak = user?.stats?.streak || 0;

  const badges = [
    {
      id: "first_step",
      title: "First Step",
      description: "Complete your first interview session",
      icon: "star",
      category: "Interviews",
      unlocked: completedCount >= 1,
      progress: Math.min(100, Math.round((completedCount / 1) * 100)),
    },
    {
      id: "high_scorer",
      title: "High Scorer",
      description: "Score 90% or higher in an interview session",
      icon: "trophy",
      category: "Performance",
      unlocked: bestScore >= 90,
      progress: Math.min(100, Math.round((bestScore / 90) * 100)),
    },
    {
      id: "resume_ready",
      title: "Resume Ready",
      description: "Upload and analyze your PDF resume with AI",
      icon: "file",
      category: "Profile",
      unlocked: !!resume,
      progress: resume ? 100 : 0,
    },
    {
      id: "consistent",
      title: "Consistent Practitioner",
      description: "Complete at least 3 practice interviews",
      icon: "flame",
      category: "Consistency",
      unlocked: completedCount >= 3,
      progress: Math.min(100, Math.round((completedCount / 3) * 100)),
    },
    {
      id: "veteran",
      title: "Interview Veteran",
      description: "Complete 10 practice interviews",
      icon: "medal",
      category: "Milestones",
      unlocked: completedCount >= 10,
      progress: Math.min(100, Math.round((completedCount / 10) * 100)),
    },
    {
      id: "master",
      title: "InterviewIQ Master",
      description: "Reach Level 2 (500+ XP)",
      icon: "award",
      category: "XP & Level",
      unlocked: level >= 2,
      progress: Math.min(100, Math.round((xp / 500) * 100)),
    },
  ];

  return {
    userStats: {
      xp,
      level,
      nextLevelXp: level * 500,
      completedInterviews: completedCount,
      bestScore,
      streak,
      unlockedBadgesCount: badges.filter((b) => b.unlocked).length,
      totalBadgesCount: badges.length,
    },
    badges,
  };
};

export const getDailyChallenge = async (userId) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  let challenge = await DailyChallenge.findOne({
    date: {
      $gte: start,
      $lt: end,
    },
  });

  if (!challenge) {
    challenge = await DailyChallenge.create({
      title: "Complete an Interview",
      description: "Complete one practice interview today.",
      type: "interview",
      xpReward: 50,
      date: start,
      completedBy: [],
    });
  }

  const completed = challenge.completedBy.some(
    (id) => id.toString() === userId.toString()
  );

  return {
    challenge,
    completed,
  };
};

export const completeDailyChallenge = async (
  challengeId,
  userId
) => {
  const challenge = await DailyChallenge.findById(
    challengeId
  );

  if (!challenge) {
    throw new Error("Challenge not found.");
  }

  const alreadyCompleted = challenge.completedBy.some(
    (id) => id.toString() === userId.toString()
  );

  if (alreadyCompleted) {
    return {
      challenge,
      xpAwarded: 0,
    };
  }

  challenge.completedBy.push(userId);
  await challenge.save();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.stats.xp += challenge.xpReward;

  user.stats.level =
    Math.floor(user.stats.xp / 1000) + 1;

  await user.save();

  return {
    challenge,
    xpAwarded: challenge.xpReward,
  };
};