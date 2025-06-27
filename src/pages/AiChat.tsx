import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Bot, User, Loader2 } from 'lucide-react';
import aiContent from '../data/aiContent.json';
import { Link } from 'react-router-dom';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

interface AiContent {
  type: string;
  title: string;
  content: string;
}

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: 'bot',
        text: '您好！我是 Chii Magnus 的 AI 助手。您可以问我关于他的文章、产品或任何与他相关的问题。',
      },
    ]);
  }, []);

  const findRelevantContent = (query: string): AiContent[] => {
    const queryWords = query.toLowerCase().split(/\s+/);
    const scores = aiContent.map((item, index) => {
      let score = 0;
      const content = `${item.title} ${item.content}`.toLowerCase();
      queryWords.forEach(word => {
        if (content.includes(word)) {
          score++;
        }
      });
      return { score, index };
    });

    scores.sort((a, b) => b.score - a.score);
    const topN = scores.slice(0, 3).filter(item => item.score > 0);
    return topN.map(item => aiContent[item.index]);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const relevantContent = findRelevantContent(input);
    
    try {
      // The Cloudflare Worker URL is now set to the deployed address.
      const response = await fetch('https://chii-ai-assistant.chiimagnus.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          context: relevantContent,
        }),
      });

      if (!response.ok) {
        throw new Error('AI 服务暂时不可用，请稍后再试。');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取 AI 的响应。');
      }
      
      let botMessageText = '';
      const botMessageId = Date.now() + 1;

      setMessages(prev => [...prev, { id: botMessageId, role: 'bot', text: '...' }]);
      
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botMessageText += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, text: botMessageText + '...' } : msg
        ));
      }
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { ...msg, text: botMessageText } : msg
      ));


    } catch (error: any) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: error.message || '抱歉，发生了一个未知错误。',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold">AI 问答</h1>
        <Link to="/" className="text-sm text-blue-400 hover:underline">返回首页</Link>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={20} />
                </div>
              )}
              <div
                className={`max-w-md md:max-w-lg lg:max-w-2xl px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-purple-600 rounded-br-none'
                    : 'bg-gray-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User size={20} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-gray-700">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="输入您的问题..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 flex items-center justify-center transition-transform duration-200 active:scale-90"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowUp size={20} />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AiChat; 