import { FileText, Send } from "lucide-react";

function TranscriptPanel({
  transcript,
  answerSubmitted,
  onSubmit,
}) {
  return (
    <section className="rounded-2xl border bg-background">
      <div className="flex items-center justify-between gap-3 border-b p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border">
            <FileText className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">Transcript</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Your spoken answer will appear here.
            </p>
          </div>
        </div>

        <span className="text-xs text-muted-foreground">
          {transcript.length} characters
        </span>
      </div>

      <div className="min-h-36 p-5">
        {transcript ? (
          <p className="text-sm leading-7">{transcript}</p>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            Start speaking to generate a transcript...
          </p>
        )}
      </div>

      <div className="border-t p-4">
        <button
          type="button"
          disabled={!transcript || answerSubmitted}
          onClick={onSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />

          {answerSubmitted ? "Answer submitted" : "Submit answer"}
        </button>
      </div>
    </section>
  );
}

export default TranscriptPanel;