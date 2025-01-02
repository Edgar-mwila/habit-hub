import React, { useEffect, useState } from "react";
import { MessageCircle } from "react-feather";


interface ChatMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export const Chat = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
      const [messages, setMessages] = useState<ChatMessage[]>([]);
      const [isMenuOpen, setIsMenuOpen] = useState(false); // Dropdown menu state
    
      const motivationalQuotes = [
        "Every small step counts towards your bigger goal!",
        "You've got this! Keep pushing forward!",
        "Progress over perfection!",
        "Success is built one habit at a time.",
      ];
    
      const getMotivationalResponse = (goalStatus: 'success' | 'failure' | 'progress') => {
        switch (goalStatus) {
          case 'success':
            return "Amazing work! You're crushing your goals! 🎉";
          case 'failure':
            return "Remember, setbacks are setups for comebacks. Let's keep going! 💪";
          case 'progress':
            return "Steady progress leads to outstanding results. Keep it up! 🌟";
        }
      };
    
      const sendBotMessage = (text: string) => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      };
    
      useEffect(() => {
        if (isChatOpen && messages.length === 0) {
          sendBotMessage("Hi! I'm your personal goal companion. How can I help you today?");
        }
      }, [isChatOpen]);


    return (
        <>

                    {/* Chat */}
                    {isChatOpen && (
                      <div className="fixed bottom-28 right-4 w-80 bg-white rounded-lg shadow-xl border-2 border-purple-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4 text-white flex justify-between items-center">
                          <h3 className="font-semibold">HabbitHub Assistant</h3>
                          <button
                            onClick={() => setIsChatOpen(false)}
                            className="text-white hover:text-purple-200 text-2xl"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="p-4 max-h-80 overflow-y-auto">
                          <div className="space-y-4">
                            <p className="bg-purple-50 p-3 rounded-lg text-purple-700">
                              {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
                            </p>
                            <p className="italic text-orange-600 text-sm">
                              Need some motivation or advice? I'm here to help! 🌟
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
            
                    <button
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className="fixed bottom-16 right-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <MessageCircle className="h-6 w-6" />
                    </button>
        </>
    )
}