import React, { useState } from 'react';
import { User, StudySession, Subject, Achievement, Badge } from '../types';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  Award,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  Trophy,
  Star
} from 'lucide-react';
import { formatDuration, getWeekDates, formatDate } from '../utils/dateUtils';
import { mockAchievements, mockBadges } from '../data/mockData';

interface ProgressTrackingProps {
  user: User;
  sessions: StudySession[];
  onBack: () => void;
}

export default function ProgressTracking({ user, sessions, onBack }: ProgressTrackingProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Calculate statistics
  const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  const totalSessions = sessions.length;
  const averageSessionLength = totalSessions > 0 ? totalStudyTime / totalSessions : 0;
  
  // Calculate subject-wise statistics
  const subjectStats = user.subjects.map(subject => {
    const subjectSessions = sessions.filter(s => s.subjectId === subject.id);
    const totalTime = subjectSessions.reduce((sum, s) => sum + s.duration, 0);
    const sessionCount = subjectSessions.length;
    
    return {
      ...subject,
      totalTime,
      sessionCount,
      averageTime: sessionCount > 0 ? totalTime / sessionCount : 0,
      progress: (totalTime / 3600) / subject.targetHours * 100 // Convert seconds to hours
    };
  });

  // Get current week data
  const currentWeek = getWeekDates(new Date(Date.now() + currentWeekOffset * 7 * 24 * 60 * 60 * 1000));
  const weeklyData = currentWeek.map(date => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const daySessions = sessions.filter(session => 
      session.completedAt >= dayStart && session.completedAt <= dayEnd
    );
    
    const totalTime = daySessions.reduce((sum, session) => sum + session.duration, 0);
    
    return {
      date,
      sessions: daySessions.length,
      totalTime: totalTime / 3600, // Convert to hours
      subjects: daySessions.reduce((acc, session) => {
        acc[session.subjectName] = (acc[session.subjectName] || 0) + session.duration / 3600;
        return acc;
      }, {} as Record<string, number>)
    };
  });

  const maxHours = Math.max(...weeklyData.map(d => d.totalTime), 1);

  // Calculate streaks and achievements
  const currentStreak = 7; // Mock data
  const longestStreak = 12; // Mock data
  
  const achievements = mockAchievements;
  const badges = mockBadges;
  const earnedAchievements = achievements.filter(a => a.earned);

  const moodDistribution = sessions.reduce((acc, session) => {
    acc[session.mood] = (acc[session.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Progress Analytics</h1>
                <p className="text-gray-600">Track your study journey and achievements</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setSelectedPeriod('year')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Year
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(Math.floor(totalStudyTime / 60))}
                </p>
                <p className="text-sm text-gray-600">Total Study Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
                <p className="text-sm text-gray-600">Study Sessions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(Math.floor(averageSessionLength / 60))}
                </p>
                <p className="text-sm text-gray-600">Avg Session</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{currentStreak}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Activity Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Weekly Activity</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[120px] text-center">
                    {formatDate(currentWeek[0])} - {formatDate(currentWeek[6])}
                  </span>
                  <button
                    onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                    disabled={currentWeekOffset >= 0}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="h-64">
                <div className="flex items-end justify-between h-full gap-2">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="flex-1 flex items-end mb-2">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg min-h-[4px] transition-all duration-300"
                          style={{
                            height: `${(day.totalTime / maxHours) * 100}%`
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-900">
                          {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="text-xs text-gray-600">
                          {day.totalTime.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Progress</h2>
              <div className="space-y-6">
                {subjectStats.map((subject) => (
                  <div key={subject.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="font-medium text-gray-900">{subject.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {(subject.totalTime / 3600).toFixed(1)}h / {subject.targetHours}h
                        </p>
                        <p className="text-xs text-gray-600">
                          {subject.sessionCount} sessions
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: subject.color,
                          width: `${Math.min(subject.progress, 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {subject.progress.toFixed(1)}% complete
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 ${
                      achievement.earned
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{achievement.icon}</span>
                      <span
                        className={`w-4 h-4 ${
                          achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                        }`}
                      >
                        {achievement.name}
                      </span>
                      <span className="text-xs text-gray-500">+{achievement.points} pts</span>
                    </div>
                    <p
                      className={`text-xs ${
                        achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                      }`}
                    >
                      {achievement.description}
                    </p>
                    {!achievement.earned && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{achievement.progress}% complete</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                Earned Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3 rounded-lg border border-gray-200 text-center"
                    style={{ backgroundColor: `${badge.color}10` }}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className="font-medium text-sm text-gray-900">{badge.name}</p>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-500 capitalize">{badge.rarity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood Distribution */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Mood</h3>
              <div className="space-y-3">
                {Object.entries(moodDistribution).map(([mood, count]) => {
                  const percentage = (count / totalSessions) * 100;
                  const moodColors = {
                    excellent: 'bg-green-500',
                    good: 'bg-blue-500',
                    okay: 'bg-yellow-500',
                    poor: 'bg-red-500'
                  };
                  
                  return (
                    <div key={mood}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {mood}
                        </span>
                        <span className="text-sm text-gray-600">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${moodColors[mood as keyof typeof moodColors]} transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Longest Streak</span>
                  <span className="text-sm font-medium text-gray-900">{longestStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Most Studied Subject</span>
                  <span className="text-sm font-medium text-gray-900">
                    {subjectStats.reduce((max, subject) => 
                      subject.totalTime > max.totalTime ? subject : max
                    ).name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Best Study Day</span>
                  <span className="text-sm font-medium text-gray-900">
                    {weeklyData.reduce((max, day) => 
                      day.totalTime > max.totalTime ? day : max
                    ).date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}