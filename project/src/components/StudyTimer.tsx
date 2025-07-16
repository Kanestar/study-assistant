import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Coffee, BookOpen, Clock } from 'lucide-react';
import { Subject, StudySession } from '../types';
import { formatTime } from '../utils/dateUtils';

interface StudyTimerProps {
  subjects: Subject[];
  onSessionComplete: (session: Omit<StudySession, 'id'>) => void;
  onBack: () => void;
}

type TimerMode = 'study' | 'break';
type TimerState = 'idle' | 'running' | 'paused';

export default function StudyTimer({ subjects, onSessionComplete, onBack }: StudyTimerProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(subjects[0] || null);
  const [mode, setMode] = useState<TimerMode>('study');
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for timer sounds
    audioRef.current = new Audio();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state]);

  const handleTimerComplete = () => {
    setState('idle');
    
    // Play completion sound (would be actual audio file in production)
    try {
      audioRef.current?.play();
    } catch (error) {
      console.log('Audio play failed:', error);
    }

    if (mode === 'study') {
      setCompletedPomodoros(prev => prev + 1);
      setTotalStudyTime(prev => prev + studyDuration * 60);
      
      // Switch to break mode
      setMode('break');
      setTimeLeft(breakDuration * 60);
      
      // Show completion notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Study session complete!', {
          body: `Great job! Time for a ${breakDuration}-minute break.`,
          icon: '/favicon.ico'
        });
      }
    } else {
      // Break complete, switch back to study
      setMode('study');
      setTimeLeft(studyDuration * 60);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break time over!', {
          body: 'Ready to get back to studying?',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const startTimer = () => {
    if (state === 'idle') {
      setSessionStartTime(new Date());
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
    setState('running');
  };

  const pauseTimer = () => {
    setState('paused');
  };

  const stopTimer = () => {
    setState('idle');
    
    if (mode === 'study' && sessionStartTime && selectedSubject) {
      const actualStudyTime = (studyDuration * 60) - timeLeft;
      if (actualStudyTime > 60) { // Only save sessions longer than 1 minute
        const session: Omit<StudySession, 'id'> = {
          subjectId: selectedSubject.id,
          subjectName: selectedSubject.name,
          duration: actualStudyTime,
          completedAt: new Date(),
          mood: 'good', // Default mood, could be asked via modal
          notes: `Pomodoro session - ${Math.floor(actualStudyTime / 60)} minutes`
        };
        onSessionComplete(session);
      }
    }
    
    resetTimer();
  };

  const resetTimer = () => {
    setState('idle');
    setMode('study');
    setTimeLeft(studyDuration * 60);
    setSessionStartTime(null);
  };

  const handleDurationChange = (type: 'study' | 'break', value: number) => {
    if (type === 'study') {
      setStudyDuration(value);
      if (mode === 'study' && state === 'idle') {
        setTimeLeft(value * 60);
      }
    } else {
      setBreakDuration(value);
      if (mode === 'break' && state === 'idle') {
        setTimeLeft(value * 60);
      }
    }
  };

  const progress = mode === 'study' 
    ? ((studyDuration * 60 - timeLeft) / (studyDuration * 60)) * 100
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Study Timer</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Completed Pomodoros</p>
            <p className="text-2xl font-bold text-indigo-600">{completedPomodoros}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              {/* Mode Indicator */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {mode === 'study' ? (
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                ) : (
                  <Coffee className="w-6 h-6 text-green-600" />
                )}
                <h2 className={`text-xl font-semibold ${
                  mode === 'study' ? 'text-indigo-600' : 'text-green-600'
                }`}>
                  {mode === 'study' ? 'Study Time' : 'Break Time'}
                </h2>
              </div>

              {/* Subject Selection */}
              {mode === 'study' && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Current Subject
                  </label>
                  <select
                    value={selectedSubject?.id || ''}
                    onChange={(e) => {
                      const subject = subjects.find(s => s.id === e.target.value);
                      setSelectedSubject(subject || null);
                    }}
                    disabled={state === 'running'}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Timer Display */}
              <div className="relative mb-8">
                <div className="w-64 h-64 mx-auto relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={mode === 'study' ? '#4f46e5' : '#10b981'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {state === 'running' ? 'Running' : state === 'paused' ? 'Paused' : 'Ready'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {state === 'idle' && (
                  <button
                    onClick={startTimer}
                    disabled={!selectedSubject && mode === 'study'}
                    className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Play className="w-5 h-5" />
                    Start
                  </button>
                )}
                
                {state === 'running' && (
                  <button
                    onClick={pauseTimer}
                    className="flex items-center gap-2 px-8 py-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                )}
                
                {state === 'paused' && (
                  <button
                    onClick={startTimer}
                    className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    <Play className="w-5 h-5" />
                    Resume
                  </button>
                )}
                
                {state !== 'idle' && (
                  <button
                    onClick={stopTimer}
                    className="flex items-center gap-2 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    <Square className="w-5 h-5" />
                    Stop
                  </button>
                )}
                
                <button
                  onClick={resetTimer}
                  className="flex items-center gap-2 px-6 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Settings & Stats */}
          <div className="space-y-6">
            {/* Timer Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timer Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Duration: {studyDuration} min
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={studyDuration}
                    onChange={(e) => handleDurationChange('study', parseInt(e.target.value))}
                    disabled={state === 'running'}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Break Duration: {breakDuration} min
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={breakDuration}
                    onChange={(e) => handleDurationChange('break', parseInt(e.target.value))}
                    disabled={state === 'running'}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed Pomodoros</span>
                  <span className="font-semibold text-indigo-600">{completedPomodoros}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Study Time</span>
                  <span className="font-semibold text-green-600">
                    {Math.floor(totalStudyTime / 60)}m {totalStudyTime % 60}s
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Subject</span>
                  <span className="font-semibold text-gray-900">
                    {selectedSubject?.name || 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Pomodoro Tips</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Focus on one task during each session</li>
                <li>• Take breaks seriously - they help you recharge</li>
                <li>• Turn off notifications during study time</li>
                <li>• After 4 pomodoros, take a longer break (15-30 min)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}