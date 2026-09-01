import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

import PerformanceChart from "../components/PerformanceChart";
import PerformanceOverview from "../components/PerformanceOverview";
import TopicAnalysis from "../components/TopicAnalysis";
import WeakAreas from "../components/WeakAreas";
import { getAnalytics } from "../../../services/api";

function Performance() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await getAnalytics();
        if (res.success && res.analytics) {
          setAnalytics(res.analytics);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Failed to fetch analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Analytics</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Performance
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Understand your interview performance and identify where to improve.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Overview */}
      <PerformanceOverview analytics={analytics} />

      {/* Performance chart */}
      <section className="rounded-xl border bg-background p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Weekly progress</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your average interview score trends over time.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            +14%
          </div>
        </div>

        <div className="mt-6">
          <PerformanceChart scores={analytics?.scores} />
        </div>
      </section>

      {/* Topic analysis + Weak areas */}
      <section className="grid gap-6 lg:grid-cols-2">
        <TopicAnalysis topicAnalysis={analytics?.topicAnalysis} />
        <WeakAreas weakAreas={analytics?.weakAreas} />
      </section>
    </div>
  );
}

export default Performance;