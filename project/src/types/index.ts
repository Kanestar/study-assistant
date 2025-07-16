export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  goals: string[];
  subjects: Subject[];
  preferredStudyTimes: string[];
  sessionLength: number;
  createdAt: Date;
  settings: UserSettings;
  level: number;
  experience: number;
  totalPoints: number;
}

export interface UserSettings {
  notifications: {
    studyReminders: boolean;
    breakReminders: boolean;
    motivationalMessages: boolean;
    achievements: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  weekStartsOn: 'sunday' | 'monday';
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  targetHours: number;
  completedHours: number;
  resources: Resource[];
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  duration: number;
  completedAt: Date;
  mood: 'excellent' | 'good' | 'okay' | 'poor';
  notes?: string;
  pointsEarned: number;
}

export interface StudyPlan {
  id: string;
  date: Date;
  sessions: PlannedSession[];
}

export interface PlannedSession {
  id: string;
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  duration: number;
  completed: boolean;
  color: string;
}

export interface MotivationMessage {
  id: string;
  message: string;
  type: 'encouragement' | 'reminder' | 'celebration' | 'challenge';
  timestamp: Date;
  mood?: 'excellent' | 'good' | 'okay' | 'poor';
}

export interface MoodEntry {
  id: string;
  mood: 'excellent' | 'good' | 'okay' | 'poor';
  energy: number; // 1-5 scale
  motivation: number; // 1-5 scale
  notes?: string;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'time' | 'consistency' | 'subjects' | 'special';
  requirement: number;
  points: number;
  earned: boolean;
  earnedAt?: Date;
  progress: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'note' | 'video' | 'book';
  url?: string;
  content?: string;
  tags: string[];
  subjectId: string;
  createdAt: Date;
  lastAccessed?: Date;
  isFavorite: boolean;
}

export interface StudyStreak {
  current: number;
  longest: number;
  lastStudyDate: Date;
}