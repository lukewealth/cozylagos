import React, { useState, useMemo } from 'react';
import { Calendar, Users, Utensils, Anchor, Ship, CircleCheck, Star, Share2, Heart, Award, ArrowRight, Briefcase, Globe, Map, Crown, GraduationCap, Sparkles } from 'lucide-react';
import { SERVICE_BUNDLES } from '../data';

interface ExperienceDetailViewProps {
  onBackToHome: () => void;
}

export default function ExperienceDetailView({ onBackToHome }: ExperienceDetailViewProps) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-27');
  const [selectedTime, setSelectedTime] = useState<string>('02:00 PM');
  const [guestCount, setGuestCount] = useState<string>('up-to-5');
  const [chefAddon, setChefAddon] = useState<boolean>(true);
  const [photoAddon, setPhotoAddon] = useState<boolean>(false);
  const [jetskiAddon, setJetskiAddon] = useState<boolean>(true);
  
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [bookingRequested, setBookingRequested] = useState<boolean>(false);

  // Yacht base packages mapping (in NGN)
  const baseCost = 2500000; // ₦2.5M Base Pack

  // Additional guest tier modifiers
  const guestModifier = useMemo(() => {
    if (guestCount === '6-10') return 500000;
    if (guestCount === '11-15') return 1000000;
    return 0; // up-to-5
  }, [guestCount]);

  // Modifiers
  const chefCost = 300000;
  const photoCost = 250000;
  const jetskiCost = 400000;

  // Real-time sum calculation
  const calculatedTotal = useMemo(() => {
    let sum = baseCost + guestModifier;
    if (chefAddon) sum += chefCost;
    if (photoAddon) sum += photoCost;
    if (jetskiAddon) sum += jetskiCost;
    return sum;
  }, [guestModifier, chefAddon, photoAddon, jetskiAddon]);

  const handleBookingRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingRequested(true);
  };

  return (
    <div className="flex-grow bg-parchment animate-fade-in-up text-left">
      
      {/* HERO HERO SECTION */}
      <section className="relative w-full h-[400px] md:h-[550px] flex items-end pb-12 md:pb-16 select-none bg-charcoal">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuClJZQ9-BoVmmRqAZ5YttBYYzW1-2Lv4rnCNdcvL3D-OSYZII-nbBJJWpqV5Na5JgYUZd4pJL8_9fXZ2A4NYjXGMSeR7CgU8F64xmGQy-zaSgoekrg_ZTNaC5S2jIdDF2XFOvJ4h75LAwAp7Z3bHnznlOXt1sLe5r4r9oFl5rb_ENIFsVi_Cpj70vrZmgbrXHDN_VDySzVzpK_Oxjy0c8CalbGZMGou6urKXprf58_DQXWaWDa7qj87Xm87K2xxLViifBhZEqGo-iIo')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent"></div>
        </div>

        <div className="relative w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3.5 py-1 bg-gold/20 text-gold-light border border-gold/30 font-bold text-[9px] tracking-widest rounded-full uppercase backdrop-blur-md">
                Premier Ocean Experience
              </span>
              <span className="flex items-center text-gold-light text-xs font-bold gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>4.9 (128 Reviews)</span>
              </span>
            </div>
            
            <h1 className="font-serif text-3xl md:text-5xl xl:text-6xl text-white font-bold leading-tight uppercase tracking-tight">
              Private Lagos Island Yacht Party
            </h1>
            <p className="font-sans text-sm md:text-base text-white/85 font-light max-w-2xl mt-3 leading-relaxed">
              Ascend to the waters of Lagos in absolute style. A deeply curated custom voyage across the Lekki peninsula, merging pure skyline backdrops with elite in-house service.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsFavorited(!isFavorited)}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 text-white transition-colors"
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-gold text-gold' : ''}`} />
            </button>
            <button 
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 text-white transition-colors"
              title="Share experience"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CORE SPEC & BOOKING COLUMN GRID */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: ITINERARY & BULLETS (8/12th width) */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Highlights Bento */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">
              Exclusive Amenities Included
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-charcoal/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-sm">
                <Calendar className="w-6 h-6 text-gold-dark" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-charcoal/50">Duration</span>
                <span className="text-[13px] font-bold text-charcoal">6 Hours Cruise</span>
              </div>
              <div className="bg-white border border-charcoal/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-sm">
                <Users className="w-6 h-6 text-gold-dark" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-charcoal/50">Capacity</span>
                <span className="text-[13px] font-bold text-charcoal">Up to 15 Guests</span>
              </div>
              <div className="bg-white border border-charcoal/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-sm">
                <Utensils className="w-6 h-6 text-gold-dark" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-charcoal/50">Dining</span>
                <span className="text-[13px] font-bold text-charcoal">Gourmet Catering</span>
              </div>
              <div className="bg-white border border-charcoal/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-sm">
                <Ship className="w-6 h-6 text-gold-dark" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-charcoal/50">Vessel</span>
                <span className="text-[13px] font-bold text-charcoal">65ft Motor Yacht</span>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 aspect-[16/10] rounded-xl overflow-hidden shadow-sm bg-charcoal">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD--3KQdqUAW-vx4ZtvgQqz1KxRJtsBPnMS9vOHKrK8IefHg_iDZy3QwRWdOhomUnLtVU4GIt5NAW1GtKfDjblCfwU_IGsFBiNdRG0NdpYm5DfY4s38bV2MPedSISw9Z4SEkq8X3TiGSzkgtnm1qLpOkCvSziYHXQ673Bx8MiqiESIPXQcNRWOXTdyBtCME2azfi4GK6dvGzinqRh7GUNpfCDJeDUFCiUUFo9c30Lkw3MiANi3Y0Gz8PdcRelav2xgH2z6jLr8pBgTV" 
                alt="Yacht lounge interior"
                className="w-full h-full object-cover select-none"
              />
            </div>
            
            <div className="aspect-[4/3] md:aspect-auto h-full rounded-xl overflow-hidden shadow-sm bg-charcoal">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkgPlULSEIIgM1P9_--QfBZ7VhsN8RhVZHo1O10oSbOEMr-i4mliwJ36i0ov_LZyj2ho2HIT59tN2FD748YpDvahh1jWXo4TGTbzl30SSk2dDIygM-x2UmPrKPuKA-_BaFqlsrV_zWEvpgO2gGGB2oZu7Qx7HT8ZoLrR0W4jbOlh9PKBy_t2W8Z0L4hfWrTjONuyfyI_lYEN-zVRr9_bPDk9NABQwSVW4ixhFqpFRCGUBE4X2q-KpScU6gcTwGRgVm5whifA4QwBli" 
                alt="Platter on yacht"
                className="w-full h-full object-cover select-none"
              />
            </div>
          </div>

          {/* Timeline flow */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-8">
              Bespoke Cruise Itinerary
            </h2>
            <div className="relative border-l border-gold/30 ml-4 space-y-10 pl-6">
              
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-gold border-2 border-parchment" />
                <h3 className="font-serif text-lg font-bold text-charcoal">14:00 &mdash; Welcome Champagne Reception</h3>
                <p className="text-sm font-sans text-charcoal-light mt-1.5 leading-relaxed">
                  Embark securely via the Victoria Island private executive pier. Welcomed by the captain, pilot, and steward roster with premium chilled brut, safety overview, and full suite tours.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-charcoal-light/10 border-2 border-parchment" />
                <h3 className="font-serif text-lg font-bold text-charcoal">15:00 &mdash; Coastal Marina Cruising &amp; Caviar</h3>
                <p className="text-sm font-sans text-charcoal-light mt-1.5 leading-relaxed">
                  Smooth pilot sailing along the stunning Ikoyi waterways and Lekki shoreline. Fresh warm oysters, bespoke local fusion canapés, and cold mocktails curated by your chef.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-charcoal-light/10 border-2 border-parchment" />
                <h3 className="font-serif text-lg font-bold text-charcoal">17:00 &mdash; Deep Water Anchoring &amp; Aqua Sports</h3>
                <p className="text-sm font-sans text-charcoal-light mt-1.5 leading-relaxed">
                  Anchor at a gorgeous, calm lagoon bay with spectacular, clear horizons. Perfect timing for boarding luxury jet-skis, deep-sea swimming, paddle boards, or sun deck relaxing.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-charcoal-light/10 border-2 border-parchment" />
                <h3 className="font-serif text-lg font-bold text-charcoal">18:30 &mdash; Sunset Dinner Al Fresco</h3>
                <p className="text-sm font-sans text-charcoal-light mt-1.5 leading-relaxed">
                  A gorgeous multi-course gourmet grilled seafood spread or local fusion dinner served under candlelight on the open deck as the sun dips below the Atlantic waterline.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING WIDGET CALCULATOR (4/12th width) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-charcoal/5 p-8 rounded-3xl sticky top-28 shadow-xl text-left">
            <div className="border-b border-charcoal/5 pb-4 mb-6">
              <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 block mb-1">Estimated Charge</span>
              <div className="flex items-baseline">
                <span className="font-serif font-bold text-3xl text-gold-dark">
                  ₦{calculatedTotal.toLocaleString()}
                </span>
                <span className="text-xs text-charcoal/60 ml-2 font-mono">/ base package</span>
              </div>
            </div>

            {/* If has requested booking success */}
            {bookingRequested ? (
              <div className="space-y-6 py-6 text-center animate-fade-in-up">
                <div className="w-14 h-14 bg-gold/15 rounded-full flex items-center justify-center mx-auto text-gold-dark">
                  <Award className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif text-xl font-bold text-charcoal">Request Lodged!</h4>
                  <p className="text-xs text-charcoal-light leading-relaxed">
                    Our elite Coordinator is validating vessel availability for <strong className="text-charcoal">{selectedDate}</strong> at <strong className="text-charcoal">{selectedTime}</strong>. Sarah or a dedicated representative will ring you shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingRequested(false)}
                  className="w-full py-3.5 bg-charcoal hover:bg-gold-dark text-parchment font-bold text-xs tracking-wider uppercase rounded-xl transition-all"
                >
                  Adjust Reservation
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingRequest} className="space-y-6">
                
                {/* Date / Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5">
                      Target Date
                    </label>
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-parchment border-0 border-b border-charcoal/10 pb-2 text-sm text-charcoal font-semibold focus:ring-0 focus:border-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5">
                      Launch Time
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-charcoal/10 pb-2 text-sm text-charcoal font-semibold focus:ring-0 focus:border-gold outline-none cursor-pointer"
                    >
                      <option>10:00 AM</option>
                      <option>02:00 PM</option>
                      <option>04:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Guest select */}
                <div>
                  <label className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1.5">
                    Total Crew size
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-charcoal/10 pb-2 text-sm text-charcoal font-semibold focus:ring-0 focus:border-gold outline-none cursor-pointer"
                  >
                    <option value="up-to-5">Up to 5 Guests (Standard)</option>
                    <option value="6-10">6 - 10 Guests (+₦500,000)</option>
                    <option value="11-15">11 - 15 Guests (+₦1,000,000)</option>
                  </select>
                </div>

                {/* Add-ons */}
                <div className="pt-4 border-t border-charcoal/5">
                  <legend className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-4">
                    VIP Tailored Add-Ons
                  </legend>
                  
                  <div className="space-y-3">
                    
                    <label className="flex items-center justify-between p-3 border border-charcoal/5 rounded-xl cursor-pointer hover:bg-parchment/60 transition-colors select-none">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={chefAddon}
                          onChange={() => setChefAddon(!chefAddon)}
                          className="rounded text-gold focus:ring-0 focus:ring-offset-0 border-charcoal/10 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-charcoal">Private Gourmet Chef</span>
                      </div>
                      <span className="text-xs font-bold text-gold-dark">+₦300k</span>
                    </label>

                    <label className="flex items-center justify-between p-3 border border-charcoal/5 rounded-xl cursor-pointer hover:bg-parchment/60 transition-colors select-none">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={photoAddon}
                          onChange={() => setPhotoAddon(!photoAddon)}
                          className="rounded text-gold focus:ring-0 focus:ring-offset-0 border-charcoal/10 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-charcoal">Acoustic Photographer</span>
                      </div>
                      <span className="text-xs font-bold text-gold-dark">+₦250k</span>
                    </label>

                    <label className="flex items-center justify-between p-3 border border-charcoal/5 rounded-xl cursor-pointer hover:bg-parchment/60 transition-colors select-none">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={jetskiAddon}
                          onChange={() => setJetskiAddon(!jetskiAddon)}
                          className="rounded text-gold focus:ring-0 focus:ring-offset-0 border-charcoal/10 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-charcoal">Jet-Ski Hire (2 hrs bundle)</span>
                      </div>
                      <span className="text-xs font-bold text-gold-dark">+₦400k</span>
                    </label>

                  </div>
                </div>

                {/* Confirm pricing estimate */}
                <div className="pt-4 border-t border-charcoal/5 space-y-4">
                  <div className="flex items-center justify-between text-charcoal text-sm font-bold">
                    <span>Guaranteed Estimate</span>
                    <span>₦{calculatedTotal.toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-charcoal hover:bg-gold-dark text-parchment font-bold text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    <span>Request Charter Booking</span>
                  </button>

                  <p className="text-center text-[10px] text-charcoal/40 font-medium">
                    Requests clear within 10 minutes. Zero advance billing before verification.
                  </p>
                </div>

              </form>
            )}

          </div>
        </div>

      </section>

      {/* BUNDLES SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
            Premium Packages
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-3">
            Curated Experience Bundles
          </h2>
          <p className="text-sm text-charcoal/60 max-w-xl mx-auto">
            All-inclusive packages from 3-day escapes to 21-day luxury immersions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SERVICE_BUNDLES.map((bundle) => {
            const iconMap: Record<string, React.ReactNode> = {
              briefcase: <Briefcase className="w-5 h-5" />,
              globe: <Globe className="w-5 h-5" />,
              map: <Map className="w-5 h-5" />,
              crown: <Crown className="w-5 h-5" />,
              graduation: <GraduationCap className="w-5 h-5" />,
              heart: <Heart className="w-5 h-5" />,
              sparkles: <Sparkles className="w-5 h-5" />
            };
            const lowestPrice = Math.min(...bundle.tiers.map(t => t.price));
            return (
              <div
                key={bundle.id}
                className="group bg-parchment border border-charcoal/5 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
              >
                <div className="p-5">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center mb-3 text-gold-dark group-hover:scale-110 transition-transform">
                    {iconMap[bundle.icon]}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-charcoal mb-1">{bundle.title}</h3>
                  <p className="text-[11px] text-charcoal/50 mb-3">{bundle.tagline}</p>
                  <p className="text-xs text-charcoal/60 line-clamp-2 mb-4 leading-relaxed">{bundle.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-charcoal/5">
                    <div>
                      <span className="text-[9px] text-charcoal/40 uppercase tracking-widest block">From</span>
                      <span className="font-serif font-bold text-gold-dark">{lowestPrice.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-charcoal/40">{bundle.tiers.length} tiers</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
