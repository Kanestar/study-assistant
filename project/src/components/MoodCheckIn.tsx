import React, { useState } from 'react';
import { MoodEntry } from '../types';
import { getMotivation } from '../utils/studyApi';
import { Smile, Meh, Frown, Heart, Zap, Target, MessageSquare } from 'lucide-react';

interface MoodCheckInProps {
  onSubmit: (moodEntry: Omit<MoodEntry, 'id'>) => void;
  onClose: () => void;
}

const moodOptions = [
  { value: 'excellent', label: 'Excellent', icon: Heart, color: 'text-green-600', bg: 'bg-green-100' },
  { value: 'good', label: 'Good', icon: Smile, color: 'text-blue-600', bg: 'bg-blue-100' },
  { value: 'okay', label: 'Okay', icon: Meh, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { value: 'poor', label: 'Poor', icon: Frown, color: 'text-red-600', bg: 'bg-red-100' }
] as const;

export default function MoodCheckIn({ onSubmit, onClose }: MoodCheckInProps) {
  const [mood, setMood] = useState<'excellent' | 'good' | 'okay' | 'poor'>('good');
  const [energy, setEnergy] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [notes, setNotes] = useState('');
  const [motivationMessage, setMotivationMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await getMotivation(notes || mood);
      setMotivationMessage(response.message || "You've got this!");
    } catch (error) {
      console.error("Motivation API failed:", error);
      setMotivationMessage("Oops! Couldn't fetch a motivational message.");
    } finally {
      setLoading(false);
    }

    onSubmit({
      mood,
      energy,
      motivation,
      notes: notes.trim() || undefined,
      timestamp: new Date()
    });

    setTimeout(() => onClose(), 1500);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose} // Close when clicking background
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How are you feeling?</h2>
          <p className="text-gray-600">Let's check in on your mood and energy levels</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Current Mood</label>
            <div className="grid grid-cols-2 gap-3">
              {moodOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMood(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      mood === option.value
                        ? `border-current ${option.color} ${option.bg}`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        mood === option.value ? option.color : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        mood === option.value ? option.color : 'text-gray-600'
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-600" />
              <label className="text-sm font-medium text-gray-700">
                Energy Level: {energy}/5
              </label>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Motivation Level */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <label className="text-sm font-medium text-gray-700">
                Motivation Level: {motivation}/5
              </label>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={motivation}
              onChange={(e) => setMotivation(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? Any thoughts to share?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Motivation Message */}
          {motivationMessage && (
            <div className="bg-purple-100 text-purple-800 p-3 rounded-lg text-sm text-center">
              {motivationMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium"
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
