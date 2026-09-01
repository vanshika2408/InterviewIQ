import { useEffect, useState } from "react";
import {
  Award,
  Flame,
  Gift,
  Medal,
  Star,
  Target,
  Trophy,
  Zap,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAchievements, getDailyChallenge, completeDailyChallenge } from "../../../services/api";

const badgeIconMap = {
  star: Star,
  trophy: Trophy,
  file: Target,
  flame: Flame,
  medal: Medal,
  award: Award,
};

function Gamification() {
  const [data, setData] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [achieveRes, dailyRes] = await Promise.all([
          getAchievements().catch(() => null),
          getDailyChallenge().catch(() => null),
        ]);

        if (achieveRes?.success) {
          setData(achieveRes.achievements);
        }
        if (dailyRes?.success) {
          setDaily(dailyRes);
        }
      } catch (err) {
        console.error("Fetch achievements error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompleteChallenge = async () => {
    if (!daily?.challenge?._id || daily?.completed) return;
    try {
      setCompleting(true);
      const res = await completeDailyChallenge(daily.challenge._id);
      if (res.success) {
        setDaily((prev) => ({ ...prev, completed: true }));
        // Refresh stats
        const achieveRes = await getAchievements();
        if (achieveRes?.success) {
          setData(achieveRes.achievements);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  const stats = data?.userStats || {
    xp: 0,
    level: 1,
    nextLevelXp: 500,
    completedInterviews: 0,
    bestScore: 0,
    streak: 0,
    unlockedBadgesCount: 0,
    totalBadgesCount: 6,
  };

  const badges = data?.badges || [];

  const xp = stats.xp || 0;
  const level = stats.level || 1;
  const levelXpFloor = (level - 1) * 500;
  const nextLevelXp = level * 500;
  const xpInCurrentLevel = xp - levelXpFloor;
  const levelXpSpan = nextLevelXp - levelXpFloor;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / levelXpSpan) * 100)));

  const statCards = [
    { label: "Interviews completed", value: `${stats.completedInterviews}` },
    { label: "Best score", value: `${stats.bestScore}%` },
    { label: "Current streak", value: `${stats.streak} ${stats.streak === 1 ? "day" : "days"}` },
    { label: "Badges unlocked", value: `${stats.unlockedBadgesCount} / ${stats.totalBadgesCount}` },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Keep improving</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Achievements & Badges
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Build your skills, earn XP, unlock milestone badges, and prepare for top interviews.
        </p>
      </div>

      {/* Level Card */}
      <section className="rounded-2xl border bg-background p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-muted/40">
              <Zap className="h-6 w-6 text-amber-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Current level</p>
              <h2 className="text-2xl font-bold">Level {level}</h2>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-2xl font-bold">{xp} XP</p>
            <p className="text-sm text-muted-foreground">
              {nextLevelXp - xp} XP to Level {level + 1}
            </p>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Level {level} ({levelXpFloor} XP)</span>
          <span>Level {level + 1} ({nextLevelXp} XP)</span>
        </div>
      </section>

      {/* Daily Challenge */}
      <section className="rounded-2xl border bg-muted/30 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-background">
              <Gift className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Daily challenge</p>

              <h2 className="mt-1 font-semibold">
                {daily?.challenge?.title || "Complete practice session"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {daily?.challenge?.description || "Complete one practice interview today."} (+{daily?.challenge?.xpReward || 50} XP)
              </p>
            </div>
          </div>

          {daily?.completed ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-600/10 px-4 py-2.5 text-sm font-medium text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Completed Today (+50 XP)
            </div>
          ) : (
            <Link
              to="/select-interview"
              className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Start challenge
            </Link>
          )}
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-background p-5 shadow-xs">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </section>

      {/* Badges Grid */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Account badges</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Milestones unlocked dynamically as you practice and improve.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => {
            const Icon = badgeIconMap[badge.icon] || Award;
            const isUnlocked = badge.unlocked;

            return (
              <div
                key={badge.id || badge.title}
                className={`rounded-xl border p-5 transition-all ${
                  isUnlocked
                    ? "bg-background border-emerald-500/30 shadow-xs"
                    : "bg-muted/30 opacity-70"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${
                    isUnlocked ? "bg-emerald-600/10 text-emerald-600 border-emerald-500/30" : "bg-muted text-muted-foreground"
                  }`}>
                    {isUnlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium truncate">{badge.title}</h3>

                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isUnlocked
                          ? "bg-emerald-600/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {isUnlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {badge.description}
                    </p>

                    {!isUnlocked && typeof badge.progress === "number" && (
                      <div className="mt-3">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-muted-foreground/50 transition-all"
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground text-right">{badge.progress}% Progress</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Streak */}
      <section className="rounded-xl border bg-background p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
            <Flame className="h-5 w-5 text-amber-500" />
          </div>

          <div>
            <h2 className="font-semibold">{stats.streak} day practice streak</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {stats.streak > 0
                ? "Great consistency! Practice daily to build your streak and earn extra bonus XP."
                : "Complete a practice interview today to launch your 1-day practice streak."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gamification;