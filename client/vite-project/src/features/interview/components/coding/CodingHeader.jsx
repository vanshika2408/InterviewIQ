import { Clock3, Play, Send } from "lucide-react";

function CodingHeader({
  language,
  setLanguage,
  timeLeft,
  onRun,
  onSubmit,
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <header className="flex flex-col gap-4 border-b bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs text-muted-foreground">Coding interview</p>
        <h1 className="text-lg font-semibold">Two Sum</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option>JavaScript</option>
          <option>Java</option>
          <option>Python</option>
          <option>C++</option>
        </select>

        <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium">
          <Clock3 className="h-4 w-4" />
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        <button
          type="button"
          onClick={onRun}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <Play className="h-4 w-4" />
          Run
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Send className="h-4 w-4" />
          Submit
        </button>
      </div>
    </header>
  );
}

export default CodingHeader;