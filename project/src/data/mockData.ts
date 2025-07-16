import { Subject, StudySession, PlannedSession, MotivationMessage, Achievement, Badge, Resource, MoodEntry, UserSettings } from '../types';

export const mockSettings: UserSettings = {
  notifications: {
    studyReminders: true,
    breakReminders: true,
    motivationalMessages: true,
    achievements: true
  },
  theme: 'light',
  language: 'en',
  timezone: 'America/New_York',
  soundEnabled: true,
  autoStartBreaks: false,
  weekStartsOn: 'monday'
};

export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    color: '#3B82F6',
    priority: 'high',
    targetHours: 20,
    completedHours: 12,
    resources: []
  },
  {
    id: '2',
    name: 'Physics',
    color: '#10B981',
    priority: 'high',
    targetHours: 15,
    completedHours: 8,
    resources: []
  },
  {
    id: '3',
    name: 'Chemistry',
    color: '#F59E0B',
    priority: 'medium',
    targetHours: 12,
    completedHours: 6,
    resources: []
  },
  {
    id: '4',
    name: 'Biology',
    color: '#EF4444',
    priority: 'medium',
    targetHours: 10,
    completedHours: 4,
    resources: []
  }
];

export const mockSessions: StudySession[] = [
  {
    id: '1',
    subjectId: '1',
    subjectName: 'Mathematics',
    duration: 3600,
    completedAt: new Date(Date.now() - 86400000),
    mood: 'good',
    notes: 'Completed calculus problems',
    pointsEarned: 120
  },
  {
    id: '2',
    subjectId: '2',
    subjectName: 'Physics',
    duration: 2700,
    completedAt: new Date(Date.now() - 172800000),
    mood: 'excellent',
    notes: 'Great progress on mechanics',
    pointsEarned: 90
  }
];

export const mockTodaysPlan: PlannedSession[] = [
  {
    id: '1',
    subjectId: '1',
    subjectName: 'Mathematics',
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
    completed: true,
    color: '#3B82F6'
  },
  {
    id: '2',
    subjectId: '2',
    subjectName: 'Physics',
    startTime: '11:00',
    endTime: '12:00',
    duration: 60,
    completed: false,
    color: '#10B981'
  },
  {
    id: '3',
    subjectId: '3',
    subjectName: 'Chemistry',
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    completed: false,
    color: '#F59E0B'
  }
];

export const motivationMessages: MotivationMessage[] = [
  {
    id: '1',
    message: "Great job completing your morning math session! You're building momentum! 🚀",
    type: 'celebration',
    timestamp: new Date()
  },
  {
    id: '2',
    message: "Remember: Every expert was once a beginner. Keep pushing forward! 💪",
    type: 'encouragement',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '3',
    message: "Your physics session starts in 15 minutes. Time to dive into some exciting concepts! ⚡",
    type: 'reminder',
    timestamp: new Date(Date.now() - 7200000)
  },
  {
    id: '4',
    message: "Challenge yourself today: Can you beat yesterday's study time? 🎯",
    type: 'challenge',
    timestamp: new Date(Date.now() - 10800000)
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first study session',
    icon: '🎯',
    category: 'time',
    requirement: 1,
    points: 50,
    earned: true,
    earnedAt: new Date(Date.now() - 86400000),
    progress: 100
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: 'Study for 7 consecutive days',
    icon: '🔥',
    category: 'consistency',
    requirement: 7,
    points: 200,
    earned: true,
    earnedAt: new Date(Date.now() - 43200000),
    progress: 100
  },
  {
    id: '3',
    name: 'Subject Master',
    description: 'Complete 50 hours in any subject',
    icon: '👑',
    category: 'subjects',
    requirement: 50,
    points: 500,
    earned: false,
    progress: 24
  },
  {
    id: '4',
    name: 'Marathon Runner',
    description: 'Study for 4 hours in a single day',
    icon: '🏃‍♂️',
    category: 'time',
    requirement: 240,
    points: 300,
    earned: false,
    progress: 65
  },
  {
    id: '5',
    name: 'Early Bird',
    description: 'Complete 10 morning study sessions',
    icon: '🌅',
    category: 'special',
    requirement: 10,
    points: 150,
    earned: false,
    progress: 40
  }
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Study Starter',
    description: 'Completed first study session',
    icon: '🌟',
    color: '#10B981',
    rarity: 'common',
    earnedAt: new Date(Date.now() - 86400000)
  },
  {
    id: '2',
    name: 'Consistency Champion',
    description: '7-day study streak',
    icon: '🔥',
    color: '#F59E0B',
    rarity: 'rare',
    earnedAt: new Date(Date.now() - 43200000)
  }
];

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Khan Academy - Calculus',
    type: 'link',
    url: 'https://www.khanacademy.org/math/calculus-1',
    tags: ['calculus', 'video', 'free'],
    subjectId: '1',
    createdAt: new Date(Date.now() - 86400000),
    lastAccessed: new Date(Date.now() - 3600000),
    isFavorite: true
  },
  {
    id: '2',
    title: 'Physics Formula Sheet',
    type: 'note',
    content: 'F = ma\nE = mc²\nv = u + at\n...',
    tags: ['formulas', 'reference'],
    subjectId: '2',
    createdAt: new Date(Date.now() - 172800000),
    isFavorite: false
  },
  {
    id: '3',
    title: 'Organic Chemistry Textbook',
    type: 'book',
    tags: ['textbook', 'organic', 'chemistry'],
    subjectId: '3',
    createdAt: new Date(Date.now() - 259200000),
    isFavorite: true
  }
];

export const mockMoodEntries: MoodEntry[] = [
  {
    id: '1',
    mood: 'good',
    energy: 4,
    motivation: 4,
    notes: 'Feeling productive today',
    timestamp: new Date()
  },
  {
    id: '2',
    mood: 'excellent',
    energy: 5,
    motivation: 5,
    notes: 'Great morning workout, ready to study!',
    timestamp: new Date(Date.now() - 86400000)
  }
];