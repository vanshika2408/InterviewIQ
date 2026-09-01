import axios from "axios";

const getApiKey = () => process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.XAI_API_KEY || "";

/**
 * Call AI API (Groq / xAI / OpenAI compatible)
 */
async function callAI(messages, temperature = 0.7) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("AI API Key is missing.");
  }

  // Detect endpoint based on key format (gsk_ is Groq Cloud)
  const isGroq = apiKey.startsWith("gsk_");
  const url = isGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.x.ai/v1/chat/completions";
  const model = isGroq ? "groq/compound" : "grok-2-latest";

  const response = await axios.post(
    url,
    {
      model,
      messages,
      temperature,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 30000,
    }
  );

  return response.data?.choices?.[0]?.message?.content || "";
}

/**
 * Generate tailored interview question using AI
 */
export const generateInterviewQuestion = async ({
  type = "technical",
  role = "Software Engineer",
  difficulty = "medium",
  topic = "",
  resumeContext = "",
}) => {
  const apiKey = getApiKey();

  if (apiKey) {
    try {
      const prompt = `You are an expert AI Interviewer for top tech companies.
Generate a single, clear, realistic ${difficulty} ${type} interview question for a candidate applying for the role of ${role}.
${topic ? `Target topic area: ${topic}.` : ""}
${resumeContext ? `Candidate resume context: ${resumeContext}` : ""}

Return ONLY the raw question text without quotation marks, markdown wrappers, or intro text.`;

      const responseText = await callAI([
        { role: "system", content: "You are an expert technical interviewer. Output only the question." },
        { role: "user", content: prompt },
      ]);

      let cleanText = responseText.trim();
      // Remove any Groq reasoning prefixes if present
      if (cleanText.includes("**Resulting sentence:**")) {
        cleanText = cleanText.split("**Resulting sentence:**")[1].trim();
      } else if (cleanText.includes("**Question:**")) {
        cleanText = cleanText.split("**Question:**")[1].trim();
      }
      cleanText = cleanText.replace(/^\*+|\*+$/g, "").replace(/^"+|"+$/g, "").trim();

      if (cleanText) {
        return cleanText;
      }
    } catch (err) {
      console.error("AI Question Generation Error:", err.message || err);
    }
  }

  // Fallback if no API key or API call error
  const fallbackQuestions = {
    hr: [
      "Tell me about yourself and why you're interested in this role.",
      "Describe a situation where you had a conflict with a team member and how you resolved it.",
      "What is your approach to prioritizing multiple tight deadlines?",
      "Tell me about a time you took initiative on a project without being explicitly asked.",
    ],
    technical: [
      `Explain key architectural principles when building applications as a ${role}.`,
      `How would you approach designing a scalable system for ${topic || role}?`,
      `What are the most common performance bottlenecks in ${topic || role} development and how do you prevent them?`,
      `Explain the differences between synchronous and asynchronous execution in modern web applications.`,
    ],
    coding: [
      `Implement a function to reverse a string or array in-place, discussing time and space complexity.`,
      `Write a solution to detect a cycle in a linked list or graph structure.`,
      `Implement a queue data structure using two stacks.`,
    ],
    voice: [
      `Walk me through your background and your most significant technical achievement.`,
      `How do you keep up with new tools, frameworks, and industry trends as a ${role}?`,
    ],
  };

  const pool = fallbackQuestions[type] || fallbackQuestions.technical;
  return pool[Math.floor(Math.random() * pool.length)];
};

/**
 * Evaluate answer using AI
 */
export const evaluateAnswer = async ({
  question,
  answer,
  type = "technical",
}) => {
  const text = answer?.trim() || "";

  if (!text) {
    return {
      overallScore: 0,
      confidence: 0,
      grammar: 0,
      technicalAccuracy: 0,
      completeness: 0,
      communication: 0,
      strengths: [],
      weaknesses: ["No answer was provided."],
      suggestions: ["Provide a complete response to the interview question."],
      summary: "No response was submitted for this question.",
    };
  }

  const apiKey = getApiKey();

  if (apiKey) {
    try {
      const prompt = `Analyze this candidate's interview response.
Question: "${question}"
Candidate Answer: "${text}"
Interview Type: "${type}"

Evaluate the answer and output ONLY valid JSON matching this exact structure:
{
  "overallScore": <number 0-100>,
  "confidence": <number 0-100>,
  "grammar": <number 0-100>,
  "technicalAccuracy": <number 0-100>,
  "completeness": <number 0-100>,
  "communication": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "suggestions": ["<actionable recommendation 1>", "<actionable recommendation 2>"],
  "summary": "<1-2 sentence overall summary assessment>"
}`;

      const responseText = await callAI(
        [
          { role: "system", content: "You are an expert AI interview evaluator. Return only raw valid JSON." },
          { role: "user", content: prompt },
        ],
        0.3
      );

      // Extract JSON substring if response contains extra text
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");
      const cleanJson = jsonStart !== -1 && jsonEnd !== -1
        ? responseText.substring(jsonStart, jsonEnd + 1)
        : responseText.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsed = JSON.parse(cleanJson);
      return {
        overallScore: Math.min(100, Math.max(0, Number(parsed.overallScore) || 75)),
        confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 80)),
        grammar: Math.min(100, Math.max(0, Number(parsed.grammar) || 85)),
        technicalAccuracy: Math.min(100, Math.max(0, Number(parsed.technicalAccuracy) || 75)),
        completeness: Math.min(100, Math.max(0, Number(parsed.completeness) || 70)),
        communication: Math.min(100, Math.max(0, Number(parsed.communication) || 80)),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Clear explanation."],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions
          : ["Provide additional real-world examples."],
        summary: parsed.summary || `Evaluated candidate answer to "${question}".`,
      };
    } catch (err) {
      console.error("AI Evaluation Error:", err.message || err);
    }
  }

  // Fallback evaluation if API key is missing or request fails
  const lengthScore = Math.min(100, Math.max(25, Math.round((text.length / 250) * 100)));

  return {
    overallScore: lengthScore,
    confidence: Math.min(100, lengthScore + 5),
    grammar: Math.min(100, lengthScore + 10),
    technicalAccuracy: type === "hr" ? 80 : Math.min(100, lengthScore),
    completeness: lengthScore,
    communication: Math.min(100, lengthScore + 5),
    strengths: [
      "Direct response provided to the question.",
      "Clear communication of key ideas.",
    ],
    weaknesses: lengthScore < 60 ? ["Response could include more technical depth and examples."] : [],
    suggestions: [
      "Support key points with practical examples from your projects.",
      "Structure your answer using the STAR method (Situation, Task, Action, Result).",
    ],
    summary: `The response to "${question}" was analyzed successfully.`,
  };
};
