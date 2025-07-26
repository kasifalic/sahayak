import React, { useState, useRef, useEffect } from 'react';
import { X, Send, BookOpen, Lightbulb, GraduationCap } from 'lucide-react';

const NEWTON_FIRST_LAW_EXPLANATION = `**Newton's First Law of Motion** 🚀

Respected Teacher, here's how you can explain Newton's First Law to your students in a simplified way:

**What is it?**
Newton's First Law says: "An object will stay still or keep moving in a straight line unless something pushes or pulls on it."

**How to explain it to students:**
Tell your students: "Imagine you're on a skateboard on a perfectly smooth road. If you give yourself a push, you'll keep rolling and rolling... until something stops you (like friction, or you hitting a wall!)."

**Real-life examples to share with students:**
1. **Toy car** - When you push it, it keeps going until it hits something or the carpet slows it down
2. **Soccer ball** - When you kick it, it flies through the air until gravity pulls it down
3. **Students in a car** - When the car suddenly stops, they keep moving forward (that's why we wear seatbelts!)

**The Science to teach:**
- Objects like to keep doing what they're already doing (scientists call this "inertia")
- It takes force to make things start moving, stop moving, or change direction
- The bigger and heavier something is, the more force it takes to move it

**Fun fact to share:** This is why astronauts float in space - there's nothing to stop them from moving!

**Teaching Tips:**
- Use hands-on demonstrations with toy cars or balls
- Ask students to think of examples from their daily life
- Connect it to safety concepts like wearing seatbelts`;

const LearningWindow = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationStep, setConversationStep] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && conversationStep === 0) {
      setMessages([
        { 
          sender: 'ai', 
          text: '**Welcome to Learning Concepts, Respected Teacher!** 🎓\n\nType which topic you want to learn how to teach?',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { 
      sender: 'user', 
      text: input.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input.trim();
    setInput('');

    if (conversationStep === 0) {
      // User entered a topic
      setTimeout(() => {
        const aiMsg = { 
          sender: 'ai', 
          text: `Excellent choice, Respected Teacher! I'll show you how to explain **${userInput}** to your students in a simple way.\n\nWould you like me to show you how to explain it as if teaching a 10-year-old student? (Type 'yes' or 'no')`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
        setConversationStep(1);
      }, 800);
    } else if (conversationStep === 1) {
      // User responded to age question
      setTimeout(() => {
        const aiMsg = { 
          sender: 'ai', 
          text: NEWTON_FIRST_LAW_EXPLANATION,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
        setConversationStep(2);
      }, 800);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleClose = () => {
    onClose();
    setMessages([]);
    setConversationStep(0);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Learning Concepts</h2>
              <p className="text-blue-100 text-sm">Teaching guidance for educators</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-md' 
                      : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-200'
                  }`}>
                    {msg.text.includes('**') ? (
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: msg.text
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br>')
                        }} 
                      />
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.sender === 'ai' && (
                  <div className="order-2 ml-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder={conversationStep === 0 ? "Type which topic you want to learn how to teach..." : "Type your response..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={conversationStep === 2}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <GraduationCap className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || conversationStep === 2}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl p-3 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
          {conversationStep === 2 && (
            <div className="mt-3 text-center">
              <button
                onClick={() => {
                  setMessages([]);
                  setConversationStep(0);
                  setInput('');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Start a new teaching session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningWindow; 