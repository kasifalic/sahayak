import React, { useRef, useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SahayakImg from '../../sahayak.png';
import { sendChatMessage, generateSessionId } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';



const NEWTON_EXPLANATION = `Respected Teacher, here is a simple way to explain Newton's First Law of Motion to your students:\n\n**Newton's First Law (Law of Inertia):**\nAn object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n**How to teach this:**\n- Use a toy car or ball: Show that it keeps moving until something stops it.\n- Example: When a car stops suddenly, passengers lean forward.\n- Explain the concept of inertia: Objects resist changes in their state of motion.\n\nWould you like a lesson plan for teaching this law?`;

const NEWTON_LESSON_PLAN = `Respected Teacher, here is a mock lesson plan for teaching Newton's First Law of Motion:\n\n**Lesson Plan: Newton's First Law of Motion**\n\n- **Objective:** Students will understand and demonstrate Newton's First Law.\n- **Materials:** Toy car, ball, book, smooth surface\n- **Introduction (5 min):** Ask students about objects that move or stop.\n- **Demonstration (10 min):** Roll a toy car, show it stops due to friction.\n- **Discussion (10 min):** Explain inertia and real-life examples.\n- **Activity (10 min):** Students try moving objects and observe what stops them.\n- **Assessment (5 min):** Ask students to give their own examples.\n- **Homework:** Observe and write about inertia at home.\n\nIf you want to further simplify the topic, you can use the 'Learn Concept' feature or ask for more examples!`;



function isNewtonLawQuestion(text) {
  // Match any question about newton and law(s) of motion
  return /newton.*law.*motion|law.*motion.*newton|newton.*law|law.*newton|first law of motion|law of inertia/i.test(text);
}

function isLessonPlanRequest(text) {
  return /lesson plan|plan.*lesson|prepare.*lesson|teach.*plan|create.*lesson|make.*lesson|help.*lesson/i.test(text);
}

const AIAssistantFloating = ({ open, setOpen }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { sender: 'ai', text: t('ai.initialMessage') }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Use authenticated user ID or default
      const userId = user?.uid || user?.email || "default_user";
      
      // Generate session ID if not exists
      const currentSessionId = sessionId || generateSessionId();
      if (!sessionId) {
        setSessionId(currentSessionId);
      }

      // Call the backend API
      const response = await sendChatMessage(currentInput, userId, currentSessionId);
      
      // Add AI response to messages
      const aiMsg = { 
        sender: 'ai', 
        text: response.response || 'Sorry, I encountered an issue. Please try again.' 
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Update session ID if provided by backend
      if (response.session_id && response.session_id !== currentSessionId) {
        setSessionId(response.session_id);
      }
      
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Fallback to mock responses if API fails
      let fallbackMsg;
      if (isNewtonLawQuestion(currentInput)) {
        fallbackMsg = { sender: 'ai', text: NEWTON_EXPLANATION };
      } else if (isLessonPlanRequest(currentInput)) {
        fallbackMsg = { sender: 'ai', text: NEWTON_LESSON_PLAN };
      } else {
        fallbackMsg = { sender: 'ai', text: 'I apologize, but I\'m having trouble connecting to my knowledge base. Please try again in a moment, or check your internet connection.' };
      }
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleClose = () => {
    setOpen(false);
    setMessages([
      { sender: 'ai', text: 'Respected Teacher, I am your AI Assistant. How can I help you with your teaching today?' }
    ]);
    // Keep session ID to maintain conversation context
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-1 flex items-center justify-center transition-all duration-200"
        onClick={() => setOpen(true)}
        style={{ display: open ? 'none' : 'flex', width: 64, height: 64 }}
        aria-label="Open AI Assistant"
      >
        <img src={SahayakImg} alt="AI Assistant" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow" />
      </button>

      {/* Chat Modal */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-blue-600 rounded-t-2xl">
            <span className="text-white font-semibold text-lg">{t('ai.title')}</span>
            <button onClick={handleClose} className="text-white hover:text-gray-200" aria-label="Close">
              <X size={22} />
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50" style={{ maxHeight: '320px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'}`}>
                  {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white rounded-b-2xl">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={isLoading ? t('ai.thinking') : t('ai.placeholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Type your question"
            />
            <button
              className={`rounded-full p-2 flex items-center justify-center transition-all duration-200 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={handleSend}
              disabled={isLoading}
              aria-label="Send"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantFloating; 