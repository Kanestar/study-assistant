import React, { useState, useEffect } from 'react';
import { User, StudySession, PlannedSession, MotivationMessage, MoodEntry, Resource } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import UserOnboarding from './components/UserOnboarding';
import StudyDashboard from './components/StudyDashboard';
import StudyTimer from './components/StudyTimer';
import ProgressTracking from './components/ProgressTracking';
import MoodCheckIn from './components/MoodCheckIn';
import ResourceManager from './components/ResourceManager';
import Settings from './components/Settings';
import { mockTodaysPlan, mockSessions, mockResources, mockMoodEntries } from './data/mockData';
import { getMotivation } from './utils/studyApi'; // ✅ API call function

type AppView = 'onboarding' | 'dashboard' | 'timer' | 'progress' | 'resources' | 'settings';

function App() {
  const [user, setUser] = useLocalStorage<User | null>('studyflow-user', null);
  const [sessions, setSessions] = useLocalStorage<StudySession[]>('studyflow-sessions', mockSessions);
  const [resources, setResources] = useLocalStorage<Resource[]>('studyflow-resources', mockResources);
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('studyflow-mood-entries', mockMoodEntries);
  const [todaysPlan, setTodaysPlan] = useLocalStorage<PlannedSession[]>('studyflow-todays-plan', mockTodaysPlan);

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);

  // ✅ Store motivation message from backend
  const [motivationMessage, setMotivationMessage] = useState<MotivationMessage>({
    message: "Keep pushing forward!",
    type: "encouragement",
    timestamp: new Date(),
  });

  useEffect(() => {
    if (!user) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  }, [user]);

  const handleUserOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    setCurrentView('dashboard');
  };

  const handleStartSession = (sessionId: string) => {
    setCurrentView('timer');
  };

  const handleMoodCheckIn = () => {
    setShowMoodCheckIn(true);
  };

  const handleMoodSubmit = async (moodEntry: Omit<MoodEntry, 'id'>) => {
    const newMoodEntry: MoodEntry = {
      ...moodEntry,
      id: Date.now().toString(),
    };
    setMoodEntries(prev => [...prev, newMoodEntry]);
    setShowMoodCheckIn(false);

    // ✅ Call backend API to get motivation
    try {
      const response = await getMotivation(moodEntry.notes || moodEntry.mood);
      setMotivationMessage({
        message: response.message,
        type: response.type || 'encouragement',
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Failed to fetch motivation", err);
    }
  };

  const handleSessionComplete = (session: Omit<StudySession, 'id'>) => {
    const basePoints = Math.floor(session.duration / 60);
    const moodMultiplier = {
      excellent: 1.5,
      good: 1.2,
      okay: 1.0,
      poor: 0.8
    };
    const pointsEarned = Math.floor(basePoints * moodMultiplier[session.mood]);

    const newSession: StudySession = {
      ...session,
      id: Date.now().toString(),
      pointsEarned
    };
    setSessions(prev => [...prev, newSession]);

    setTodaysPlan(prev =>
      prev.map(planned =>
        planned.subjectId === session.subjectId
          ? { ...planned, completed: true }
          : planned
      )
    );

    if (user) {
      const updatedUser = {
        ...user,
        experience: user.experience + pointsEarned,
        totalPoints: user.totalPoints + pointsEarned,
        level: Math.floor((user.experience + pointsEarned) / 1000) + 1,
        subjects: user.subjects.map(subject =>
          subject.id === session.subjectId
            ? { ...subject, completedHours: subject.completedHours + (session.duration / 3600) }
            : subject
        )
      };
      setUser(updatedUser);
    }

    setCurrentView('dashboard');
  };

  const handleViewProgress = () => setCurrentView('progress');
  const handleViewResources = () => setCurrentView('resources');
  const handleViewSettings = () => setCurrentView('settings');
  const handleBackToDashboard = () => setCurrentView('dashboard');

  const handleAddResource = (resource: Omit<Resource, 'id' | 'createdAt'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setResources(prev => [...prev, newResource]);
  };

  const handleUpdateResource = (id: string, updates: Partial<Resource>) => {
    setResources(prev => prev.map(resource =>
      resource.id === id ? { ...resource, ...updates } : resource
    ));
  };

  const handleDeleteResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // 📌 Show different views
  if (currentView === 'onboarding' || !user) {
    return <UserOnboarding onComplete={handleUserOnboardingComplete} />;
  }

  if (currentView === 'timer') {
    return (
      <StudyTimer
        subjects={user.subjects}
        onSessionComplete={handleSessionComplete}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'progress') {
    return (
      <ProgressTracking
        user={user}
        sessions={sessions}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'resources') {
    return (
      <ResourceManager
        resources={resources}
        subjects={user.subjects}
        onAddResource={handleAddResource}
        onUpdateResource={handleUpdateResource}
        onDeleteResource={handleDeleteResource}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <Settings
        user={user}
        onUpdateUser={handleUpdateUser}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <>
      <StudyDashboard
        user={user}
        todaysPlan={todaysPlan}
        motivationMessage={motivationMessage} 
        onMoodCheckIn={handleMoodCheckIn}
        onStartSession={handleStartSession}
        onViewProgress={handleViewProgress}
        onViewResources={handleViewResources}
        onViewSettings={handleViewSettings}
      />

      {showMoodCheckIn && (
        <MoodCheckIn
          onSubmit={handleMoodSubmit}
          onClose={() => setShowMoodCheckIn(false)}
        />
      )}
    </>
  );
}

export default App;
