import fs from "fs";
import { createRequire } from "module";
import axios from "axios";
import Resume from "../models/Resume.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const getApiKey = () => process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.XAI_API_KEY || "";

/**
 * Extract structured resume data using AI
 */
async function extractResumeDataWithAI(rawText) {
  const apiKey = getApiKey();

  if (apiKey && rawText.trim()) {
    try {
      const isGroq = apiKey.startsWith("gsk_");
      const url = isGroq
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.x.ai/v1/chat/completions";
      const model = isGroq ? "groq/compound" : "grok-2-latest";

      const prompt = `Analyze this candidate's resume text for ATS (Applicant Tracking System) optimization:
"${rawText.slice(0, 4000)}"

Extract structured information and evaluate ATS compatibility into valid raw JSON matching this structure:
{
  "skills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "experience": ["<role/position 1>", "<role/position 2>"],
  "projects": ["<project name 1>", "<project name 2>"],
  "education": ["<degree/university>"],
  "atsScore": <number 0-100 representing overall ATS readiness score>,
  "summary": "<1-2 sentence overall evaluation of ATS readiness and structure>",
  "recommendations": [
    "<actionable recommendation 1 to improve ATS score>",
    "<actionable recommendation 2 to improve ATS score>",
    "<actionable recommendation 3 to improve ATS score>"
  ],
  "breakdown": {
    "formatting": <number 0-100>,
    "keywordDensity": <number 0-100>,
    "quantifiableImpact": <number 0-100>,
    "sectionCompleteness": <number 0-100>
  }
}
Return ONLY valid raw JSON with no markdown formatting.`;

      const response = await axios.post(
        url,
        {
          model,
          messages: [
            { role: "system", content: "You are an expert ATS resume parser and recruitment specialist. Output only valid JSON." },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 30000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content || "";
      const jsonStart = content.indexOf("{");
      const jsonEnd = content.lastIndexOf("}");
      const cleanJson = jsonStart !== -1 && jsonEnd !== -1
        ? content.substring(jsonStart, jsonEnd + 1)
        : content.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsed = JSON.parse(cleanJson);

      return {
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        atsScore: Math.min(100, Math.max(0, Number(parsed.atsScore) || 75)),
        summary: parsed.summary || "AI analyzed your resume structure for ATS compatibility.",
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [
          "Add quantifiable metrics and measurable achievements to your project descriptions.",
          "Ensure standard section headings like Skills, Experience, and Education.",
          "Incorporate relevant industry technology keywords to boost search visibility."
        ],
        breakdown: {
          formatting: Number(parsed.breakdown?.formatting) || 80,
          keywordDensity: Number(parsed.breakdown?.keywordDensity) || 75,
          quantifiableImpact: Number(parsed.breakdown?.quantifiableImpact) || 70,
          sectionCompleteness: Number(parsed.breakdown?.sectionCompleteness) || 85,
        },
      };
    } catch (err) {
      console.error("Resume AI Extraction Error:", err.message || err);
    }
  }

  // Fallback skill extraction if AI fails
  const skillKeywords = ["React", "JavaScript", "Node.js", "Express", "MongoDB", "Python", "Java", "C++", "Git", "HTML", "CSS", "SQL", "TypeScript", "Docker", "AWS"];
  const lowerText = (rawText || "").toLowerCase();
  const foundSkills = skillKeywords.filter((s) => lowerText.includes(s.toLowerCase()));

  return {
    skills: foundSkills.length > 0 ? foundSkills : [],
    experience: [],
    projects: [],
    education: [],
    atsScore: foundSkills.length > 0 ? 70 : 0,
    summary: foundSkills.length > 0 ? "Basic resume text analyzed." : "No resume text found.",
    recommendations: [
      "Upload a detailed PDF resume to calculate full AI ATS scores and recommendations."
    ],
    breakdown: {
      formatting: 70,
      keywordDensity: 65,
      quantifiableImpact: 60,
      sectionCompleteness: 70,
    },
  };
}

export const createOrUpdateResume = async (userId, data) => {
  const existingResume = await Resume.findOne({ user: userId });

  let rawText = "";
  try {
    let buffer = data.buffer;
    if (!buffer && data.filePath && fs.existsSync(data.filePath)) {
      buffer = fs.readFileSync(data.filePath);
    }
    if (buffer) {
      if (typeof pdfParse === "function") {
        const pdfData = await pdfParse(buffer);
        rawText = pdfData.text || "";
      } else if (pdfParse?.PDFParse) {
        const parser = new pdfParse.PDFParse({ data: buffer });
        const res = await parser.getText();
        rawText = typeof res === "string" ? res : (res?.text || "");
      }
    }
  } catch (err) {
    console.error("PDF Parsing Error:", err);
  }

  const extractedData = await extractResumeDataWithAI(rawText);

  const resumeData = {
    user: userId,
    fileName: data.fileName,
    filePath: data.filePath || "",
    fileSize: data.fileSize,
    mimeType: data.mimeType,
    extractionStatus: "completed",
    rawText,
    extractedData,
  };

  if (existingResume) {
    return Resume.findOneAndUpdate({ user: userId }, resumeData, { new: true });
  }

  return Resume.create(resumeData);
};

export const getUserResume = async (userId) => {
  return Resume.findOne({ user: userId });
};

export const deleteUserResume = async (userId) => {
  return Resume.findOneAndDelete({ user: userId });
};