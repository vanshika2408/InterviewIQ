import { CheckCircle2, Terminal } from "lucide-react";

function TestCasePanel({ output, submitted }) {
  return (
    <div className="rounded-xl border bg-background">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Terminal className="h-4 w-4" />

        <h2 className="text-sm font-semibold">Test cases</h2>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {[
          ["Input", "nums = [2,7,11,15], target = 9"],
          ["Expected", "[0,1]"],
          ["Output", output],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">{label}</p>

            <p className="mt-2 break-words font-mono text-xs">
              {value}
            </p>
          </div>
        ))}
      </div>

      {submitted && (
        <div className="mx-4 mb-4 flex items-start gap-3 rounded-lg border p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

          <div>
            <p className="text-sm font-medium">Submission evaluated</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Your solution passed the available test cases.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestCasePanel;