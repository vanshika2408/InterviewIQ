import Interview from "../models/Interview.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

const questionBank = {
  technical: [
    {
      question:
        "What is the difference between let, const, and var in JavaScript?",
      topic: "JavaScript",
    },
    {
      question:
        "Explain the concept of REST APIs and common HTTP methods.",
      topic: "Web Development",
    },
    {
      question:
        "What is the difference between SQL and NoSQL databases?",
      topic: "Databases",
    },
    {
      question:
        "Explain the difference between authentication and authorization.",
      topic: "Security",
    },
    {
      question:
        "What is the purpose of indexing in a database?",
      topic: "Databases",
    },
  ],

  hr: [
    {
      question: "Tell me about yourself.",
      topic: "Introduction",
    },
    {
      question: "What are your greatest strengths?",
      topic: "Strengths",
    },
    {
      question:
        "What is one weakness you are currently working on?",
      topic: "Weaknesses",
    },
    {
      question:
        "Why do you want to work for our company?",
      topic: "Motivation",
    },
    {
      question:
        "Where do you see yourself in five years?",
      topic: "Career Goals",
    },
  ],

  coding: [
    {
      question:
        "Write a function to reverse a string.",
      topic: "Strings",
    },
    {
      question:
        "Find the maximum element in an array.",
      topic: "Arrays",
    },
    {
      question:
        "Determine whether a string is a palindrome.",
      topic: "Strings",
    },
    {
      question:
        "Find the first non-repeating character in a string.",
      topic: "Strings",
    },
    {
      question:
        "Implement binary search on a sorted array.",
      topic: "Searching",
    },
  ],

  voice: [
    {
      question:
        "Tell me about a challenging project you worked on.",
      topic: "Projects",
    },
    {
      question:
        "Describe a situation where you solved a difficult problem.",
      topic: "Problem Solving",
    },
    {
      question:
        "Tell me about a time you worked successfully in a team.",
      topic: "Teamwork",
    },
    {
      question:
        "How do you handle pressure and tight deadlines?",
      topic: "Work Style",
    },
    {
      question:
        "Why should we hire you?",
      topic: "Motivation",
    },
  ],
};


// --------------------------------------------------
// CREATE INTERVIEW
// --------------------------------------------------

export const createInterview = async (userId, data) => {
  const interview = await Interview.create({
    user: userId,
    ...data,
  });

  const questions =
    questionBank[data.type] ||
    questionBank.technical;

  const selectedQuestions = questions.slice(0, 5);

  const timePerQuestion = Math.max(
    30,
    Math.floor(
      (data.duration * 60) /
        selectedQuestions.length
    )
  );

  const questionDocuments =
    selectedQuestions.map((item, index) => ({
      interview: interview._id,
      question: item.question,
      type: data.type,
      topic: item.topic,
      difficulty:
        data.difficulty || "medium",
      order: index + 1,
      timeLimit: timePerQuestion,
    }));

  await Question.insertMany(questionDocuments);

  return interview;
};


// --------------------------------------------------
// GET USER INTERVIEWS
// --------------------------------------------------

export const getUserInterviews = async (userId) => {
  return Interview.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};


// --------------------------------------------------
// GET INTERVIEW BY ID
// --------------------------------------------------

export const getInterviewById = async (
  interviewId,
  userId
) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    return null;
  }

  const questions = await Question.find({
    interview: interview._id,
  }).sort({
    order: 1,
  });

  const answers = await Answer.find({
    interview: interview._id,
    user: userId,
  }).sort({
    submittedAt: 1,
  });

  return {
    ...interview.toObject(),
    questions,
    answers,
  };
};


// --------------------------------------------------
// START INTERVIEW
// --------------------------------------------------

export const startInterview = async (
  interviewId,
  userId
) => {
  return Interview.findOneAndUpdate(
    {
      _id: interviewId,
      user: userId,
    },
    {
      status: "in-progress",
      startedAt: new Date(),
    },
    {
      new: true,
    }
  );
};


// --------------------------------------------------
// SUBMIT ANSWER
// --------------------------------------------------

export const submitAnswer = async (
  userId,
  interview,
  data
) => {
  const question = await Question.findOne({
    _id: data.questionId,
    interview: interview._id,
  });

  if (!question) {
    throw new Error("Question not found.");
  }

  // Prevent duplicate answers for the same question.
  const existingAnswer = await Answer.findOne({
    interview: interview._id,
    question: question._id,
    user: userId,
  });

  if (existingAnswer) {
    existingAnswer.answer =
      data.answer || "";

    existingAnswer.code =
      data.code || "";

    existingAnswer.language =
      data.language || "";

    existingAnswer.audioUrl =
      data.audioUrl || "";

    existingAnswer.submittedAt =
      new Date();

    await existingAnswer.save();

    return existingAnswer;
  }

  return Answer.create({
    interview: interview._id,
    question: question._id,
    user: userId,
    answer: data.answer || "",
    code: data.code || "",
    language: data.language || "",
    audioUrl: data.audioUrl || "",
  });
};


// --------------------------------------------------
// COMPLETE INTERVIEW
// --------------------------------------------------

export const completeInterview = async (
  interviewId,
  userId
) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interview) {
    return null;
  }

  const questions = await Question.find({
    interview: interview._id,
  });

  const answers = await Answer.find({
    interview: interview._id,
    user: userId,
  });

  let score = 0;

  if (questions.length > 0) {
    const answeredQuestions =
      answers.filter((answer) => {
        return (
          answer.answer?.trim() ||
          answer.code?.trim() ||
          answer.audioUrl
        );
      });

    score = Math.round(
      (answeredQuestions.length /
        questions.length) *
        100
    );
  }

  interview.status = "completed";
  interview.score = score;
  interview.completedAt = new Date();

  await interview.save();

  return interview;
};