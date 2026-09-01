import { Crown, Trophy } from "lucide-react";

const periods = ["Weekly", "Monthly", "All time"];

function LeaderboardHeader({ period, onPeriodChange }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Community</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Leaderboard
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            See how your interview progress compares with other learners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          <span className="text-sm font-medium">Earn XP. Climb ranks.</span>
        </div>
      </div>

      <div className="flex w-fit rounded-lg border bg-background p-1">
        {periods.map((item) => {
          const value = item.toLowerCase().replace(" ", "-");

          return (
            <button
              key={item}
              type="button"
              onClick={() => onPeriodChange(value)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                period === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border bg-muted/30 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border bg-background">
            <Crown className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-medium">Your current rank</p>

            <p className="mt-1 text-2xl font-bold">#24</p>
          </div>

          <div className="ml-auto text-right">
            <p className="text-sm text-muted-foreground">XP</p>

            <p className="mt-1 font-semibold">2,840</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardHeader;