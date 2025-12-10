import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { ChatMessage, UserState } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import CatAvatar from './CatAvatar';

interface ChatInterfaceProps {
  userState: UserState;
  updateHistory: (history: ChatMessage[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userState, updateHistory, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [userState.chatHistory, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    const newHistory = [...userState.chatHistory, userMsg];
    updateHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(input, newHistory, userState);
      
      const modelMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };

      updateHistory([...newHistory, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col overflow-hidden border-4 border-pastel-lavender">
        {/* Header */}
        <div className="bg-pastel-purple p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-full overflow-hidden">
                <CatAvatar accessory={userState.accessory} />
             </div>
             <div>
               <h3 className="font-bold text-lg">Michi Asistente</h3>
               <p className="text-xs opacity-90">Siempre aquí para escucharte</p>
             </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {userState.chatHistory.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              <p>¡Hola {userState.name}! Soy Michi.</p>
              <p>Cuéntame cómo va tu día o qué tareas tenemos pendientes.</p>
            </div>
          )}
          {userState.chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-pastel-blue text-blue-900 rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-pastel-purple animate-spin" />
                 <span className="text-xs text-gray-500">Michi está pensando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe algo aquí..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple bg-gray-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-pastel-purple hover:bg-pastel-mint text-white p-3 rounded-xl transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
