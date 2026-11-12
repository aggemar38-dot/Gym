import React, { useState, useRef, useEffect } from 'react';
import { Language, UserProfile } from '../types';
import { X, Send, Sparkles, Loader2, Bot, User, HelpCircle } from 'lucide-react';

interface AiCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  userProfile: UserProfile;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiCoachDrawer: React.FC<AiCoachDrawerProps> = ({
  isOpen,
  onClose,
  language,
  userProfile,
}) => {
  const isHi = language === 'hi';
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isHi
        ? 'नमस्ते! मैं आपका "लीन गुरु" (LeanGuru AI) आहार व नो-जिम फैट-लॉस सलाहकार हूं।\n\nआप मुझसे बिना जिम के 60 दिन में फैट घटाने, किसी भी भारतीय खाने की कैलोरी, पार्टी में क्या खाएं, या भूख व क्रेविंग कंट्रोल करने का कोई भी सवाल बेझिझक पूछ सकते हैं!'
        : 'Hello! I am LeanGuru AI, your specialized No-Gym Fat Loss & Nutrition Advisor.\n\nAsk me anything about home diet portioning, breaking weight plateaus, late-night cravings, or custom meal adjustments!',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    isHi ? 'शादी या पार्टी में क्या खाऊं जिससे फैट न बढ़े?' : 'How to eat at parties without gaining fat?',
    isHi ? 'रात 11 बजे तेज भूख लगे तो क्या खाऊं?' : 'What to eat during late-night hunger?',
    isHi ? 'वजन 1 हफ़्ते से अटक गया है (Plateau), क्या करूं?' : 'How to break a fat-loss plateau?',
    isHi ? 'बिना सप्लीमेंट पाउडर के सस्ता प्रोटीन कैसे पूरा करें?' : 'Cheapest vegetarian protein sources?',
    isHi ? 'मीठी चाय की तलब को कैसे खत्म करूं?' : 'How to eliminate sugary tea without cravings?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          userProfile,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('AI Coach response failed');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: isHi
            ? 'क्षमा करें, सर्वर से संपर्क नहीं हो पाया। कृपया एक क्षण बाद पुनः प्रयास करें।'
            : 'Sorry, communication failed. Please try again shortly.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{isHi ? 'लीन गुरु AI (डाइट व फैट-लॉस कोच)' : 'LeanGuru AI Diet Coach'}</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {isHi ? '2 महीने का नो-जिम फैट बर्न गाइड' : '60-Day No-Gym Nutrition Expert'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed ${
                    isUser
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs pl-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>{isHi ? 'लीन गुरु विचार कर रहे हैं...' : 'LeanGuru is analyzing...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/30">
          <div className="text-[10px] text-slate-500 mb-1.5 font-medium flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>{isHi ? 'त्वरित प्रश्न:' : 'Quick Questions:'}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 whitespace-nowrap shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              isHi ? 'डाइट या फैट लॉस के बारे में कुछ भी पूछें...' : 'Ask diet or fat loss question...'
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
