/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from '@client/contexts/RouterContext';
import {
  TrendingUp,
  Trophy,
  Target,
  Award,
  Zap,
  Star,
  Crown,
  BarChart3,
  ArrowLeft,
  Play,
  Flame,
  TargetIcon,
  Coins,
  Swords,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { UserStats, Achievement, StatCard } from '@shared/types/stats';
import NavigationBar from '@client/components/basic/Navigation';

// Mock user stats data
const userStats: UserStats = {
  streak: 7,
  homophonesSolved: 156,
  totalCoins: 2340,
  todaysRank: 3,
  allTimeRank: 12,
  gamesPlayed: 45,
  bestScore: 180,
  averageScore: 95,
  hintsUsed: 23,
  accuracy: 87.5,
  joinDate: '2024-01-01',
  lastPlayed: '2024-01-15',
  achievements: [
    {
      id: 'first_game',
      name: 'First Steps',
      description: 'Complete your first game',
      icon: 'Target',
      unlocked: true,
      unlockedDate: '2024-01-01',
      progress: 100,
      maxProgress: 1,
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'Flame',
      unlocked: true,
      unlockedDate: '2024-01-15',
      progress: 100,
      maxProgress: 7,
    },
    {
      id: 'hundred_solved',
      name: 'Century Solver',
      description: 'Solve 100 homophones',
      icon: 'Trophy',
      unlocked: true,
      unlockedDate: '2024-01-10',
      progress: 100,
      maxProgress: 100,
    },
    {
      id: 'perfect_game',
      name: 'Perfectionist',
      description: 'Complete a game without hints',
      icon: 'Star',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'top_ten',
      name: 'Elite Player',
      description: 'Reach top 10 in daily rankings',
      icon: 'Crown',
      unlocked: false,
      progress: 3,
      maxProgress: 10,
    },
  ],
};

export default function StatsPage() {
  const router = useRouter();

  const statCards: StatCard[] = [
    {
      title: 'Current Streak',
      value: userStats.streak,
      subtitle: 'days',
      icon: Flame,
      color: 'warning',
      trend: { value: 2, isPositive: true },
    },
    {
      title: 'Homophones Solved',
      value: userStats.homophonesSolved,
      subtitle: 'total',
      icon: TargetIcon,
      color: 'success',
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Total Coins',
      value: userStats.totalCoins.toLocaleString(),
      subtitle: 'earned',
      icon: Coins,
      color: 'accent',
      trend: { value: 150, isPositive: true },
    },
    {
      title: "Today's Rank",
      value: `#${userStats.todaysRank}`,
      subtitle: 'out of 1,234 players',
      icon: Trophy,
      color: 'primary',
      trend: { value: 2, isPositive: true },
    },
    {
      title: 'All-Time Rank',
      value: `#${userStats.allTimeRank}`,
      subtitle: 'out of 15,678 players',
      icon: Crown,
      color: 'accent',
      trend: { value: 5, isPositive: true },
    },
    {
      title: 'Accuracy',
      value: `${userStats.accuracy}%`,
      subtitle: 'correct answers',
      icon: CheckCircle,
      color: 'success',
      trend: { value: 2.5, isPositive: true },
    },
  ];

  const getColorClasses = (color: StatCard['color']) => {
    switch (color) {
      case 'primary':
        return 'bg-yellow-400/20 border-yellow-400/30 text-yellow-400';
      case 'accent':
        return 'bg-yellow-400/20 border-yellow-400/30 text-yellow-400';
      case 'success':
        return 'bg-green-400/20 border-green-400/30 text-green-400';
      case 'warning':
        return 'bg-yellow-400/20 border-yellow-400/30 text-yellow-400';
      case 'error':
        return 'bg-red-400/20 border-red-400/30 text-red-400';
      default:
        return 'bg-yellow-400/20 border-yellow-400/30 text-yellow-400';
    }
  };

  const getAchievementIcon = (achievement: Achievement) => {
    const iconMap: { [key: string]: any } = {
      'Target': Target,
      'Flame': Flame,
      'Trophy': Trophy,
      'Star': Star,
      'Crown': Crown,
      'Award': Award,
      'Zap': Zap,
      'BarChart3': BarChart3,
    };
    return iconMap[achievement.icon] || Award;
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/root_bg.png')" }}
    >
      <div className="w-full min-h-screen bg-black/70  ">
        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <NavigationBar title="Your Statistics" onBack={() => router.goto('home')} />

            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-gray-400">
                Track your progress and achievements in The Daily Homophone
              </p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3  gap-6 mb-10">
              {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-6 hover:bg-gray-800/80 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {stat.trend && (
                        <div
                          className={`flex items-center gap-1 text-sm ${
                            stat.trend.isPositive ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          <TrendingUp
                            className={`w-4 h-4 ${stat.trend.isPositive ? 'rotate-0' : 'rotate-180'}`}
                          />
                          <span>+{stat.trend.value}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">{stat.title}</h3>
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      {stat.subtitle && <p className="text-sm text-gray-400">{stat.subtitle}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Stats Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* Performance Overview */}
              <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-yellow-400" />
                  Performance Overview
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Games Played</span>
                    <span className="text-white font-semibold">{userStats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Best Score</span>
                    <span className="text-yellow-400 font-semibold">{userStats.bestScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Score</span>
                    <span className="text-white font-semibold">{userStats.averageScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Hints Used</span>
                    <span className="text-yellow-400 font-semibold">{userStats.hintsUsed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white font-semibold">
                      {new Date(userStats.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Last Played</span>
                    <span className="text-white font-semibold">
                      {new Date(userStats.lastPlayed).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Achievements
                </h2>
                <div className="space-y-4">
                  {userStats.achievements.map((achievement) => {
                    const IconComponent = getAchievementIcon(achievement);
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          achievement.unlocked
                            ? 'bg-yellow-400/10 border-yellow-400/30'
                            : 'bg-black/60 border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg ${
                              achievement.unlocked ? 'bg-yellow-400/20' : 'bg-black/60'
                            }`}
                          >
                            <IconComponent
                              className={`w-5 h-5 ${
                                achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-semibold ${
                                achievement.unlocked ? 'text-white' : 'text-gray-400'
                              }`}
                            >
                              {achievement.name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                            {achievement.unlocked ? (
                              <div className="text-xs text-yellow-400">
                                Unlocked on{' '}
                                {new Date(achievement.unlockedDate!).toLocaleDateString()}
                              </div>
                            ) : (
                              <div className="w-full bg-black/60 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

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
    </div>
  );
}
