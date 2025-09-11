import { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { useUserContext } from '@client/contexts/UserContext';
import { Medal, Award, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { LeaderboardEntry } from '@shared/types/server';
import NavigationBar from '@client/components/basic/Navigation';
import { userApi } from '@client/utils/api';
import { FullScreenLoader } from '@client/components';
import { getToday } from '@client/services/TimeService';

export default function LeaderboardPage() {
  const router = useRouter();
  const { username } = useUserContext();
  const [activeTab, setActiveTab] = useState<'today' | 'allTime'>('today');
  const [todayData, setTodayData] = useState<LeaderboardEntry[]>([]);
  const [allTimeData, setAllTimeData] = useState<LeaderboardEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [userRank, setUserRank] = useState<{
    dailyRank: number;
    allTimeRank: number;
    weeklyRank: number;
    monthlyRank: number;
    dailyPoints: number;
    totalPoints: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTimeLoaded, setAllTimeLoaded] = useState(false);

  // Load initial data (today's leaderboard)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get server time for today's date
        const serverToday = await getToday();
        console.log('Server today:', serverToday);

        // Set selectedDate to today
        setSelectedDate(serverToday);

        // Fetch today's daily leaderboard
        console.log("Fetching today's daily leaderboard for date:", serverToday);
        const todayResponse = await userApi.getDailyLeaderboard(serverToday);
        console.log('Daily leaderboard response:', todayResponse);
        setTodayData(todayResponse.entries);

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
              dailyPoints: 0,
              totalPoints: 0,
            });
          }
        } else {
          // Set default values if no username
          setUserRank({
            dailyRank: 0,
            allTimeRank: 0,
            weeklyRank: 0,
            monthlyRank: 0,
            dailyPoints: 0,
            totalPoints: 0,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard data');
        console.error('Error fetching initial leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchInitialData();
  }, [username]);

  // Load daily data when selectedDate changes
  useEffect(() => {
    const fetchDailyData = async () => {
      if (!selectedDate) return;

      try {
        console.log('Fetching daily leaderboard for selected date:', selectedDate);
        const response = await userApi.getDailyLeaderboard(selectedDate);
        console.log('Daily leaderboard response for', selectedDate, ':', response);
        setTodayData(response.entries);
      } catch (err) {
        console.error('Error fetching daily leaderboard data:', err);
        setTodayData([]);
      }
    };

    void fetchDailyData();
  }, [selectedDate]);

  // Load all-time data when user switches to all-time tab
  useEffect(() => {
    const fetchAllTimeData = async () => {
      if (activeTab !== 'allTime' || allTimeLoaded) return;

      try {
        console.log('Fetching all-time leaderboard...');
        const allTimeResponse = await userApi.getAllTimeLeaderboard();
        console.log('All-time leaderboard response:', allTimeResponse);
        setAllTimeData(allTimeResponse);
        setAllTimeLoaded(true);
      } catch (err) {
        console.error('Error fetching all-time leaderboard data:', err);
        setAllTimeData([]);
      }
    };

    void fetchAllTimeData();
  }, [activeTab, allTimeLoaded]);

  const currentData = activeTab === 'today' ? todayData : allTimeData;

  // Date navigation functions
  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const prevDate = currentDate.toISOString().split('T')[0];
    if (prevDate) {
      setSelectedDate(prevDate);
    }
  };

  const goToNextDay = async () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDate = currentDate.toISOString().split('T')[0];

    // Get server time to check if we can go to next day
    const serverToday = await getToday();

    // Don't allow going to future dates
    if (nextDate && serverToday && nextDate <= serverToday) {
      setSelectedDate(nextDate);
    }
  };

  const goToToday = async () => {
    const serverToday = await getToday();
    setSelectedDate(serverToday);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const [isToday, setIsToday] = useState(false);
  const isFirstDay = selectedDate === '2025-09-10'; // Adjust based on your app's start date

  // Check if selected date is today (server time)
  useEffect(() => {
    const checkIsToday = async () => {
      if (!selectedDate) return;
      const serverToday = await getToday();
      setIsToday(selectedDate === serverToday);
    };
    void checkIsToday();
  }, [selectedDate]);

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
      <FullScreenLoader isLoading={true} variant="leaderboard" message="Loading leaderboard" />
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

            {/* Date Navigation - Only show for Today tab */}
            {activeTab === 'today' && (
              <div className="flex justify-center mb-4">
                <div className="bg-black/90 backdrop-blur-sm border border-yellow-400/30 rounded-full px-3 py-2 shadow-lg">
                  <div className="flex items-center gap-3">
                    {/* Previous Day Button */}
                    <button
                      onClick={goToPreviousDay}
                      disabled={isFirstDay}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        isFirstDay
                          ? 'bg-black/50 text-yellow-400/30 cursor-not-allowed'
                          : 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Date Display */}
                    <div className="text-center">
                      <div className="text-white font-bold text-md">{formatDate(selectedDate)}</div>
                      {!isToday && (
                        <button
                          onClick={goToToday}
                          className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                        >
                          Go to Today
                        </button>
                      )}
                      {isToday && <div className="text-sm text-yellow-400 font-medium">Today</div>}
                    </div>

                    {/* Next Day Button */}
                    <button
                      onClick={goToNextDay}
                      // disabled={isToday}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        isToday
                          ? 'bg-black/50 text-yellow-400/30 cursor-not-allowed'
                          : 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="relative bg-black/90 backdrop-blur-sm border border-yellow-400/30 rounded-full p-1 shadow-lg">
                {/* Moving yellow background */}
                <div
                  className={`absolute top-1.5 bottom-1.5 rounded-full bg-yellow-400 transition-all duration-300 ease-in-out ${
                    activeTab === 'today'
                      ? 'left-1.5 w-[calc(50%-6px)]'
                      : 'left-[calc(50%+3px)] w-[calc(50%-6px)]'
                  }`}
                />

                <button
                  onClick={() => setActiveTab('today')}
                  className={`relative px-6 py-2 rounded-full font-semibold transition-colors duration-300 z-10 ${
                    activeTab === 'today'
                      ? 'text-black'
                      : 'text-yellow-400/70 hover:text-yellow-400'
                  }`}
                >
                  {isToday ? 'Today' : 'Daily'}
                </button>

                <button
                  onClick={() => setActiveTab('allTime')}
                  className={`relative px-6 py-2 rounded-full font-semibold transition-colors duration-300 z-10 ${
                    activeTab === 'allTime'
                      ? 'text-black'
                      : 'text-yellow-400/70 hover:text-yellow-400'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-black/90 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-400/20 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/70 border-b border-yellow-400/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-400">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-400">
                        Player
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-400">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center">
                          <div className="text-yellow-400/80 text-lg">
                            {activeTab === 'today'
                              ? `No games played on ${formatDate(selectedDate)}`
                              : 'No games played yet'}
                          </div>
                          <div className="text-yellow-400/60 text-sm mt-2">
                            {activeTab === 'today'
                              ? 'Try selecting a different date or complete some challenges!'
                              : 'Complete some challenges to appear on the leaderboard!'}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentData.map((entry) => (
                        <tr
                          key={entry.rank}
                          className={`hover:bg-black/40 transition-colors duration-200 ${
                            entry.rank <= 3
                              ? 'bg-gradient-to-r from-transparent to-yellow-400/5'
                              : ''
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
                              {activeTab === 'today' ? entry.dailyPoints : entry.totalPoints}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Your Performance Section */}
            <div className="bg-black/80 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Your Performance</h3>
                <div className="space-y-3">
                  {/* Today's Performance */}
                  <div className="flex justify-between items-center bg-black/60 rounded-xl p-3 border border-yellow-400/20">
                    <div className="text-yellow-400 font-medium">Today</div>
                    <div className="text-white">
                      {userRank?.dailyRank && userRank.dailyRank > 0 ? (
                        <>#{userRank.dailyRank}</>
                      ) : (
                        <span className="text-gray-400">Unranked</span>
                      )}
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-yellow-400 font-bold">
                        {userRank?.dailyPoints || 0} points
                      </span>
                    </div>
                  </div>

                  {/* All Time Performance */}
                  <div className="flex justify-between items-center bg-black/60 rounded-xl p-3 border border-yellow-400/20">
                    <div className="text-yellow-400 font-medium">All Time</div>
                    <div className="text-white">
                      {userRank?.allTimeRank && userRank.allTimeRank > 0 ? (
                        <>#{userRank.allTimeRank}</>
                      ) : (
                        <span className="text-gray-400">Unranked</span>
                      )}
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-yellow-400 font-bold">
                        {userRank?.totalPoints || 0} points
                      </span>
                    </div>
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
