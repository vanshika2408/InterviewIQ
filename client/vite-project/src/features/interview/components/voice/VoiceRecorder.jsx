import {
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
} from "lucide-react";

function VoiceRecorder({
  isRecording,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
}) {
  return (
    <div className="rounded-2xl border bg-background p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div
          className={`relative flex h-28 w-28 items-center justify-center rounded-full border-2 ${
            isRecording && !isPaused
              ? "border-foreground"
              : "border-muted-foreground/30"
          }`}
        >
          {isRecording && !isPaused && (
            <span className="absolute inset-[-8px] animate-pulse rounded-full border border-foreground/20" />
          )}

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            {isRecording && !isPaused ? (
              <Mic className="h-8 w-8" />
            ) : isPaused ? (
              <Pause className="h-8 w-8" />
            ) : (
              <MicOff className="h-8 w-8" />
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold">
            {isRecording
              ? isPaused
                ? "Recording paused"
                : "Listening..."
              : "Ready when you are"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isRecording
              ? isPaused
                ? "Resume when you're ready to continue."
                : "Speak naturally and explain your answer."
              : "Start recording to answer the question."}
          </p>
        </div>

        {isRecording && !isPaused && (
          <div className="mt-6 flex h-10 items-center gap-1">
            {[12, 22, 32, 18, 28, 16, 35, 24, 14, 30, 20].map(
              (height, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-foreground/70"
                  style={{ height }}
                />
              )
            )}
          </div>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {!isRecording && (
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Play className="h-4 w-4" />
              Start recording
            </button>
          )}

          {isRecording && !isPaused && (
            <>
              <button
                type="button"
                onClick={onPause}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>

              <button
                type="button"
                onClick={onStop}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Square className="h-4 w-4" />
                Stop
              </button>
            </>
          )}

          {isRecording && isPaused && (
            <>
              <button
                type="button"
                onClick={onResume}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Play className="h-4 w-4" />
                Resume
              </button>

              <button
                type="button"
                onClick={onStop}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Square className="h-4 w-4" />
                Stop
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceRecorder;