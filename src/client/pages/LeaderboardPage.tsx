import { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { useUserContext } from '@client/contexts/UserContext';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { LeaderboardEntry } from '@shared/types/server';
import NavigationBar from '@client/components/basic/Navigation';
import { userApi } from '@client/utils/api';

export default function LeaderboardPage() {
  const router = useRouter();
  const { username } = useUserContext();
  const [activeTab, setActiveTab] = useState<'today' | 'allTime'>('today');
  const [todayData, setTodayData] = useState<LeaderboardEntry[]>([]);
  const [allTimeData, setAllTimeData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<{
    dailyRank: number;
    allTimeRank: number;
    weeklyRank: number;
    monthlyRank: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch today's leaderboard
        const todayResponse = await userApi.getDailyLeaderboard();
        setTodayData(todayResponse.entries);

        // Fetch all-time leaderboard
        const allTimeResponse = await userApi.getAllTimeLeaderboard();
        setAllTimeData(allTimeResponse);

        // Fetch user rank if username is available
        if (username && username !== 'anonymous') {
          try {
            const rankResponse = await userApi.getUserRank(username);
            setUserRank(rankResponse);
          } catch (rankError) {
            console.warn('Could not fetch user rank:', rankError);
            // Set default values if rank fetch fails
            setUserRank({
              dailyRank: 0,
              allTimeRank: 0,
              weeklyRank: 0,
              monthlyRank: 0,
            });
          }
        } else {
          // Set default values if no username
          setUserRank({
            dailyRank: 0,
            allTimeRank: 0,
            weeklyRank: 0,
            monthlyRank: 0,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard data');
        console.error('Error fetching leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchLeaderboardData();
  }, [username]);

  const currentData = activeTab === 'today' ? todayData : allTimeData;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-500" />;
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400';
      case 2:
        return 'bg-gray-300/10 border-gray-300/20 text-gray-300';
      case 3:
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      default:
        return 'bg-gray-800/60 border-gray-700 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div
        className="w-full min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/root_bg.png')" }}
      >
        <div className="w-full min-h-screen bg-black/70 flex items-center justify-center">
          <div className="text-white text-xl">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/root_bg.png')" }}
      >
        <div className="w-full min-h-screen bg-black/70 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">Error loading leaderboard</div>
            <div className="text-gray-300">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/root_bg.png')" }}
    >
      <div className="w-full min-h-screen bg-black/70 ">
        {/* Navigation Header */}

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <NavigationBar title="Leaderboard" onBack={() => router.goto('home')} />
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white">Global Rankings</h2>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="relative bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full p-1">
                {/* Moving yellow background */}
                <div
                  className={`absolute top-1.5 bottom-1.5 rounded-full bg-yellow-500 transition-all duration-300 ease-in-out ${
                    activeTab === 'today'
                      ? 'left-1.5 w-[calc(50%-6px)]'
                      : 'left-[calc(50%+3px)] w-[calc(50%-6px)]'
                  }`}
                />

                <button
                  onClick={() => setActiveTab('today')}
                  className={`relative px-6 py-2 rounded-full font-semibold transition-colors duration-300 z-10 ${
                    activeTab === 'today' ? 'text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Today
                </button>

                <button
                  onClick={() => setActiveTab('allTime')}
                  className={`relative px-6 py-2 rounded-full font-semibold transition-colors duration-300 z-10 ${
                    activeTab === 'allTime' ? 'text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/60 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                        Player
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {currentData.map((entry) => (
                      <tr
                        key={entry.rank}
                        className={`hover:bg-black/40 transition-colors duration-200 ${
                          entry.rank <= 3 ? 'bg-gradient-to-r from-transparent to-yellow-400/5' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 ">
                            <div
                              className={`size-10  rounded-full border flex items-center justify-center ${getRankColor(entry.rank)}`}
                            >
                              {getRankIcon(entry.rank)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center">
                              <span className="text-yellow-400 font-bold text-sm">
                                {entry.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-white">{entry.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-yellow-400 text-lg">
                            {entry.points.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Your Score Section */}
            <div className="bg-black/80 backdrop-blur-sm border rounded-2xl p-6 border-gray-700">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-6">Your Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Today's Rank */}
                  <div className="text-center p-4 bg-black/60 rounded-xl border">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {userRank?.dailyRank || 0}
                    </div>
                    <div className="text-sm text-gray-400">Today's Rank</div>
                  </div>

                  {/* All Time Rank */}
                  <div className="text-center p-4 bg-black/60 rounded-xl border">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {userRank?.allTimeRank || 0}
                    </div>
                    <div className="text-sm text-gray-400">All Time Rank</div>
                  </div>

                  {/* Weekly Rank */}
                  <div className="text-center p-4 bg-black/60 rounded-xl border">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {userRank?.weeklyRank || 0}
                    </div>
                    <div className="text-sm text-gray-400">Weekly Rank</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
