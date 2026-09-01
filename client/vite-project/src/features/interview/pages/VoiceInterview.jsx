import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import VoiceInterviewHeader from "../components/voice/VoiceInterviewHeader";
import VoiceRecorder from "../components/voice/VoiceRecorder";
import TranscriptPanel from "../components/voice/TranscriptPanel";

const QUESTION =
  "Tell me about a challenging frontend project you worked on and how you solved the main technical problem.";

const SAMPLE_TRANSCRIPT =
  "I worked on a frontend project where I had to build a responsive application with React. One of the main challenges was managing complex state across multiple components. I solved this by separating the state into reusable pieces and using React hooks effectively. I also improved the performance by avoiding unnecessary re-renders.";

function VoiceInterview() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleStart = () => {
    setIsRecording(true);
    setIsPaused(false);

    // Temporary frontend simulation.
    // Real speech recognition will be connected later.
    setTimeout(() => {
      setTranscript(SAMPLE_TRANSCRIPT);
    }, 1200);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPaused(false);

    if (!transcript) {
      setTranscript(SAMPLE_TRANSCRIPT);
    }
  };

  const handleSubmit = () => {
    if (!transcript) return;

    setAnswerSubmitted(true);
    setIsRecording(false);
    setIsPaused(false);
  };

  const handleFinish = () => {
    navigate("/interview/results");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <VoiceInterviewHeader
        timeLeft={timeLeft}
        onFinish={handleFinish}
      />

      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <button
          type="button"
          onClick={() => navigate("/interview/live")}
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to interview
        </button>

        {/* Progress */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Question 3 of 8
            </p>

            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[37.5%] rounded-full bg-foreground" />
            </div>
          </div>

          <span className="text-xs text-muted-foreground">
            Voice response
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Question */}
          <div className="space-y-6">
            <section className="rounded-2xl border bg-background p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                  <Brain className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Technical · Frontend
                  </p>

                  <h2 className="mt-2 text-xl font-semibold leading-8">
                    {QUESTION}
                  </h2>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />

                  <p className="text-sm leading-6 text-muted-foreground">
                    Explain your thought process clearly. Use a real
                    example if possible and mention the decisions you made.
                  </p>
                </div>
              </div>
            </section>

            <VoiceRecorder
              isRecording={isRecording}
              isPaused={isPaused}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onStop={handleStop}
            />
          </div>

          {/* Transcript */}
          <div className="space-y-6">
            <TranscriptPanel
              transcript={transcript}
              answerSubmitted={answerSubmitted}
              onSubmit={handleSubmit}
            />

            {answerSubmitted && (
              <section className="rounded-2xl border bg-muted/30 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold">
                      Answer recorded
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Your response has been submitted. AI evaluation will
                      analyze confidence, grammar, technical accuracy,
                      completeness, and communication once the backend is
                      connected.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default VoiceInterview;