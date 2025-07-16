import React, { useState } from 'react';
import { User, Subject, UserSettings } from '../types';
import { BookOpen, Clock, Target, Plus, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface UserOnboardingProps {
  onComplete: (user: User) => void;
}

const SUBJECT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
];

const defaultSettings: UserSettings = {
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

export default function UserOnboarding({ onComplete }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goals: [''],
    subjects: [] as Omit<Subject, 'id' | 'completedHours'>[],
    preferredStudyTimes: [] as string[],
    sessionLength: 60
  });

  const steps = [
    'Personal Info',
    'Study Goals',
    'Subjects',
    'Schedule',
    'Preferences'
  ];

  const timeSlots = [
    '06:00-08:00', '08:00-10:00', '10:00-12:00',
    '12:00-14:00', '14:00-16:00', '16:00-18:00',
    '18:00-20:00', '20:00-22:00'
  ];

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, '']
    }));
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal)
    }));
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, {
        name: '',
        color: SUBJECT_COLORS[prev.subjects.length % SUBJECT_COLORS.length],
        priority: 'medium',
        targetHours: 10
      }]
    }));
  };

  const removeSubject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const updateSubject = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === index ? { ...subject, [field]: value } : subject
      )
    }));
  };

  const toggleTimeSlot = (timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      preferredStudyTimes: prev.preferredStudyTimes.includes(timeSlot)
        ? prev.preferredStudyTimes.filter(t => t !== timeSlot)
        : [...prev.preferredStudyTimes, timeSlot]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const user: User = {
        id: Date.now().toString(),
        ...formData,
        goals: formData.goals.filter(goal => goal.trim() !== ''),
        subjects: formData.subjects.map((subject, index) => ({
          ...subject,
          id: (index + 1).toString(),
          completedHours: 0,
          resources: []
        })),
        createdAt: new Date(),
        settings: defaultSettings,
        level: 1,
        experience: 0,
        totalPoints: 0
      };
      onComplete(user);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() !== '' && formData.email.trim() !== '';
      case 1:
        return formData.goals.some(goal => goal.trim() !== '');
      case 2:
        return formData.subjects.length > 0 && formData.subjects.every(s => s.name.trim() !== '');
      case 3:
        return formData.preferredStudyTimes.length > 0;
      case 4:
        return formData.sessionLength > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to StudyFlow</h2>
              <p className="text-gray-600">Let's personalize your study experience</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your study goals?</h2>
              <p className="text-gray-600">Define what you want to achieve</p>
            </div>
            <div className="space-y-4">
              {formData.goals.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter a study goal"
                  />
                  {formData.goals.length > 1 && (
                    <button
                      onClick={() => removeGoal(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addGoal}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add another goal
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What subjects will you study?</h2>
              <p className="text-gray-600">Add the subjects you want to focus on</p>
            </div>
            <div className="space-y-4">
              {formData.subjects.map((subject, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Subject name"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: subject.color }}
                      />
                      <button
                        onClick={() => removeSubject(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={subject.priority}
                        onChange={(e) => updateSubject(index, 'priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Hours</label>
                      <input
                        type="number"
                        value={subject.targetHours}
                        onChange={(e) => updateSubject(index, 'targetHours', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addSubject}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add subject
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">When do you prefer to study?</h2>
              <p className="text-gray-600">Select your preferred time slots</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((timeSlot) => (
                <button
                  key={timeSlot}
                  onClick={() => toggleTimeSlot(timeSlot)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.preferredStudyTimes.includes(timeSlot)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {timeSlot}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Session Preferences</h2>
              <p className="text-gray-600">How long should your study sessions be?</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Length: {formData.sessionLength} minutes
                </label>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={formData.sessionLength}
                  onChange={(e) => setFormData(prev => ({ ...prev, sessionLength: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>15 min</span>
                  <span>3 hours</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isStepValid()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}