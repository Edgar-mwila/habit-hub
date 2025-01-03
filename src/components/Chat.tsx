import React, { useEffect, useState } from "react";
import { MessageCircle, Send } from "react-feather";
import { LocalStorageManager } from "../services/LocalStorageManager";
import { AnalyticsService } from "../services/AnalyticsService";
import { Goal } from "../types";
import { useSettings } from "../context/settings";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const { settings } = useSettings();

  useEffect(() => {
    const storedGoals = LocalStorageManager.getGoals();
    setGoals(storedGoals);
  }, []);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const generateContextualResponse = (message: string): string => {
    // Analyze user message and provide relevant goal-based responses
    if (message.toLowerCase().includes("progress")) {
      const overallProgress = Math.round(
        goals.reduce((acc, goal) => acc + (goal.currentProgress / goal.target) * 100, 0) / goals.length
      );
      return `Your overall progress is ${overallProgress}%. Keep up the great work!`;
    }

    if (message.toLowerCase().includes("category")) {
      const categories = [...new Set(goals.map((goal) => goal.category))];
      const categoryProgress = categories.map((category) => {
        const progress = AnalyticsService.calculateCategoryProgress(goals, category);
        return `${category}: ${progress}%`;
      });
      return `Here's your progress by category:
${categoryProgress.join("\n")}`;
    }

    if (message.toLowerCase().includes("streak")) {
      const streak = AnalyticsService.getStreakCount(goals);
      return `Your current streak is ${streak} days! Keep it going!`;
    }

    const motivationalMessage = AnalyticsService.generateMotivationalMessage(
      goals.reduce((acc, goal) => acc + goal.currentProgress, 0) / goals.length
    );
    return motivationalMessage;
  };

  const handleUserInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addMessage(userMessage, 'user');
    
    const botResponse = generateContextualResponse(userMessage);
    setTimeout(() => addMessage(botResponse, 'bot'), 500);

    setUserInput("");
  };

  return (
    <>
      {/* Chat Window */}
      {isChatOpen && (
        <div
          className={`fixed bottom-28 right-4 w-80 rounded-lg shadow-xl border-2 overflow-hidden ${
            settings.darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-purple-200'
          }`}
        >
          <div
            className={`p-4 flex justify-between items-center ${
              settings.darkMode
                ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100'
                : 'bg-gradient-to-r from-purple-600 to-orange-500 text-white'
            }`}
          >
            <h3 className="font-semibold">HabitHub Assistant</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className={`text-2xl ${
                settings.darkMode ? 'hover:text-gray-400' : 'hover:text-purple-200'
              }`}
            >
              ✕
            </button>
          </div>
          <div
            className={`p-4 max-h-80 overflow-y-auto ${
              settings.darkMode ? 'bg-gray-900 text-gray-200' : ''
            }`}
          >
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg text-sm ${
                    msg.sender === 'bot'
                      ? settings.darkMode
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-purple-50 text-purple-700'
                      : settings.darkMode
                      ? 'bg-gray-600 text-gray-200 self-end'
                      : 'bg-orange-50 text-orange-700 self-end'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={handleUserInput}
            className={`flex items-center p-2 border-t ${
              settings.darkMode ? 'border-gray-700' : ''
            }`}
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={`flex-1 p-2 border rounded-lg text-sm focus:outline-none ${
                settings.darkMode
                  ? 'bg-gray-800 text-gray-100 focus:ring-gray-500'
                  : 'focus:ring-purple-500'
              }`}
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className={`ml-2 p-2 rounded-lg hover:opacity-90 ${
                settings.darkMode
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100'
                  : 'bg-gradient-to-r from-purple-600 to-orange-500 text-white'
              }`}
            >
              <Send className="h-6 w-6" />
            </button>
          </form>
        </div>
      )}
  
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-16 right-4 p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow ${
          settings.darkMode
            ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100'
            : 'bg-gradient-to-r from-purple-600 to-orange-500 text-white'
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );  
};
