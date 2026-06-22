import React, { useState, useRef, useEffect } from 'react';
import { Compass, Sparkles, Send, Bell, Key, Utensils, ShieldCheck, Mail, ShieldAlert, BadgeInfo, Anchor, Gift, MapPin, Calendar, CreditCard } from 'lucide-react';

interface Message {
  sender: 'user' | 'concierge';
  text: string;
}

export default function UserDashboard() {
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessageList] = useState<Message[]>([
    { sender: 'concierge', text: 'Good afternoon, Alexander. How can I assist you today?' }
  ]);
  const [points, setPoints] = useState<number>(12450);
  const [notifications, setNotifications] = useState<string[]>([
    "Your profile was successfully verified.",
    "New experience recommendation available based on your preferences."
  ]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || chatInput;
    if (!rawText.trim()) return;

    const userMessage: Message = { sender: 'user', text: rawText };
    setMessageList(prev => [...prev, userMessage]);
    if (!textToSend) setChatInput('');

    setTimeout(() => {
      const conciergeMessage: Message = { sender: 'concierge', text: "I've noted that. I'll get back to you with more details shortly." };
      setMessageList(prev => [...prev, conciergeMessage]);
    }, 600);
  };

  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-12 animate-fade-in-up text-left space-y-12">
      <header className="border-b border-charcoal/5 pb-6">
        <div className="flex items-center gap-2 text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
          <span>User Workspace</span>
        </div>
        <h1 className="font-serif text-3.5xl md:text-5xl font-bold text-charcoal leading-none">
          Hello, Alexander
        </h1>
        <p className="text-sm text-charcoal-light mt-2 max-w-xl">
          Manage your personalized lifestyle enclaves and concierge requests below.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm hover:border-gold transition-colors cursor-pointer">
              <Calendar className="w-6 h-6 text-gold-dark mb-4" />
              <h4 className="font-bold text-charcoal text-sm">My Bookings</h4>
              <p className="text-xs text-charcoal-light mt-1">View upcoming stays</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm hover:border-gold transition-colors cursor-pointer">
              <MapPin className="w-6 h-6 text-gold-dark mb-4" />
              <h4 className="font-bold text-charcoal text-sm">Saved Places</h4>
              <p className="text-xs text-charcoal-light mt-1">Your curated locations</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-charcoal/5 shadow-sm hover:border-gold transition-colors cursor-pointer">
              <CreditCard className="w-6 h-6 text-gold-dark mb-4" />
              <h4 className="font-bold text-charcoal text-sm">Payments</h4>
              <p className="text-xs text-charcoal-light mt-1">Manage billing methods</p>
            </div>
          </div>

          {/* Recent Activity */}
          <section className="bg-white border border-charcoal/5 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-charcoal mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-charcoal/5 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-charcoal">Booking Confirmation</p>
                    <p className="text-xs text-charcoal-light">The Bourdillon Penthouse stay confirmed.</p>
                  </div>
                  <span className="ml-auto text-[10px] font-mono text-charcoal/40">2d ago</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          {/* Wallet Card */}
          <section className="bg-charcoal text-parchment rounded-3xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gold-light font-serif italic text-lg">Cozy Reserve</span>
              <Gift className="w-5 h-5 text-gold-dark" />
            </div>
            <p className="text-4xl font-serif text-white font-bold">{points.toLocaleString()}</p>
            <p className="text-[10px] tracking-widest text-parchment/50 mt-2 uppercase">Available Points</p>
          </section>

          {/* Chat Panel */}
          <section className="bg-white border border-charcoal/5 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[400px]">
            <div className="bg-parchment/50 px-4 py-3 border-b border-charcoal/5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-charcoal">Amara AI</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${m.sender === 'user' ? 'bg-charcoal text-parchment' : 'bg-parchment text-charcoal'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            <div className="p-3 border-t border-charcoal/5 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message concierge..."
                className="flex-1 bg-transparent text-xs focus:outline-none"
              />
              <button onClick={() => handleSendMessage()} className="text-gold-dark">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
