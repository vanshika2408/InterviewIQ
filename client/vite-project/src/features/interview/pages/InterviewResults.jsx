import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateFeedback, getFeedback } from "../../../services/api";

function InterviewResults() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const interview = state?.interview || {
    role: "Frontend Developer",
    type: "Technical",
    difficulty: "Medium",
    duration: "30 min",
  };

  const interviewId = state?.interviewId || interview._id;

  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(Boolean(interviewId));

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!interviewId) return;

      try {
        setLoading(true);
        // Try getting existing feedback first
        let res = await getFeedback(interviewId);
        if (!res.success || !res.feedback) {
          // Generate feedback if not generated yet
          res = await generateFeedback(interviewId);
        }
        if (res.success && res.feedback) {
          setFeedbackData(res.feedback);
        }
      } catch (err) {
        console.error("Fetch feedback error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [interviewId]);

  const score = feedbackData?.overallScore ?? interview.score ?? 82;

  const breakdown = [
    {
      title: "Technical accuracy",
      score: feedbackData?.technicalAccuracy ?? 86,
      description: "Evaluation of technical accuracy in your submitted answers.",
    },
    {
      title: "Communication",
      score: feedbackData?.communication ?? 82,
      description: "Clarity and structure of your explanations.",
    },
    {
      title: "Completeness",
      score: feedbackData?.completeness ?? 78,
      description: "Completeness and depth of responses.",
    },
    {
      title: "Confidence",
      score: feedbackData?.confidence ?? 84,
      description: "Confidence demonstrated in response structure.",
    },
  ];

  const suggestions = feedbackData?.suggestions?.length
    ? feedbackData.suggestions
    : [
        "Support your answers with concrete projects or situations.",
        "Spend more practice time on areas where your score was lowest.",
        "Consistent practice will improve your interview performance.",
      ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          Interview completed
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Here's how you performed.
        </h1>

        <p className="mt-2 text-sm text-muted-foreground capitalize">
          {interview.role} · {interview.type} · {interview.difficulty}
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Generating feedback evaluation...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Score */}
          <section className="rounded-2xl border bg-background p-8 text-center">
            <p className="text-sm text-muted-foreground">Overall score</p>

            <div className="mt-3 text-6xl font-bold tracking-tight">
              {score}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              out of 100
            </p>

            <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
              {feedbackData?.summary ||
                "Strong performance. You demonstrated good technical knowledge and communication."}
            </p>
          </section>

          {/* Feedback */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Performance breakdown</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                A closer look at the skills evaluated during your interview.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {breakdown.map((item) => (
                <div key={item.title} className="rounded-xl border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <span className="text-xl font-semibold">
                      {item.score}
                    </span>
                  </div>

                  <div className="mt-5 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Feedback */}
          <section className="rounded-2xl border bg-muted/30 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">AI recommendations</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  What you should focus on next.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <div key={index} className="rounded-xl border bg-background p-5">
                  <MessageSquareText className="h-5 w-5" />

                  <h3 className="mt-4 font-medium">Recommendation {index + 1}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => navigate("/interviews")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium hover:bg-muted"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to interviews
        </button>

        <button
          type="button"
          onClick={() => navigate("/select-interview")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Practice again
        </button>
      </div>
    </div>
  );
}

export default InterviewResults;