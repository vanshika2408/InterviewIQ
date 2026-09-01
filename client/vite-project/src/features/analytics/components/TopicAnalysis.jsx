import { Target } from "lucide-react";

function TopicAnalysis({ topicAnalysis }) {
  const hasTopics = topicAnalysis && topicAnalysis.length > 0;

  return (
    <section className="rounded-xl border bg-background p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border">
          <Target className="h-4 w-4" />
        </div>

        <div>
          <h2 className="font-semibold">Topic analysis</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your current performance by topic.
          </p>
        </div>
      </div>

      <div className="mt-6">
        {hasTopics ? (
          <div className="space-y-5">
            {topicAnalysis.map((item) => {
              const name = item.topic || item.role || "General";
              const score = item.averageScore || 0;
              return (
                <div key={name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{name}</span>
                    <span className="font-medium">{score}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">No topic analysis yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Performance breakdown by topic will appear after completing interview questions.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TopicAnalysis;