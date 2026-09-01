import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  SkipForward,
  PhoneOff,
  MessageSquareText,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getInterview,
  submitAnswer,
  completeInterview,
} from "../../../services/api";

const defaultQuestions = [
  {
    question: "Tell me about yourself and your experience with software development.",
    topic: "Introduction",
  },
  {
    question: "What is the difference between state and props in React?",
    topic: "React",
  },
  {
    question: "How would you optimize the performance of a web application?",
    topic: "Performance",
  },
  {
    question: "Tell me about a challenging project you worked on.",
    topic: "Experience",
  },
  {
    question: "How do you handle conflicts when working in a team?",
    topic: "Behavioral",
  },
];

function LiveInterview() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const initialInterview = state?.interview || {
    role: "Frontend Developer",
    difficulty: "Medium",
    duration: 30,
  };

  const [interviewData, setInterviewData] = useState(initialInterview);
  const [questionsList, setQuestionsList] = useState(
    initialInterview.questions || defaultQuestions
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);

  // Fetch full interview with questions if ID present
  useEffect(() => {
    const fetchFullInterview = async () => {
      if (initialInterview._id) {
        try {
          const res = await getInterview(initialInterview._id);
          if (res.success && res.interview) {
            setInterviewData(res.interview);
            if (res.interview.questions?.length > 0) {
              setQuestionsList(res.interview.questions);
            }
          }
        } catch (err) {
          console.error("Fetch interview questions error:", err);
        }
      }
    };
    fetchFullInterview();
  }, [initialInterview._id]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAiSpeaking(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [questionIndex]);

  const currentQuestion = questionsList[questionIndex] || defaultQuestions[0];

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const toggleRecording = () => {
    setIsRecording((current) => !current);
    setIsAiSpeaking(false);
  };

  const submitCurrentAnswer = async () => {
    if (!interviewData._id || !currentQuestion._id) return;
    try {
      setSubmitting(true);
      await submitAnswer(interviewData._id, {
        questionId: currentQuestion._id,
        answer: transcript,
      });
    } catch (err) {
      console.error("Submit answer error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    await submitCurrentAnswer();

    if (questionIndex < questionsList.length - 1) {
      setTranscript("");
      setIsRecording(false);
      setIsAiSpeaking(true);
      setQuestionIndex((current) => current + 1);
    } else {
      endInterview();
    }
  };

  const endInterview = async () => {
    clearInterval(timerRef.current);
    await submitCurrentAnswer();

    if (interviewData._id) {
      try {
        await completeInterview(interviewData._id);
      } catch (err) {
        console.error("Complete interview error:", err);
      }
    }

    navigate("/interview/results", {
      state: {
        interview: interviewData,
        interviewId: interviewData._id,
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            AI Interview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {interviewData.role}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground capitalize">
            {interviewData.difficulty} difficulty · Question{" "}
            {questionIndex + 1} of {questionsList.length}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border px-4 py-2.5">
          <Clock3 className="h-4 w-4" />
          <span className="font-mono text-sm font-medium">
            {formatTime(elapsed)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground transition-all"
          style={{
            width: `${((questionIndex + 1) / questionsList.length) * 100}%`,
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main interview area */}
        <section className="rounded-2xl border bg-background">
          {/* AI Question */}
          <div className="border-b p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                  isAiSpeaking ? "bg-muted" : "bg-background"
                }`}
              >
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    AI interviewer
                  </span>

                  {isAiSpeaking && (
                    <span className="flex items-center gap-1 text-xs">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
                      Speaking
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-lg font-semibold leading-7">
                  {currentQuestion.question}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {currentQuestion.topic || currentQuestion.category || "General"}
                </p>
              </div>
            </div>
          </div>

          {/* Voice area */}
          <div className="flex min-h-[420px] flex-col items-center justify-center p-8">
            <div
              className={`relative flex h-36 w-36 items-center justify-center rounded-full border transition-all ${
                isRecording
                  ? "scale-105 bg-muted"
                  : isAiSpeaking
                  ? "bg-muted/50"
                  : "bg-background"
              }`}
            >
              {isRecording && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full border opacity-20" />
                  <span className="absolute inset-[-12px] rounded-full border opacity-20" />
                </>
              )}

              {isRecording ? (
                <Mic className="h-10 w-10" />
              ) : isAiSpeaking ? (
                <Volume2 className="h-10 w-10" />
              ) : (
                <MicOff className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="font-medium">
                {isRecording
                  ? "Listening..."
                  : isAiSpeaking
                  ? "AI is speaking..."
                  : "Your turn to answer"}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {isRecording
                  ? "Speak naturally. Your response is being transcribed."
                  : "Click the microphone when you're ready."}
              </p>
            </div>

            {/* Waveform visualization */}
            <div className="mt-8 flex h-10 items-center gap-1">
              {[12, 24, 32, 18, 38, 26, 42, 20, 34, 15, 28, 22].map(
                (height, index) => (
                  <span
                    key={index}
                    className={`w-1 rounded-full ${
                      isRecording || isAiSpeaking
                        ? "animate-pulse bg-foreground"
                        : "bg-muted"
                    }`}
                    style={{ height }}
                  />
                )
              )}
            </div>

            <button
              type="button"
              onClick={toggleRecording}
              disabled={isAiSpeaking}
              className={`mt-8 flex h-16 w-16 items-center justify-center rounded-full border transition-colors ${
                isRecording
                  ? "bg-foreground text-background"
                  : "bg-background hover:bg-muted"
              } ${
                isAiSpeaking
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              aria-label={
                isRecording ? "Stop recording" : "Start recording"
              }
            >
              {isRecording ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>

            <p className="mt-3 text-xs text-muted-foreground">
              {isRecording ? "Stop recording" : "Start recording"}
            </p>
          </div>

          {/* Transcript */}
          <div className="border-t p-6">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4" />

              <h3 className="text-sm font-medium">
                Live transcript
              </h3>
            </div>

            <textarea
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              placeholder="Your answer will appear here... You can also type or edit your answer directly."
              className="mt-4 min-h-24 w-full resize-none rounded-lg border bg-muted/30 p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t p-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={endInterview}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-destructive px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <PhoneOff className="h-4 w-4" />
              End interview
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {questionIndex === questionsList.length - 1 ? "Finish interview" : "Next question"}
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Interview sidebar */}
        <aside className="space-y-6">
          <section className="rounded-xl border bg-background p-6">
            <h2 className="font-semibold">Interview progress</h2>

            <div className="mt-5 space-y-3">
              {questionsList.map((item, index) => (
                <div
                  key={item._id || index}
                  className={`flex items-center gap-3 rounded-lg p-3 ${
                    index === questionIndex
                      ? "bg-muted"
                      : ""
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
                      index < questionIndex
                        ? "bg-foreground text-background"
                        : ""
                    }`}
                  >
                    {index < questionIndex ? "✓" : index + 1}
                  </div>

                  <p className="line-clamp-2 text-xs">
                    {item.topic || item.category || `Question ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border bg-muted/30 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                <Mic className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Voice interview
                </h2>

                <p className="text-xs text-muted-foreground">
                  Speak naturally
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-xs text-muted-foreground">
              <p>• Keep your microphone close.</p>
              <p>• Answer clearly and confidently.</p>
              <p>• Take a moment to think before answering.</p>
              <p>• Use specific examples when possible.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default LiveInterview;