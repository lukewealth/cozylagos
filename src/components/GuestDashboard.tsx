import React, { useState, useRef, useEffect } from 'react';
import { Compass, Sparkles, Send, Bell, Key, Utensils, ShieldCheck, Mail, ShieldAlert, BadgeInfo, Anchor, Gift } from 'lucide-react';

interface Message {
  sender: 'user' | 'concierge';
  text: string;
}

export default function GuestDashboard() {
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessageList] = useState<Message[]>([
    { sender: 'concierge', text: 'Good morning, Alexander. I see you check into the Bourdillon Penthouse in 3 days. What can I arrange for your arrival?' }
  ]);
  const [points, setPoints] = useState<number>(12450);
  const [redeemedPerk, setRedeemedPerk] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([
    "Host Sarah added a recommendation list for Victoria Island.",
    "Bourdillon Penthouse access details will unlock on check-in hour."
  ]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle conversational chatbot responding instantly!
  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || chatInput;
    if (!rawText.trim()) return;

    const userMessage: Message = { sender: 'user', text: rawText };
    setMessageList(prev => [...prev, userMessage]);
    if (!textToSend) setChatInput('');

    // Responsive rules
    setTimeout(() => {
      let reply = "I've passed your request to our Victoria Island operations coordinator. We'll update your dashboard timeline within the hour.";
      const textLower = rawText.toLowerCase();

      if (textLower.includes('chef') || textLower.includes('dinner') || textLower.includes('cook') || textLower.includes('food')) {
        reply = "Absolutely! Cozy Lagos offers certified private chefs fluent in deep West African fusion (Jollof risottos, grilled red snappers) and global cuisines. I can schedule a chef session for your stay duration (₦30,000 daily base) or an exclusive single-night spread. Shall I verify their availability?";
      } else if (textLower.includes('driver') || textLower.includes('car') || textLower.includes('transfer') || textLower.includes('chauffeur')) {
        reply = "I'll arrange that right away. We hold bulletproof executive SUVs and luxury sedans with skilled local security drivers. Standard premium airport pickups are ₦120,000, or full daily retention starts at ₦250,000 / day. Shall I lock this down for your October 12 arrival?";
      } else if (textLower.includes('checkout') || textLower.includes('late') || textLower.includes('time') || textLower.includes('extend')) {
        reply = "Perfectly understood. Standard checkout is 11:00 AM, but I can ask your host, Sarah, to authorize an elegant late checkout up to 3:00 PM (subject to incoming cleans). I have initiated the query on your behalf.";
      } else if (textLower.includes('power') || textLower.includes('safety') || textLower.includes('secure') || textLower.includes('security')) {
        reply = "Your comfort is completely insulated. The Bourdillon Penthouse possesses dual automated silent Cummins generators, backup solar lithium inverter hubs, treated high-pressure backup water storage, and active armed neighborhood entrance security checkpoints.";
      } else if (textLower.includes('yacht') || textLower.includes('boat') || textLower.includes('cruise')) {
        reply = "Our ocean experiences are stellar! We hold direct private yacht charters (65ft vessels) with al fresco dining and jet-ski additions starting at ₦2,500,000. Let me know if you would like me to draft a pending slot reservation.";
      } else if (textLower.includes('tips') || textLower.includes('restaurant') || textLower.includes('bar') || textLower.includes('club') || textLower.includes('local')) {
        reply = "For fine dining near Ikoyi, I highly recommend 'Slow Lagos' (contemporary botanical fusion) and 'Talindo Steakhouse'. For art, modern African gallery 'Rele' is an absolute must-visit. Let me know if you need reservation slots!";
      }

      const conciergeMessage: Message = { sender: 'concierge', text: reply };
      setMessageList(prev => [...prev, conciergeMessage]);
    }, 600);
  };

  const handleRedeemPerk = (perk: string, cost: number) => {
    if (points >= cost) {
      setPoints(prev => prev - cost);
      setRedeemedPerk(`Successfully verified! Your perk "${perk}" is now active in your itinerary.`);
      setTimeout(() => setRedeemedPerk(null), 5000);
    } else {
      alert("Insufficient Cozy Reserve points for this redeem tier.");
    }
  };

  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-8 sm:py-12 animate-fade-in-up text-left space-y-8 sm:space-y-12">
      
      {/* Welcome Banner */}
      <header className="border-b border-charcoal/5 pb-6">
        <div className="flex items-center gap-2 text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
          <span>Traveler Workspace</span>
        </div>
        <h1 className="font-serif text-3.5xl md:text-5xl font-bold text-charcoal leading-none">
          Welcome Home, Alexander
        </h1>
        <p className="text-sm text-charcoal-light mt-2 max-w-xl">
          Everything is set for your upcoming October enclaves arrival. Review coordinates or consult your concierge below.
        </p>
      </header>

      {/* Grid: Left and Right sides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: UPCOMING & TIMELINE (8/12th width) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Active Penthouse card overview */}
          <section className="bg-white border border-charcoal/5 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-gold/15 text-gold-dark text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                  Upcoming Trip
                </span>
                <h3 className="font-serif text-2xl font-bold text-charcoal mt-3">
                  The Bourdillon Penthouse Complex
                </h3>
                <p className="text-xs text-charcoal-light mt-1">Ikoyi enclave &bull; Exclusive Duplex</p>
              </div>
              <div className="text-right text-xs font-mono font-bold text-gold-dark bg-gold/5 border border-gold/10 px-3 py-1.5 rounded-xl">
                IN 3 DAYS
              </div>
            </div>

            {/* Backdrop visual container */}
            <div className="relative h-[250px] md:h-[300px] rounded-2xl overflow-hidden mb-6">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT7v6HK_tnUa6WTpgNU3w-xC6nanOkzoluDDqkzpMjo9rehqL_IXadp15Q0bXfHQ2iAoGF-5mDdMB10A9SyPbQ6xOhG7V0TgFpv_wMDWxM1HsjoKqPjRpLeIlICyffTnyTxNGIoewAzlQZAQJl4WclLX2ylbXealVdhlt1NE1kZNkv4D9v6lXZbnzv4XIZ510cBzoXde9R8z4b23a8FInUrxENaLvgc11c4oz_qCOhlH9xVLD9tazhnBZzxDdTk5BvHXsX5N-tQpH0" 
                alt="Penthouse inside"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-white">
                <div>
                  <span className="text-[9px] font-bold tracking-widest text-parchment/60 block mb-1">STAY PERIOD</span>
                  <span className="font-serif text-lg font-bold">Oct 12 &mdash; Oct 18, 2026</span>
                </div>

                <div className="flex gap-4">
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-parchment/60 block mb-1">BEDROOMS</span>
                    <span className="text-sm font-semibold">4 suites</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-parchment/60 block mb-1">LIFESTYLE GUESTS</span>
                    <span className="text-sm font-semibold">4 Crew</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for stay */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="px-5 py-3 bg-charcoal hover:bg-gold-dark text-parchment font-bold text-[10px] tracking-widest uppercase rounded-xl transition-colors">
                View Pre-Arrival Dossier
              </button>
              <button className="px-5 py-3 border border-charcoal/10 hover:border-charcoal text-charcoal font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all">
                Contact Coordinator Sarah
              </button>
            </div>
          </section>

          {/* Active timeline checklist */}
          <section className="bg-white border border-charcoal/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-charcoal">
              Your Experience Itinerary
            </h3>
            
            <div className="relative pl-6 border-l border-gold/25 space-y-8 text-left">
              
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-gold border p-0.5 border-parchment" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-gold-dark font-extrabold uppercase bg-gold/10 px-2 py-0.5 rounded-full inline-block mb-1">OCTOBER 12, 14:00</span>
                    <h4 className="font-sans text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-gold-dark" />
                      <span>VIP Check-in &amp; Key Handover</span>
                    </h4>
                    <p className="text-xs text-charcoal-light mt-1">Our Ikoyi lead operations officer will greet you at the penthouse lobby.</p>
                  </div>
                  <span className="bg-charcoal text-parchment font-bold text-[8px] tracking-widest uppercase px-2.5 py-1 rounded inline-block">CONFIRMED</span>
                </div>
              </div>

              <div className="relative opacity-90">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-parchment border-2 border-charcoal/20" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-charcoal-light/60 font-extrabold uppercase bg-charcoal/5 px-2 py-0.5 rounded-full inline-block mb-1">OCTOBER 13, 19:00</span>
                    <h4 className="font-sans text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-charcoal/40" />
                      <span>Traditional Fusion Private Chef dinner</span>
                    </h4>
                    <p className="text-xs text-charcoal-light mt-1">4-course gourmet spread with local Jollof prawns paired with sparkling champagne.</p>
                  </div>
                  <span className="bg-gold text-charcoal font-bold text-[8px] tracking-widest uppercase px-2.5 py-1 rounded inline-block">PENDING APPROVAL</span>
                </div>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-parchment border-2 border-charcoal/20" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-charcoal-light/40 font-extrabold uppercase bg-charcoal/5 px-2 py-0.5 rounded-full inline-block mb-1">OCTOBER 15, 14:00</span>
                    <h4 className="font-sans text-sm font-bold text-charcoal flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-charcoal/40" />
                      <span>Lagos Lagoon Private Yacht Party</span>
                    </h4>
                    <p className="text-xs text-charcoal-light mt-1">Private 6-hour boat charter with full catering, champagne and jet-ski bundles.</p>
                  </div>
                  <span className="bg-charcoal/10 text-charcoal/55 font-bold text-[8px] tracking-widest uppercase px-2.5 py-1 rounded inline-block">UNLOCKED</span>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: WALLET PERKS & AI CHAT (4/12th width) */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Cozy Reserve Wallet card */}
          <section className="bg-charcoal text-parchment rounded-3xl p-6 relative overflow-hidden group shadow-lg gold-inner-glow">
            <div className="absolute -right-12 -top-12 w-44 h-44 bg-gold-dark/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gold-light hover:text-gold font-serif italic text-lg font-bold flex items-center gap-1.5">
                  <Gift className="w-4 h-4" />
                  <span>Cozy Reserve Points</span>
                </span>
                <span className="text-[8px] font-bold tracking-[0.2em] bg-gold/10 border border-gold/15 text-gold px-2.5 py-1 rounded-full">
                  BLACK TIER
                </span>
              </div>

              <div>
                <p className="text-[9px] tracking-widest text-[#FAF9F8]/50 block mb-1">REDEEMABLE BALANCE</p>
                <p className="text-4xl font-serif text-white font-bold">{points.toLocaleString()}</p>
              </div>

              {redeemedPerk && (
                <div className="bg-gold/10 border border-gold/20 p-2.5 rounded-xl text-[11px] text-gold-light animate-fade-in-up">
                  {redeemedPerk}
                </div>
              )}

              {/* Perks quick actions list */}
              <div className="border-t border-white/10 pt-4 space-y-3 text-left">
                <p className="text-[9px] tracking-widest text-[#FAF9F8]/40 block mb-2 uppercase">Instant Diamond Redemptions</p>
                
                <button
                  type="button" 
                  onClick={() => handleRedeemPerk("VIP Chauffeur Airport pickup", 5000)}
                  className="w-full flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-xs font-semibold"
                >
                  <span>VIP Chauffeur pickup</span>
                  <span className="text-gold-light font-bold">5,000 pts</span>
                </button>

                <button 
                  type="button"
                  onClick={() => handleRedeemPerk("Armed Escort Escort vehicle on arrival", 8000)}
                  className="w-full flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-xs font-semibold"
                >
                  <span>Armed security escort</span>
                  <span className="text-gold-light font-bold">8,000 pts</span>
                </button>
              </div>
            </div>
          </section>

          {/* AI CONCIERGE CHAT PANEL */}
          <section className="bg-white border border-charcoal/5 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[400px]">
            {/* Header of Chat panel */}
            <div className="bg-parchment px-6 py-4 border-b border-charcoal/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green bg-emerald-500 animate-pulse" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-charcoal flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Amara AI Concierge</span>
                  </h4>
                  <span className="text-[8px] uppercase tracking-widest text-charcoal/40 block">Black tier concierge agent</span>
                </div>
              </div>
            </div>

            {/* Messages box list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 dark-scrollbar max-h-[250px]">
              {messages.map((m, idx) => (
                <div 
                  key={m.id || idx} 
                  className={`flex leading-relaxed flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-3 max-w-[85%] rounded-2xl text-[12.5px] ${
                    m.sender === 'user' 
                      ? 'bg-charcoal text-parchment rounded-tr-sm' 
                      : 'bg-parchment text-charcoal rounded-tl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* Quick prompts scroll */}
            <div className="px-4 py-2 border-t border-charcoal/5 bg-parchment/30 overflow-x-auto flex gap-2 hide-scrollbar">
              <button 
                type="button"
                onClick={() => handleSendMessage("Arrange gourmet private chef dinners")}
                className="whitespace-nowrap px-3 py-1 bg-white border border-charcoal/10 rounded-full text-[10px] text-charcoal font-semibold text-charcoal-light hover:border-gold hover:text-gold-dark"
              >
                Arrange Chef
              </button>
              <button 
                type="button"
                onClick={() => handleSendMessage("Hire security custom SUV airport transfers")}
                className="whitespace-nowrap px-3 py-1 bg-white border border-charcoal/10 rounded-full text-[10px] text-charcoal font-semibold text-charcoal-light hover:border-gold hover:text-gold-dark"
              >
                Book Driver
              </button>
              <button 
                type="button"
                onClick={() => handleSendMessage("Late checkout extension availability")}
                className="whitespace-nowrap px-3 py-1 bg-white border border-charcoal/10 rounded-full text-[10px] text-charcoal font-semibold text-charcoal-light hover:border-gold hover:text-gold-dark"
              >
                Late Checkout
              </button>
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-charcoal/5 flex gap-2">
              <input 
                type="text"
                placeholder="Ask about drivers, chef, generators..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3 py-2 bg-parchment border border-charcoal/5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold text-charcoal"
              />
              <button 
                type="button"
                onClick={() => handleSendMessage()}
                className="p-2.5 bg-charcoal hover:bg-gold-dark text-parchment hover:text-parchment rounded-xl transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            
          </section>

          {/* Inbox with coordinates Sarah */}
          <section className="bg-white border border-charcoal/5 rounded-3xl p-6 shadow-sm text-left">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-charcoal mb-4 flex items-center justify-between">
              <span>Coordinators Inbox</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            </h4>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 overflow-hidden shrink-0">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChO__jpr70PBuRfnq-BQBd5gWupLLFUTveVncrizosRGPnEKwyHQoENzgCg9lwfnKYOEM7t7cKhrxteYnQmMCPCT6fQiQhw0t5x_oyWaDcgpF6YVWQbFEqVsbRYkLo5jeNWRChx-mVO8ogBC_FOKOHv6-xLWrZeGqBTzy9SST378Rfx0ud7ubpuCc9pG_6KQSvtogIK9kbjtONB7EkpsMQcX3gIGzOMqtwgdxiG_aXaJN_AYuzaZ_bhvFIN5-cXDVzxd9AW4Sl1pM2" 
                  alt="Host Sarah"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-sans text-xs font-bold text-charcoal">Sarah (Bourdillon Coordinator)</h4>
                  <span className="text-[10px] text-charcoal/40 font-mono">10m ago</span>
                </div>
                <p className="text-xs text-charcoal-light truncate font-medium">Hello Alexander! Your private chef is verified for October 13th.</p>
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
