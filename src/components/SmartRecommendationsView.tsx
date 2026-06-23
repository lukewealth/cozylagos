import React from 'react';

const SmartRecommendationsView: React.FC = () => {
  return (
    <div className="min-h-screen bg-parchment">
      <div className="px-4 md:px-container-padding py-stack-lg md:py-section-gap relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-gold-dark" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Concierge Recommendations</span>
          </div>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-charcoal mb-6">Hidden Gems of Lagos</h1>
          <p className="font-body-lg text-body-lg text-charcoal/70 max-w-2xl">Curated exclusively for you, Kunle. Based on your recent preference for contemporary art and intimate dining, I've selected a few off-market experiences you might enjoy this weekend.</p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] -z-0"></div>
      </div>

      <section className="px-4 md:px-container-padding mb-section-gap">
        <div className="flex justify-between items-end pr-4 md:pr-container-padding mb-stack-md">
          <h2 className="font-headline-sm text-headline-sm text-charcoal">Curated for You</h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-charcoal-light hover:border-gold hover:text-gold transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-charcoal-light hover:border-gold hover:text-gold transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 pr-4 md:pr-container-padding hide-scrollbar snap-x snap-mandatory">
          {/* Card 1 */}
          <div className="min-w-[300px] md:min-w-[400px] w-[80vw] md:w-[400px] snap-center shrink-0 group cursor-pointer">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-4 shadow-lg">
              <img 
                alt="Private Gallery" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold"></span>
                <span className="font-label-caps text-label-caps text-charcoal uppercase text-[10px] font-bold">Private Gallery Access</span>
              </div>
            </div>
            <div className="glass-white p-6 rounded-2xl -mt-20 relative z-10 mx-4 shadow-xl">
              <h3 className="font-headline-md text-[24px] text-charcoal mb-2">Nike Art Gallery: After Hours</h3>
              <p className="font-body-md text-sm text-charcoal/70 mb-4 line-clamp-2">A private, guided tour of the new contemporary wing, accompanied by champagne and a meet-and-greet with the curator.</p>
              <div className="flex items-start gap-3 bg-charcoal/5 p-3 rounded-lg">
                <span className="material-symbols-outlined text-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <p className="font-body-md text-sm text-charcoal/60 italic">"Since you enjoy contemporary art, this exclusive access avoids the crowds."</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="min-w-[300px] md:min-w-[400px] w-[80vw] md:w-[400px] snap-center shrink-0 group cursor-pointer">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-4 shadow-lg">
              <img 
                alt="Secret Dining" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                src="https://images.unsplash.com/photo-1550966842-28aa1299074b?q=80&w=1000&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold"></span>
                <span className="font-label-caps text-label-caps text-charcoal uppercase text-[10px] font-bold">Secret Dining</span>
              </div>
            </div>
            <div className="glass-white p-6 rounded-2xl -mt-20 relative z-10 mx-4 shadow-xl">
              <h3 className="font-headline-md text-[24px] text-charcoal mb-2">Chef Tolu's Test Kitchen</h3>
              <p className="font-body-md text-sm text-charcoal/70 mb-4 line-clamp-2">An unlisted 8-course tasting menu hosted in a restored colonial-era townhouse in Ikoyi.</p>
              <div className="flex items-start gap-3 bg-charcoal/5 p-3 rounded-lg">
                <span className="material-symbols-outlined text-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <p className="font-body-md text-sm text-charcoal/60 italic">"I noticed you prefer intimate dining settings. This aligns perfectly."</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SmartRecommendationsView;
