import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Code2,
  Mic,
  ShieldCheck,
} from "lucide-react";
import { startInterview } from "../../../services/api";

function InterviewLobby() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rawInterview = state?.interview || state || {
    role: "Frontend Developer",
    type: "Technical",
    difficulty: "Medium",
    duration: "30 min",
    language: "English",
    topics: [],
  };

  const handleStart = async () => {
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      if (rawInterview._id) {
        const res = await startInterview(rawInterview._id);
        const startedInterview = res.interview || rawInterview;
        
        // Navigate based on type
        if (startedInterview.type === "coding") {
          navigate("/interview/coding", { state: { interview: startedInterview } });
        } else if (startedInterview.type === "voice") {
          navigate("/interview/voice", { state: { interview: startedInterview } });
        } else {
          navigate("/interview/live", { state: { interview: startedInterview } });
        }
      } else {
        navigate("/interview/live", { state: { interview: rawInterview } });
      }
    } catch (err) {
      console.error("Start interview error:", err);
      // Fallback navigation if needed
      navigate("/interview/live", { state: { interview: rawInterview } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 lg:p-8">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Interview lobby</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          You're all set.
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Review your interview configuration before starting. Once you begin,
          the AI interviewer will guide you through the session.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-2xl border bg-background">
        <div className="border-b p-6">
          <p className="text-sm text-muted-foreground">Your interview</p>

          <h2 className="mt-1 text-2xl font-semibold">
            {rawInterview.role}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground capitalize">
            {rawInterview.type} interview
          </p>
        </div>

        <div className="grid gap-px bg-border sm:grid-cols-2">
          <div className="bg-background p-5">
            <p className="text-xs text-muted-foreground">Difficulty</p>
            <p className="mt-1 font-medium capitalize">{rawInterview.difficulty}</p>
          </div>

          <div className="bg-background p-5">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="mt-1 flex items-center gap-2 font-medium">
              <Clock3 className="h-4 w-4" />
              {typeof rawInterview.duration === "number"
                ? `${rawInterview.duration} min`
                : rawInterview.duration}
            </p>
          </div>

          <div className="bg-background p-5">
            <p className="text-xs text-muted-foreground">Language</p>
            <p className="mt-1 font-medium">{rawInterview.language || "English"}</p>
          </div>

          <div className="bg-background p-5">
            <p className="text-xs text-muted-foreground">Topics</p>
            <p className="mt-1 font-medium">
              {rawInterview.topics?.length
                ? `${rawInterview.topics.length} selected`
                : "AI selected"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <Mic className="h-5 w-5" />

          <h3 className="mt-4 font-medium">Speak naturally</h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Answer questions using your voice just like a real interview.
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <Code2 className="h-5 w-5" />

          <h3 className="mt-4 font-medium">Real interview flow</h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Questions adapt to your role and the direction of the interview.
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <ShieldCheck className="h-5 w-5" />

          <h3 className="mt-4 font-medium">Private session</h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your interview session and performance data stay associated with
            your account.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/30 p-6">
        <h3 className="font-semibold">Before you start</h3>

        <div className="mt-4 space-y-3">
          {[
            "Find a quiet place where you can focus.",
            "Make sure your microphone is working.",
            "Answer naturally instead of trying to memorize responses.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => navigate("/select-interview")}
          className="rounded-lg border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          Change settings
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleStart}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Starting..." : "Start interview"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default InterviewLobby;