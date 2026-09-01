import Interview from "../models/Interview.js";
import Feedback from "../models/Feedback.js";

export const getAnalytics = async (userId) => {
  const [interviews, feedback] = await Promise.all([
    Interview.find({
      user: userId,
      status: "completed",
    })
      .sort({ completedAt: 1 })
      .lean(),

    Feedback.find({
      user: userId,
    })
      .sort({ createdAt: 1 })
      .lean(),
  ]);

  const totalInterviews = interviews.length;

  const averageScore =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce(
            (sum, interview) => sum + interview.score,
            0
          ) / totalInterviews
        )
      : 0;

  const latestInterview =
    interviews.length > 0
      ? interviews[interviews.length - 1]
      : null;

  const latestFeedback =
    feedback.length > 0
      ? feedback[feedback.length - 1]
      : null;

  const scores = feedback.map((item) => ({
    date: item.createdAt,
    score: item.overallScore || 0,
    confidence: item.confidence || 0,
    grammar: item.grammar || 0,
    technicalAccuracy: item.technicalAccuracy || 0,
    completeness: item.completeness || 0,
    communication: item.communication || 0,
  }));

  // -----------------------------
  // Topic analysis
  // -----------------------------

  const topicMap = {};

  interviews.forEach((interview) => {
    (interview.topics || []).forEach((topic) => {
      if (!topicMap[topic]) {
        topicMap[topic] = {
          topic,
          interviews: 0,
          totalScore: 0,
        };
      }

      topicMap[topic].interviews += 1;
      topicMap[topic].totalScore += interview.score || 0;
    });
  });

  const topicAnalysis = Object.values(topicMap)
    .map((item) => ({
      topic: item.topic,
      interviews: item.interviews,
      averageScore: Math.round(
        item.totalScore / item.interviews
      ),
    }))
    .sort((a, b) => b.averageScore - a.averageScore);

  // -----------------------------
  // Role/domain analysis
  // -----------------------------

  const domainMap = {};

  interviews.forEach((interview) => {
    const role = interview.role;

    if (!domainMap[role]) {
      domainMap[role] = {
        role,
        count: 0,
        totalScore: 0,
      };
    }

    domainMap[role].count += 1;
    domainMap[role].totalScore += interview.score || 0;
  });

  const domainAnalysis = Object.values(domainMap)
    .map((item) => ({
      role: item.role,
      interviews: item.count,
      averageScore: Math.round(
        item.totalScore / item.count
      ),
    }))
    .sort((a, b) => b.averageScore - a.averageScore);

  // -----------------------------
  // Weak areas
  // -----------------------------

  const weakAreas = latestFeedback?.weaknesses || [];

  return {
    totalInterviews,

    averageScore,

    latestScore: latestInterview?.score || 0,

    scores,

    topicAnalysis,

    domainAnalysis,

    confidence: latestFeedback?.confidence || 0,

    accuracy:
      latestFeedback?.technicalAccuracy || 0,

    communication:
      latestFeedback?.communication || 0,

    weakAreas,
  };
};