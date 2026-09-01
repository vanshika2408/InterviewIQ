import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getInterviews } from "../../../services/api";

function Interviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await getInterviews();
        if (res.success) {
          setInterviews(res.interviews || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch interview history.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter((i) => i.status === "completed");
  const averageScore =
    completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) /
            completedInterviews.length
        )
      : 0;
  const bestScore =
    completedInterviews.length > 0
      ? Math.max(...completedInterviews.map((i) => i.score || 0))
      : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Practice history
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            My Interviews
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review your previous sessions or start a new interview.
          </p>
        </div>

        <Link
          to="/select-interview"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Play className="h-4 w-4" />
          New interview
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total interviews</p>
          <p className="mt-2 text-3xl font-bold">{totalInterviews}</p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Average score</p>
          <p className="mt-2 text-3xl font-bold">{averageScore}%</p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Best score</p>
          <p className="mt-2 text-3xl font-bold">{bestScore}%</p>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="border-b p-5">
          <h2 className="font-semibold">Interview history</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your latest practice sessions.
          </p>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading interviews...
            </div>
          ) : interviews.length > 0 ? (
            interviews.map((interview) => (
              <div
                key={interview._id}
                className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                    <Play className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-medium">
                      {interview.role}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <span className="capitalize">{interview.type}</span>
                      <span className="capitalize">{interview.difficulty || "Medium"}</span>

                      <span className="flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {interview.duration ? `${interview.duration} min` : "30 min"}
                      </span>

                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(interview.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-semibold">
                      {interview.score || 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        interview.status === "completed"
                          ? "/interview/results"
                          : "/interview/lobby",
                        { state: { interview } }
                      )
                    }
                    className="rounded-md p-2 hover:bg-muted"
                    aria-label={`View ${interview.role} interview`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No interview history yet.</p>
              <Link
                to="/select-interview"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
              >
                Start a session
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interviews;