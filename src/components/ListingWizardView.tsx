import React, { useState, useMemo } from 'react';
import { ShieldCheck, Plus, ArrowRight, ArrowLeft, Upload, CheckSquare, Sparkles, Home, DollarSign, Image } from 'lucide-react';
import { Listing } from '../types';

interface ListingWizardProps {
  onPublishListing: (newListing: Listing) => void;
  onCancel: () => void;
}

export default function ListingWizardView({ onPublishListing, onCancel }: ListingWizardProps) {
  const [step, setStep] = useState<number>(1);
  
  // Step 1 states
  const [propertyName, setPropertyName] = useState('The Sapphire Penthouse');
  const [category, setCategory] = useState<'Penthouse' | 'Luxury Villa' | 'Executive Studio' | 'Serviced Apartment'>('Penthouse');
  const [location, setLocation] = useState<'Ikoyi' | 'Victoria Island' | 'Banana Island' | 'Lekki Phase 1'>('Ikoyi');
  const [description, setDescription] = useState('An exceptional, custom-renovated sky residence featuring floor-to-ceiling panoramic views of the coastal skyline. Styled with imported Italian furniture, brushed gold automation controls, and treated with complete high-pressure water back-up storage.');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3.5);
  const [maxGuests, setMaxGuests] = useState(6);

  // Step 2 photo preview simulated state
  const [showPrebuiltPhotos, setShowPrebuiltPhotos] = useState(true);

  // Step 3 pricing states
  const [nightlyRate, setNightlyRate] = useState<number>(450000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(150000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(["24/7 Power", "High-Speed Wi-Fi", "Infinity Pool", "Concierge"]);

  // Step 4 final state
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const amenitiesList = [
    { title: "24/7 Power", desc: "Uninterrupted supply via solar/battery inverters" },
    { title: "Infinity Pool", desc: "Private or shared swimming pool access" },
    { title: "Private Chef", desc: "Gourmet caterer option assigned on-demand" },
    { title: "Concierge", desc: "Dedicated lifestyle and check-in supervisor" },
    { title: "Chauffeur", desc: "Bulletproof premium SUV options available" },
    { title: "High-Speed Wi-Fi", desc: "Active Starlink or high-end fiber optic" }
  ];

  const handleToggleAmenity = (title: string) => {
    setSelectedAmenities(prev => 
      prev.includes(title) ? prev.filter(a => a !== title) : [...prev, title]
    );
  };

  const calculatedEarnings = useMemo(() => {
    const fee = nightlyRate * 0.15;
    return nightlyRate - fee;
  }, [nightlyRate]);

      const handleFinalPublish = () => {
        if (!acceptTerms) {
          alert("Please accept the Host Terms & Conditions to publish.");
          return;
        }

        const now = new Date().toISOString();
        const newHome: Listing = {
          id: `custom-stay-${Date.now()}`,
          title: propertyName,
          description,
          category,
          location,
          bedrooms,
          bathrooms,
          maxGuests,
          nightlyRate: Number(nightlyRate),
          weekendPremium: 15,
          cleaningFee: 25000,
          securityDeposit: Number(securityDeposit),
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2GGWFNwuBO2JM2bYf-QFEBP5nlp9knwLAIEbuxzj4ld_7CfhmUboRV3Ih7CVn_cIyrr_4X1CctHurZYPJbDxPLcuNMAlgZ8E7GyLfuIZd0L6TiIH6JL4qxE0S6LH3dMbrqgFBA03tV_nv4ZYAyrn6SxvsPQIXQbaDeHNvc4U7p0dKE_MVLgA3pA2eXUVxVCT1kqKk61Iy5V8EtXhKI2oGFsLpYuJKl_0DR9wGJZd3pAuZVlzm1NLpNPC1R-jcDjf_0MBaI235ER6",
          images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2GGWFNwuBO2JM2bYf-QFEBP5nlp9knwLAIEbuxzj4ld_7CfhmUboRV3Ih7CVn_cIyrr_4X1CctHurZYPJbDxPLcuNMAlgZ8E7GyLfuIZd0L6TiIH6JL4qxE0S6LH3dMbrqgFBA03tV_nv4ZYAyrn6SxvsPQIXQbaDeHNvc4U7p0dKE_MVLgA3pA2eXUVxVCT1kqKk61Iy5V8EtXhKI2oGFsLpYuJKl_0DR9wGJZd3pAuZVlzm1NLpNPC1R-jcDjf_0MBaI235ER6"
          ],
          amenities: selectedAmenities,
          ownerId: "emeka-anene",
          isActive: isPublic,
          reviewsCount: 0,
          rating: 5.0,
          aiMatchPercent: 95,
          createdAt: now,
          updatedAt: now
        };

        onPublishListing(newHome);
      };


  return (
    <div className="flex-grow flex flex-col md:flex-row min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-hidden text-left bg-parchment animate-fade-in-up">
      
      {/* 1. LEFT WIZARD STEP NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-charcoal/5 p-6 h-full justifications-between shrink-0">
        <div className="space-y-8">
          <div>
            <span className="text-gold-dark font-bold text-[9px] tracking-[0.25em] uppercase block mb-1">Interactive Wizard</span>
            <h3 className="font-serif text-lg font-bold text-charcoal">Apartment Onboarding</h3>
          </div>

          <nav className="flex flex-col gap-6 text-left">
            <div className={`pl-4 border-l-2 py-1 ${step === 1 ? 'border-gold text-charcoal font-bold' : 'border-transparent text-charcoal/40'}`}>
              <span className="block text-[8px] tracking-widest font-mono">STEP 1</span>
              <span className="text-xs uppercase tracking-wider">Basic Details</span>
            </div>

            <div className={`pl-4 border-l-2 py-1 ${step === 2 ? 'border-gold text-charcoal font-bold' : 'border-transparent text-charcoal/40'}`}>
              <span className="block text-[8px] tracking-widest font-mono">STEP 2</span>
              <span className="text-xs uppercase tracking-wider">Media Uploads</span>
            </div>

            <div className={`pl-4 border-l-2 py-1 ${step === 3 ? 'border-gold text-charcoal font-bold' : 'border-transparent text-charcoal/40'}`}>
              <span className="block text-[8px] tracking-widest font-mono">STEP 3</span>
              <span className="text-xs uppercase tracking-wider">Pricing &amp; Perks</span>
            </div>

            <div className={`pl-4 border-l-2 py-1 ${step === 4 ? 'border-gold text-charcoal font-bold' : 'border-transparent text-charcoal/40'}`}>
              <span className="block text-[8px] tracking-widest font-mono">STEP 4</span>
              <span className="text-xs uppercase tracking-wider">Review &amp; Publish</span>
            </div>
          </nav>
        </div>

        <button 
          onClick={onCancel}
          className="w-full text-center text-charcoal-light hover:text-charcoal font-bold text-[10px] tracking-widest uppercase border border-charcoal/10 py-3 rounded-xl hover:bg-parchment/50"
        >
          Abandon Draft
        </button>
      </aside>

      {/* 2. CORE ENTRY AND CALCULATORS DISPLAY */}
      <section className="flex-grow h-full overflow-y-auto p-6 md:p-12 xl:p-14">
        <div className="max-w-[850px] mx-auto space-y-8">
          
          {/* Header */}
          <header>
            <div className="flex items-center gap-2">
              <span className="bg-gold/15 text-gold-dark text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Step {step} of 4
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mt-3">
              {step === 1 && "Establish Physical Identity"}
              {step === 2 && "Curate Visual Portfolios"}
              {step === 3 && "Define Strategy & Value"}
              {step === 4 && "Review & Establish live portal"}
            </h2>
            <p className="text-sm text-charcoal-light mt-1.5 font-light">
              {step === 1 && "Supply the title descriptions, locale enclaves, and guest capacities of your property."}
              {step === 2 && "Furnished residences require pristine high resolution, filterless, sunlit photo portfolios."}
              {step === 3 && "Establish basic nightly NGN rates, standard deposits, and declare high-end perks."}
              {step === 4 && "Check off details before placing your property on the live consumer discovery dashboard."}
            </p>
          </header>

          {/* STEP 1: COMPONENT */}
          {step === 1 && (
            <div className="bg-white border border-charcoal/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm animate-fade-in-up">
              
              <div className="space-y-4">
                <label className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest">Property Name</label>
                <input 
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. The Sapphire Penthouse"
                  className="w-full bg-parchment/30 border-0 border-b border-charcoal/15 pb-2 font-serif text-lg md:text-xl text-charcoal font-bold focus:ring-0 focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest">Listing Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-charcoal/15 pb-2 text-sm text-charcoal font-semibold focus:ring-0 focus:border-gold cursor-pointer"
                  >
                    <option value="Penthouse">Penthouse Suite</option>
                    <option value="Luxury Villa">Luxury Villa</option>
                    <option value="Executive Studio">Executive Studio</option>
                    <option value="Serviced Apartment">Serviced Apartment</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest">Premium Enclave Locale</label>
                  <select
                    value={location}
                    onChange={(e: any) => setLocation(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-charcoal/15 pb-2 text-sm text-charcoal font-semibold focus:ring-0 focus:border-gold cursor-pointer"
                  >
                    <option value="Ikoyi">Ikoyi</option>
                    <option value="Victoria Island">Victoria Island</option>
                    <option value="Banana Island">Banana Island</option>
                    <option value="Lekki Phase 1">Lekki Phase 1</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest">Ambiance description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell our high-end travelers what makes this space majestic..."
                  className="w-full bg-parchment/20 border border-charcoal/5 p-4 rounded-2xl text-xs text-charcoal-light leading-relaxed focus:ring-1 focus:ring-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-charcoal/5 text-center">
                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">BEDROOM SUITES</span>
                  <input 
                    type="number" 
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-16 bg-parchment p-2 rounded-xl font-bold font-mono text-center mx-auto focus:ring-1 focus:ring-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">BATHROOM UNITS</span>
                  <input 
                    type="number" 
                    step={0.5}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-16 bg-parchment p-2 rounded-xl font-bold font-mono text-center mx-auto focus:ring-1 focus:ring-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">MAX CREW SIZE</span>
                  <input 
                    type="number" 
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-16 bg-parchment p-2 rounded-xl font-bold font-mono text-center mx-auto focus:ring-1 focus:ring-gold outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: PHOTOS */}
          {step === 2 && (
            <div className="bg-white border border-charcoal/5 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm animate-fade-in-up">
              
              {/* Drag drop zone simulation */}
              <div className="border-2 border-dashed border-gold/40 bg-gold/5 rounded-2xl p-10 text-center hover:bg-gold/10 transition-colors cursor-pointer flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-gold-dark mb-4" />
                <h4 className="font-serif text-lg font-bold text-charcoal">Select High-Res Image files</h4>
                <p className="text-xs text-charcoal-light mt-1.5 max-w-sm">Drag PNG, WEBP, JPG archives here or clicks to load camera roll.</p>
                <span className="text-[10px] text-charcoal/40 font-mono tracking-widest mt-3">RECOMMENDED: 1920X1080 AT NATURAL sunset</span>
              </div>

              {/* Prebuilt thumbnails */}
              {showPrebuiltPhotos && (
                <div className="space-y-4">
                  <h4 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider">Uploaded Photos (2)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden group shadow-sm bg-charcoal">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4o0J2sntRKKtlIAQcqEGEnhUK3mrPA8CVUTwMfbsLSeKTCUzpz34O8PkqYCfWFTq0u_gBZcP1d4PzMfGdqfmma1J2-Et5LvNk_re7iVH0T0Npi-xZqHHoX6holOvcgV_aBzvssTj1UTrDrlUhBL0PqFuMmhf0IM_NmCN-inLB25j_EMwUMM-jkqwwXp5woFWVn6SNOWB-P1w5AaWxdc5fX2fDNUxJi7SSOop-NAhkJr9-k1X1-oiZbEM0q3TgEd4EdWRCixJFNac5" alt="Uploaded interior" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-parchment text-charcoal p-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider">LIVING</div>
                    </div>

                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden group shadow-sm bg-charcoal">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAA8t5V_fEJnqfX-s0st_QTUpG8OPvmoyv3facqIFD88_ZEpoxhcUUMtURnFh7mz_KUXWYzXeLDyFRUHP23hTNFDPUwmVFHhmIBFhIg6XNIujaI1Uz7w-Jc040fwP3F2W7dQUQt-uKcmXyafAK5c6Q3Qdk9F9MB0jRIz9w7kFCGqFHKcYIByfWuWx8tmhpFVIEX0Srl-RlSboTfFGH9hM2MLdvV4Nyz5_Yif7RgcvqfqYMdMYSkAVjHu0iGRw3Xt6ostMwAkDBfXnm" alt="Uploaded kitchen" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-parchment text-charcoal p-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider">MARBLE COOK</div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 3: PRICING & CHIPS */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up">
              
              {/* Fields column */}
              <div className="lg:col-span-7 bg-white border border-charcoal/5 p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
                
                <div className="space-y-4">
                  <label className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest">Base Nightly Rate (NGN)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-0 text-lg font-serif font-bold text-gold-dark pl-2">₦</span>
                    <input 
                      type="number"
                      value={nightlyRate}
                      onChange={(e) => setNightlyRate(Number(e.target.value))}
                      className="w-full bg-parchment/30 border-0 border-b border-charcoal/15 pb-2 text-lg font-mono text-charcoal font-bold pl-8 focus:ring-0 focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest">Lock-in security deposit value (NGN)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-0 text-sm font-bold text-charcoal pl-2">₦</span>
                    <input 
                      type="number"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                      className="w-full bg-parchment/30 border-0 border-b border-charcoal/15 pb-2 text-sm font-mono text-charcoal pl-6 focus:ring-0 focus:border-gold outline-none"
                    />
                  </div>
                </div>

                {/* Amenities grid */}
                <div className="space-y-3 pt-4 border-t border-charcoal/5">
                  <span className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest mb-4">Highlight Enclave Amenities</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {amenitiesList.map((am) => {
                      const isChecked = selectedAmenities.includes(am.title);

                      return (
                        <div 
                          key={am.title}
                          onClick={() => handleToggleAmenity(am.title)}
                          className={`p-3 border rounded-xl flex items-start gap-3.5 cursor-pointer transition-all ${
                            isChecked 
                              ? 'border-gold bg-gold/5 text-charcoal' 
                              : 'border-charcoal/10 bg-transparent text-charcoal-light'
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by div click
                            className="rounded pointer-events-none text-gold border-charcoal/10 w-4 h-4 cursor-pointer mt-0.5"
                          />
                          <div>
                            <span className="block text-xs font-bold">{am.title}</span>
                            <span className="block text-[10px] text-charcoal-light/60 mt-0.5 font-medium leading-none">{am.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Side profits calculator preview */}
              <div className="lg:col-span-5 bg-charcoal text-parchment rounded-3xl p-6 shadow-xl gold-inner-glow space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h4 className="font-serif text-sm font-bold text-gold-light flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Host Profit Estimator</span>
                  </h4>
                  <span className="text-[10px] text-[#FAF9F8]/40 font-mono">CALC_V2.0</span>
                </div>

                <div className="space-y-4 text-xs font-medium">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#FAF9F8]/60">Your Listing Price</span>
                    <span className="font-mono font-bold">₦{nightlyRate.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-[#FAF9F8]/60">Platform standard Auditing Fee (15%)</span>
                    <span className="font-mono text-gold-light font-bold">- ₦{(nightlyRate * 0.15).toLocaleString()}</span>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <span className="block text-[9px] tracking-widest text-[#FAF9F8]/40 block mb-1">CLEARED OWNER PROFIT</span>
                    <div className="flex justify-between items-baseline">
                      <span className="font-serif text-3xl text-gold font-bold">₦{calculatedEarnings.toLocaleString()}</span>
                      <span className="text-[#FAF9F8]/50 text-[10px]">/ night</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: REVIEW & LIVE */}
          {step === 4 && (
            <div className="bg-white border border-charcoal/5 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm animate-fade-in-up">
              
              <div className="space-y-3.5 border-b border-charcoal/5 pb-6 text-left">
                <h3 className="font-serif text-2xl font-bold text-charcoal">{propertyName}</h3>
                <p className="text-xs text-charcoal-light flex items-center gap-2">
                  <span className="bg-gold/10 px-2 py-0.5 text-gold-dark rounded font-bold uppercase">{category}</span>
                  <span>&bull;</span>
                  <span>{location} Peninsula</span>
                </p>
                <p className="text-xs text-charcoal-light leading-relaxed max-w-2xl">{description}</p>
              </div>

              {/* Review metrics bento */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-charcoal-light">
                <div className="p-4 bg-parchment/40 rounded-xl">
                  <span className="text-[10px] text-charcoal/40 font-bold tracking-widest block uppercase mb-1">Nightly rate value</span>
                  <span className="text-sm font-serif font-bold text-gold-dark">₦{nightlyRate.toLocaleString()}</span>
                </div>

                <div className="p-4 bg-parchment/40 rounded-xl">
                  <span className="text-[10px] text-charcoal/40 font-bold tracking-widest block uppercase mb-1">Security protection deposit</span>
                  <span className="text-sm font-serif font-bold text-charcoal">₦{securityDeposit.toLocaleString()}</span>
                </div>
              </div>

              {/* Visibility and terms */}
              <div className="space-y-6 pt-4">
                
                <div className="flex justify-between items-center bg-gold/5 p-4 rounded-xl border border-gold/10">
                  <div>
                    <h4 className="text-xs font-bold text-charcoal leading-none">Instant Public Search Visibility</h4>
                    <p className="text-[10px] text-charcoal-light mt-1">Allow travelers to book this stay immediately on the discovery board.</p>
                  </div>
                  <label className="flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                      className="w-4 h-4 cursor-pointer text-gold rounded focus:ring-0 focus:ring-offset-0 border-charcoal/20"
                    />
                  </label>
                </div>

                {/* Accept box T&C */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms(!acceptTerms)}
                    className="w-4 h-4 rounded text-gold border-charcoal/20 focus:ring-0 focus:ring-offset-0 cursor-pointer mt-0.5"
                  />
                  <span className="text-xs text-charcoal-light leading-relaxed font-semibold">
                    I confirm that I hold legitimate ownership credentials or host proxy rights for this property, and completely consent to Cozy Lagos standard luxury hospitality guidelines.
                  </span>
                </label>

              </div>

            </div>
          )}

          {/* BOTTOM STEP CONTROLLERS ACTIONS BAR */}
          <div className="flex justify-between items-center pt-8 border-t border-charcoal/5">
            {step > 1 ? (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="px-6 py-3.5 border border-charcoal/15 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return Back</span>
              </button>
            ) : (
              <button
                onClick={onCancel}
                className="px-6 py-3.5 border border-charcoal/15 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-all"
              >
                Cancel Draft
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(prev => prev + 1)}
                className="px-8 py-3.5 bg-gold hover:bg-charcoal text-charcoal hover:text-parchment font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all flex items-center gap-2"
              >
                <span>Continue Ahead</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalPublish}
                className={`px-10 py-4 font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center gap-2 ${
                  acceptTerms 
                    ? 'bg-charcoal hover:bg-gold-dark text-parchment hover:text-parchment font-bold' 
                    : 'bg-charcoal/30 text-parchment/40 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Publish Listing Live</span>
              </button>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
