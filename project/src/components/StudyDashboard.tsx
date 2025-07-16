import React from 'react';
import { User, PlannedSession, MotivationMessage, MoodEntry } from '../types';
import { Calendar, Clock, Target, TrendingUp, BookOpen, CheckCircle, Circle, Zap } from 'lucide-react';
import { formatDuration, formatDate, isToday, getWeekDates } from '../utils/dateUtils';

interface StudyDashboardProps {
  user: User;
  todaysPlan: PlannedSession[];
  motivationMessage: MotivationMessage;
  onMoodCheckIn: () => void;
  onStartSession: (sessionId: string) => void;
  onViewProgress: () => void;
  onViewResources: () => void;
  onViewSettings: () => void;
}

export default function StudyDashboard({ 
  user, 
  todaysPlan, 
  motivationMessage, 
  onMoodCheckIn,
  onStartSession,
  onViewProgress,
  onViewResources,
  onViewSettings
}: StudyDashboardProps) {
  const completedSessions = todaysPlan.filter(session => session.completed);
  const totalPlannedMinutes = todaysPlan.reduce((sum, session) => sum + session.duration, 0);
  const completedMinutes = completedSessions.reduce((sum, session) => sum + session.duration, 0);
  const progressPercentage = totalPlannedMinutes > 0 ? (completedMinutes / totalPlannedMinutes) * 100 : 0;

  const weekDates = getWeekDates();
  const currentStreak = 7; // Mock data - would be calculated from actual study history

  // Calculate level progress
  const experienceToNextLevel = (user.level * 1000) - (user.experience % 1000);
  const levelProgress = ((user.experience % 1000) / 1000) * 100;

  const getTimeUntilNext = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const nextSession = todaysPlan.find(session => {
      if (session.completed) return false;
      const [hours, minutes] = session.startTime.split(':').map(Number);
      const sessionTime = hours * 60 + minutes;
      return sessionTime > currentTime;
    });

    if (!nextSession) return null;

    const [hours, minutes] = nextSession.startTime.split(':').map(Number);
    const sessionTime = hours * 60 + minutes;
    const timeDiff = sessionTime - currentTime;
    
    if (timeDiff <= 60) {
      return `${timeDiff} minutes`;
    }
    return `${Math.floor(timeDiff / 60)} hours ${timeDiff % 60} minutes`;
  };

  const timeUntilNext = getTimeUntilNext();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.name}!
              </h1>
              <p className="text-gray-600">Ready to make today productive?</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">{currentStreak} days</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Level {user.level}</p>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{experienceToNextLevel} XP to next level</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Motivation Message */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  {motivationMessage.type === 'celebration' && <TrendingUp className="w-6 h-6" />}
                  {motivationMessage.type === 'encouragement' && <Target className="w-6 h-6" />}
                  {motivationMessage.type === 'reminder' && <Clock className="w-6 h-6" />}
                  {motivationMessage.type === 'challenge' && <Zap className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-lg font-medium mb-2">{motivationMessage.message}</p>
                  <p className="text-blue-100 text-sm">
                    {motivationMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <button
                  onClick={onMoodCheckIn}
                  className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                >
                  How are you feeling today? →
                </button>
              </div>
            </div>

            {/* Today's Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
                <button
                  onClick={onViewProgress}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View Details
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {completedSessions.length} of {todaysPlan.length} sessions completed
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatDuration(completedMinutes)} / {formatDuration(totalPlannedMinutes)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{completedSessions.length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{formatDuration(completedMinutes)}</p>
                  <p className="text-sm text-gray-600">Time Studied</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{Math.round(progressPercentage)}%</p>
                  <p className="text-sm text-gray-600">Goal Progress</p>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
                {timeUntilNext && (
                  <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    Next session in {timeUntilNext}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {todaysPlan.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      session.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {session.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: session.color }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{session.subjectName}</h3>
                      <p className="text-sm text-gray-600">
                        {session.startTime} - {session.endTime} ({formatDuration(session.duration)})
                      </p>
                    </div>
                    
                    {!session.completed && (
                      <button
                        onClick={() => onStartSession(session.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Start
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Week Overview */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((date, index) => (
                  <div
                    key={index}
                    className={`text-center p-2 rounded-lg text-sm ${
                      isToday(date)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-xs mt-1">
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Progress</h3>
              <div className="space-y-4">
                {user.subjects.map((subject) => {
                  const progress = (subject.completedHours / subject.targetHours) * 100;
                  return (
                    <div key={subject.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {subject.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {subject.completedHours}h / {subject.targetHours}h
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: subject.color,
                            width: `${Math.min(progress, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Add Study Session</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">View Calendar</span>
                </button>
                <button 
                  onClick={onViewResources}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Manage Resources</span>
                </button>
                <button 
                  onClick={onViewProgress}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">View Analytics</span>
                </button>
                <button 
                  onClick={onViewSettings}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Target className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}