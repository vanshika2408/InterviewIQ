import { useEffect, useState } from "react";

import LeaderboardHeader from "../components/LeaderboardHeader";
import LeaderboardTable from "../components/LeaderboardTable";
import { getLeaderboard } from "../../../services/api";

function Leaderboard() {
  const [period, setPeriod] = useState("weekly");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const res = await getLeaderboard(period);
        if (res.success && res.leaderboard) {
          setLeaderboard(res.leaderboard);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [period]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      <LeaderboardHeader
        period={period}
        onPeriodChange={setPeriod}
      />

      <LeaderboardTable playersData={leaderboard} />
    </div>
  );
}

export default Leaderboard;