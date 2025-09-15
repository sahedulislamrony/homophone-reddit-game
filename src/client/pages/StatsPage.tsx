/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { useUserContext } from '@client/contexts/UserContext';
import {
  Trophy,
  BarChart3,
  Play,
  Flame,
  TargetIcon,
  Clock,
  Gem,
  ShoppingCart,
  Medal,
  Globe,
  User,
} from 'lucide-react';
import { UserStats } from '@shared/types/stats';
import NavigationBar from '@client/components/basic/Navigation';
import { FullScreenLoader } from '@client/components';
import { userApi } from '@client/utils/api';
import { TimeService } from '@client/services/TimeService';

export default function StatsPage() {
  const router = useRouter();
  const { username } = useUserContext();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!username || username === 'anonymous') {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        // Fetch user data and stats
        const [userDataResponse, statsResponse] = await Promise.all([
          userApi.getUserData(username),
          userApi.getUserStats(username),
        ]);

        setUserData(userDataResponse);

        // Convert server stats to client stats format
        const clientStats: UserStats = {
          streak: statsResponse.currentStreak,
          homophonesSolved: statsResponse.totalGames,
          totalCoins: userDataResponse.gems, // Use current gems from user data
          todaysRank: 0, // Will be updated from rank data
          allTimeRank: 0, // Will be updated from rank data
          gamesPlayed: statsResponse.totalGames,
          bestScore: 0, // Not available in server stats, using placeholder
          averageScore: statsResponse.averageScore,
          hintsUsed: statsResponse.totalHintsUsed,
          accuracy: 0, // Calculate from available data if needed
          joinDate:
            userDataResponse.userData?.createdAt ||
            (await TimeService.getServerTime().then((d) => d.toISOString())), // Use actual creation date
          lastPlayed:
            userDataResponse.userData?.lastPlayedDate || statsResponse.lastPlayedDate || '',
          achievements: [], // Placeholder - achievements would need separate implementation
        };

        setUserStats(clientStats);

        // Fetch user rank
        try {
          const rankResponse = await userApi.getUserRank(username);

          // Update stats with rank data
          setUserStats((prev) =>
            prev
              ? {
                  ...prev,
                  todaysRank: rankResponse.dailyRank,
                  allTimeRank: rankResponse.allTimeRank,
                }
              : null
          );
        } catch (rankError) {
          console.warn('Could not fetch user rank:', rankError);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchUserStats();
  }, [username]);

  if (loading) {
    return <FullScreenLoader isLoading={true} variant="stats" message="Loading stats" />;
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading stats</div>
          <div className="text-gray-300">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return <FullScreenLoader isLoading={true} variant="stats" message="Loading stats" />;
  }

  const getRankDisplay = (rank: number) => {
    if (rank === 0) return 'Unranked';
    if (rank === 1) return '🥇 1st';
    if (rank === 2) return '🥈 2nd';
    if (rank === 3) return '🥉 3rd';
    return `#${rank}`;
  };

  return (
    <div className="w-full min-h-screen bg-transparent ">
      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <NavigationBar title="Your Statistics" onBack={() => router.goto('home')} />
          {/* Header
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Your Statistics</h1>
              <p className="text-gray-400">
                Track your progress and achievements in The Daily Homophone
              </p>
            </div> */}
          {/* Gems Section - Prominent Display */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 backdrop-blur-sm rounded-2xl border border-yellow-400/30 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-yellow-400/20 rounded-xl">
                  <Gem className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Total Gems</h2>
                  <div className="text-4xl font-bold text-yellow-400">{userData?.gems || 0}</div>
                  <p className="text-gray-300">Available gems</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition-all duration-300 font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Buy Gems
              </button>
            </div>
          </div>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Current Streak */}
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-orange-500/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Flame className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Current Streak</h3>
                  <div className="text-2xl font-bold text-white">{userStats?.streak || 0}</div>
                  <p className="text-xs text-gray-400">days</p>
                </div>
              </div>
            </div>

            {/* Total Games Played */}
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <TargetIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Games Played</h3>
                  <div className="text-2xl font-bold text-white">{userStats?.gamesPlayed || 0}</div>
                  <p className="text-xs text-gray-400">total</p>
                </div>
              </div>
            </div>

            {/* Today's Rank */}
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-yellow-500/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Medal className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Today's Rank</h3>
                  <div className="text-2xl font-bold text-white">
                    {getRankDisplay(userStats?.todaysRank || 0)}
                  </div>
                  <p className="text-xs text-gray-400">daily ranking</p>
                </div>
              </div>
            </div>

            {/* Global Rank */}
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Globe className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Global Rank</h3>
                  <div className="text-2xl font-bold text-white">
                    {getRankDisplay(userStats?.allTimeRank || 0)}
                  </div>
                  <p className="text-xs text-gray-400">all-time ranking</p>
                </div>
              </div>
            </div>

          </div>
          {/* Detailed Stats Section */}
          {/* <div className="grid lg:grid-cols-2 gap-8 mb-10"> */}
          {/* Performance Overview */}
          {/* <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8">

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-yellow-400" />
                  Performance Overview
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Games Played</span>
                    <span className="text-white font-semibold">{userStats?.gamesPlayed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Best Score</span>
                    <span className="text-yellow-400 font-semibold">
                      {userStats?.bestScore || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Score</span>
                    <span className="text-white font-semibold">{userStats?.averageScore || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Hints Used</span>
                    <span className="text-yellow-400 font-semibold">
                      {userStats?.hintsUsed || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Member Since
                    </span>
                    <span className="text-white font-semibold">
                      {formatDate(userStats?.joinDate || '')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last Played
                    </span>
                    <span className="text-white font-semibold">
                      {formatDate(userStats?.lastPlayed || '')}
                    </span>
                  </div>
                </div>
              </div> */}


          {/* Additional Stats */}
          {/* <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8">

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Additional Stats
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Gems Earned</span>
                    <span className="text-yellow-400 font-semibold">
                      {userData?.totalGemsEarned || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Gems Spent</span>
                    <span className="text-red-400 font-semibold">
                      {userData?.totalGemsSpent || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="text-orange-400 font-semibold">
                      {userStats?.streak || 0} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Best Streak</span>
                    <span className="text-green-400 font-semibold">
                      {userData?.bestStreak || 0} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Points</span>
                    <span className="text-blue-400 font-semibold">
                      {userData?.totalPoints || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Daily Points</span>
                    <span className="text-purple-400 font-semibold">
                      {userData?.dailyPoints || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div> */}

          {/* Quick Actions */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.goto('game')}
                className="px-6 py-3 flex items-center justify-center gap-2 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition-all duration-300 font-semibold group"
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Play Now
              </button>
              <button
                onClick={() => router.goto('leaderboard')}
                className="px-6 py-3 flex items-center justify-center gap-2 bg-black/80 text-white border border-gray-700 rounded-xl hover:bg-black/70 transition-all duration-300 font-semibold group"
              >
                <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
