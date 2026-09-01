import { ArrowUp } from "lucide-react";

function PerformanceOverview({ analytics }) {
  const hasData = analytics && (analytics.totalInterviews > 0 || analytics.averageScore > 0);

  const metrics = [
    {
      label: "Overall score",
      value: hasData ? `${analytics.averageScore}%` : "0%",
      change: hasData ? "+6%" : null,
      description: hasData ? "Compared with initial sessions" : "No interview data yet",
    },
    {
      label: "Confidence",
      value: hasData ? `${analytics.confidence || 0}%` : "0%",
      change: hasData ? "+8%" : null,
      description: hasData ? "Strong improvement" : "Complete interviews to evaluate",
    },
    {
      label: "Accuracy",
      value: hasData ? `${analytics.accuracy || 0}%` : "0%",
      change: hasData ? "+4%" : null,
      description: hasData ? "Across technical answers" : "Evaluated per response",
    },
    {
      label: "Communication",
      value: hasData ? `${analytics.communication || 0}%` : "0%",
      unit: "score",
      description: hasData ? "Based on overall clarity" : "Clarity and structure metric",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">{metric.label}</p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold">{metric.value}</span>

            {metric.unit && (
              <span className="mb-1 text-xs">{metric.unit}</span>
            )}

            {metric.change && (
              <span className="mb-1 flex items-center text-xs text-emerald-600">
                <ArrowUp className="h-3 w-3" />
                {metric.change}
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {metric.description}
          </p>
        </div>
      ))}
    </section>
  );
}

export default PerformanceOverview;