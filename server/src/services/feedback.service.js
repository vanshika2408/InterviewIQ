import Feedback from "../models/Feedback.js";
import Interview from "../models/Interview.js";
import Answer from "../models/Answer.js";
import { evaluateAnswer } from "./ai.service.js";

export const generateFeedback = async (interviewId, userId) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    throw new Error("Interview not found.");
  }

  if (interview.status === "created") {
    throw new Error(
      "Interview has not been started yet."
    );
  }

  if (interview.status === "cancelled") {
    throw new Error(
      "Feedback cannot be generated for a cancelled interview."
    );
  }

  const answers = await Answer.find({
    interview: interviewId,
    user: userId,
  })
    .populate("question")
    .sort({ "question.order": 1 });

  if (!answers.length) {
    throw new Error(
      "No answers found for this interview."
    );
  }

  const validAnswers = answers.filter(
    (answer) => answer.question
  );

  if (!validAnswers.length) {
    throw new Error(
      "No valid questions found for the submitted answers."
    );
  }

  const evaluations = [];

  for (const answer of validAnswers) {
    const responseText =
      answer.answer?.trim() ||
      answer.code?.trim() ||
      "";

    const evaluation = await evaluateAnswer({
      question: answer.question.question,
      answer: responseText,
      type: interview.type,
    });

    evaluations.push(evaluation);
  }

  const average = (field) => {
    const values = evaluations.map(
      (evaluation) => Number(evaluation[field]) || 0
    );

    if (!values.length) {
      return 0;
    }

    return Math.round(
      values.reduce((sum, value) => sum + value, 0) /
        values.length
    );
  };

  const strengths = [
    ...new Set(
      evaluations.flatMap(
        (evaluation) => evaluation.strengths || []
      )
    ),
  ];

  const weaknesses = [
    ...new Set(
      evaluations.flatMap(
        (evaluation) => evaluation.weaknesses || []
      )
    ),
  ];

  const suggestions = [
    ...new Set(
      evaluations.flatMap(
        (evaluation) => evaluation.suggestions || []
      )
    ),
  ];

  const feedback = await Feedback.findOneAndUpdate(
    {
      interview: interviewId,
      user: userId,
    },
    {
      interview: interviewId,
      user: userId,

      overallScore: average("overallScore"),
      confidence: average("confidence"),
      grammar: average("grammar"),
      technicalAccuracy: average("technicalAccuracy"),
      completeness: average("completeness"),
      communication: average("communication"),

      strengths,
      weaknesses,
      suggestions,

      summary:
        "Your interview responses have been evaluated.",
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  await Interview.findOneAndUpdate(
    {
      _id: interviewId,
      user: userId,
    },
    {
      score: feedback.overallScore,
      status: "completed",
      completedAt: interview.completedAt || new Date(),
    }
  );

  return feedback;
};

export const getFeedback = async (
  interviewId,
  userId
) => {
  return Feedback.findOne({
    interview: interviewId,
    user: userId,
  }).lean();
};