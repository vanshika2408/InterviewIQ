import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Award,
  Clock3,
  TrendingUp,
  FileText,
  Gift,
  CheckCircle2,
  ArrowRight,
  Zap,
  Star,
} from "lucide-react";
import { getDashboard } from "../../../services/api";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await getDashboard();
        if (res.success) {
          setData(res.dashboard);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const stats = data?.stats || {
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    xp: 0,
    level: 1,
  };
  const recentInterviews = data?.recentInterviews || [];
  const dailyChallenge = data?.dailyChallenge;
  const resume = data?.resume;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {stats.totalInterviews > 0 || stats.completedInterviews > 0
              ? `Welcome back, ${user.firstName || "Practitioner"}!`
              : `Welcome to InterviewIQ, ${user.firstName || "Practitioner"}!`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your interview practice, view performance stats, and continue your progress.
          </p>
        </div>

        <Link
          to="/select-interview"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 shadow-sm"
        >
          <Play className="h-4 w-4" />
          Start New Interview
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Interviews</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
              <Play className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold">{stats.totalInterviews}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.completedInterviews} completed
          </p>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Average Score</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold">{stats.averageScore}%</p>
          <p className="mt-1 text-xs text-muted-foreground">Across completed sessions</p>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Current Level</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold">Level {stats.level || 1}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stats.xp || 0} total XP earned</p>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Resume Status</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-xl font-semibold truncate">
            {resume ? resume.fileName : "Not Uploaded"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {resume ? "Uploaded & Available" : "Upload for tailored interviews"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Recent Interviews */}
        <section className="rounded-xl border bg-background shadow-xs">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">Recent Interviews</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Your recent practice sessions</p>
            </div>
            <Link
              to="/interviews"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y">
            {recentInterviews.length > 0 ? (
              recentInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                      <Play className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-medium">{interview.role}</h3>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="capitalize">{interview.type}</span>
                        <span>•</span>
                        <span className="capitalize">{interview.difficulty || "Medium"}</span>
                        <span>•</span>
                        <span className="capitalize font-medium text-foreground">
                          {interview.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-semibold">{interview.score || 0}%</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <Link
                      to={
                        interview.status === "completed"
                          ? `/interview/results`
                          : `/interview/lobby`
                      }
                      state={{ interview }}
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      {interview.status === "completed" ? "Results" : "Continue"}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No interviews recorded yet.</p>
                <Link
                  to="/select-interview"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
                >
                  Start your first interview
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Widgets */}
        <aside className="space-y-6">
          {/* Daily Challenge */}
          <section className="rounded-xl border bg-muted/30 p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Daily Challenge</h3>
                <p className="text-xs text-muted-foreground">Earn extra XP today</p>
              </div>
            </div>

            {dailyChallenge ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">{dailyChallenge.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {dailyChallenge.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <Star className="h-3.5 w-3.5 fill-current" /> +{dailyChallenge.xpReward} XP
                  </span>
                  {dailyChallenge.completed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </span>
                  ) : (
                    <Link
                      to="/select-interview"
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                    >
                      Complete Now
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 text-xs text-muted-foreground">
                Complete practice sessions daily to maintain your streak!
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="rounded-xl border bg-background p-5 shadow-xs space-y-3">
            <h3 className="font-semibold text-sm">Quick Actions</h3>

            <Link
              to="/resume"
              className="flex items-center justify-between rounded-lg border p-3 text-xs font-medium hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Upload Resume
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>

            <Link
              to="/analytics/performance"
              className="flex items-center justify-between rounded-lg border p-3 text-xs font-medium hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Detailed Analytics
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>

            <Link
              to="/certificates"
              className="flex items-center justify-between rounded-lg border p-3 text-xs font-medium hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4" /> Certificates & Badges
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;