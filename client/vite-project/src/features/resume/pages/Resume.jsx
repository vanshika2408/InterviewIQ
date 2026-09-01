import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import ResumeUpload from "../components/ResumeUpload";
import ResumeSummary from "../components/ResumeSummary";
import { getResume } from "../../../services/api";

const resumeFeatures = [
  "Generate questions based on your projects.",
  "Identify skills mentioned in your resume.",
  "Create role-specific interview scenarios.",
  "Track how well you explain your experience.",
];

function Resume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserResume = async () => {
      try {
        setLoading(true);
        const res = await getResume();
        if (res.success && res.resume) {
          setResume(res.resume);
        }
      } catch (err) {
        console.error("Fetch resume error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserResume();
  }, []);

  const extracted = resume?.extractedData;
  const atsScore = Number(extracted?.atsScore) || 0;
  const summaryText = extracted?.summary || "";
  const recommendations = Array.isArray(extracted?.recommendations) ? extracted.recommendations : [];
  const breakdown = extracted?.breakdown;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Career profile</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Resume
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Upload your resume and let InterviewIQ understand your experience.
          </p>
        </div>

        <Link
          to="/select-interview"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Practice with resume
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Upload + Intelligence */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <ResumeUpload
          resumeData={resume}
          onUploadSuccess={(newResume) => setResume(newResume)}
          onDeleteSuccess={() => setResume(null)}
        />

        <div className="rounded-xl border bg-muted/30 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <h2 className="font-semibold">Resume intelligence</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Turn your resume into personalized interview preparation.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {resumeFeatures.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                <p className="text-sm text-muted-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Analysis */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Resume analysis</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            A quick overview of the information InterviewIQ can use from your
            resume.
          </p>
        </div>

        <ResumeSummary resumeData={resume} />
      </section>

      {/* ATS Readiness */}
      <section className="rounded-xl border bg-background p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-semibold">AI ATS readiness analysis</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Automated Applicant Tracking System compatibility evaluation powered by AI.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className={`text-4xl font-extrabold ${
              atsScore >= 80 ? "text-emerald-600" : atsScore >= 60 ? "text-amber-600" : "text-muted-foreground"
            }`}>
              {resume ? `${atsScore}%` : "0%"}
            </span>

            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {resume ? (atsScore >= 80 ? "High Compatibility" : "Moderate Compatibility") : "No resume uploaded"}
            </p>
          </div>
        </div>

        {resume && extracted ? (
          <div className="space-y-6">
            {/* Score Progress Bar */}
            <div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    atsScore >= 80 ? "bg-emerald-600" : atsScore >= 60 ? "bg-amber-500" : "bg-muted-foreground"
                  }`}
                  style={{ width: `${atsScore}%` }}
                />
              </div>
            </div>

            {/* AI Assessment Summary */}
            {summaryText && (
              <div className="rounded-lg border bg-muted/20 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Assessment Summary</h3>
                <p className="mt-2 text-sm leading-relaxed">{summaryText}</p>
              </div>
            )}

            {/* Category Breakdown Bars */}
            {breakdown && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-3 bg-background">
                  <p className="text-xs text-muted-foreground">Structure & Formatting</p>
                  <p className="mt-1 text-lg font-bold">{breakdown.formatting || 80}%</p>
                </div>
                <div className="rounded-lg border p-3 bg-background">
                  <p className="text-xs text-muted-foreground">Keyword Density</p>
                  <p className="mt-1 text-lg font-bold">{breakdown.keywordDensity || 75}%</p>
                </div>
                <div className="rounded-lg border p-3 bg-background">
                  <p className="text-xs text-muted-foreground">Quantifiable Impact</p>
                  <p className="mt-1 text-lg font-bold">{breakdown.quantifiableImpact || 70}%</p>
                </div>
                <div className="rounded-lg border p-3 bg-background">
                  <p className="text-xs text-muted-foreground">Section Completeness</p>
                  <p className="mt-1 text-lg font-bold">{breakdown.sectionCompleteness || 85}%</p>
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">AI recommendations to boost your ATS score:</h3>
                <div className="space-y-2">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-lg border p-3 text-xs bg-muted/10">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <p className="leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm font-medium">Upload your resume to perform AI ATS Analysis</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">
              Our AI engine will analyze your PDF resume structure, extract relevant skills, compute your ATS compatibility score, and generate tailored recommendations.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Resume;