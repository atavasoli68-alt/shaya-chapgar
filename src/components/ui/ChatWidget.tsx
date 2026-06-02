'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { from: 'support', text: 'سلام! به شایا چاپگر آریا خوش آمدید. چطور می‌توانم کمکتان کنم؟', time: 'الان' }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: message, time: 'الان' }]);
    setMessage('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: 'support',
        text: 'ممنون از پیام شما. یکی از کارشناسان ما به زودی پاسخ خواهد داد.',
        time: 'الان'
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 left-6 w-80 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-fade-in">
          {/* Header */}
          <div className="bg-navy-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-white font-bold">ش</div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-navy-800" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">پشتیبانی آنلاین</div>
                <div className="text-green-400 text-xs">آنلاین</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-navy-300 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-64 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-6 ${
                  msg.from === 'user'
                    ? 'bg-navy-100 text-navy-800 rounded-tr-sm'
                    : 'bg-navy-700 text-white rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick options */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {['درخواست تعمیر', 'مشاوره خرید', 'تماس با ما'].map(opt => (
              <button
                key={opt}
                onClick={() => setMessage(opt)}
                className="text-xs bg-navy-50 text-navy-700 px-3 py-1 rounded-full hover:bg-navy-100 transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 pt-2 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
            <button
              onClick={sendMessage}
              className="w-9 h-9 bg-navy-700 hover:bg-navy-800 text-white rounded-xl flex items-center justify-center transition-colors"
            >
              <Send size={15} />
            </button>
          </div>

          <div className="px-4 pb-3 text-center">
            <a href="tel:02188123456" className="text-xs text-gray-400 hover:text-navy-700 flex items-center justify-center gap-1 transition-colors">
              <Phone size={12} />
              ۰۲۱-۸۸۱۲۳۴۵۶
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-navy-700 hover:bg-navy-800 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-200 hover:scale-110 relative chat-pulse"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}
