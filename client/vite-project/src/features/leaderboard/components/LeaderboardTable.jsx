const defaultPlayers = [
  {
    rank: 1,
    name: "Aarav Sharma",
    level: 18,
    xp: 12450,
    interviews: 42,
    score: 94,
  },
  {
    rank: 2,
    name: "Riya Kapoor",
    level: 17,
    xp: 11820,
    interviews: 39,
    score: 92,
  },
  {
    rank: 3,
    name: "Arjun Mehta",
    level: 16,
    xp: 10940,
    interviews: 36,
    score: 91,
  },
  {
    rank: 4,
    name: "Sneha Verma",
    level: 15,
    xp: 10120,
    interviews: 34,
    score: 89,
  },
  {
    rank: 5,
    name: "Kabir Singh",
    level: 15,
    xp: 9840,
    interviews: 31,
    score: 88,
  },
  {
    rank: 24,
    name: "You",
    level: 9,
    xp: 2840,
    interviews: 14,
    score: 76,
    currentUser: true,
  },
];

function LeaderboardTable({ playersData }) {
  const playersList =
    playersData && playersData.length > 0
      ? playersData.map((user, idx) => ({
          rank: user.rank || idx + 1,
          name: `${user.firstName || "User"} ${user.lastName || ""}`.trim(),
          level: user.stats?.level || 1,
          xp: user.stats?.xp || 0,
          interviews: user.stats?.totalInterviews || 0,
          score: user.stats?.averageScore || 0,
          currentUser: user.isCurrentUser,
        }))
      : defaultPlayers;

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="hidden grid-cols-[60px_1fr_100px_100px_100px_100px] gap-4 border-b bg-muted/30 px-6 py-3 text-xs font-medium text-muted-foreground md:grid">
        <span>Rank</span>
        <span>Candidate</span>
        <span>Level</span>
        <span>XP</span>
        <span>Interviews</span>
        <span>Score</span>
      </div>

      <div className="divide-y">
        {playersList.map((player) => (
          <div
            key={player.rank}
            className={`grid gap-4 px-6 py-5 md:grid-cols-[60px_1fr_100px_100px_100px_100px] md:items-center ${
              player.currentUser ? "bg-muted/40" : ""
            }`}
          >
            <div className="flex items-center">
              <span className="text-sm font-semibold">#{player.rank}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
                {(player.name || "U")
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {player.name}
                  {player.currentUser && (
                    <span className="ml-2 text-xs text-muted-foreground font-semibold">
                      (You)
                    </span>
                  )}
                </p>

                <p className="text-xs text-muted-foreground md:hidden">
                  Level {player.level} · {player.xp.toLocaleString()} XP
                </p>
              </div>
            </div>

            <div className="hidden text-sm md:block">
              Level {player.level}
            </div>

            <div className="hidden text-sm md:block">
              {player.xp.toLocaleString()}
            </div>

            <div className="hidden text-sm md:block">{player.interviews}</div>

            <div className="text-right text-sm font-semibold md:text-left">
              {player.score}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardTable;