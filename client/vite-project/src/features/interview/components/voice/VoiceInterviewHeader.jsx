import { Clock3, LogOut } from "lucide-react";

function VoiceInterviewHeader({ timeLeft, onFinish }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <header className="flex min-h-16 flex-col gap-3 border-b bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-xs text-muted-foreground">AI Interview</p>

        <h1 className="text-sm font-semibold sm:text-base">
          Frontend Developer · Technical
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium">
          <Clock3 className="h-4 w-4" />

          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          Finish
        </button>
      </div>
    </header>
  );
}

export default VoiceInterviewHeader;