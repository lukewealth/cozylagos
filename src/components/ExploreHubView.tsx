import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapIcon, HandRaisedIcon, BriefcaseIcon, CalendarIcon, ArrowRight, Compass, Anchor, Utensils, Music, ShoppingBag, Building2, Waves, Sparkles, Car, Flower2, Baby } from 'lucide-react';

interface ExploreHubViewProps {
  setActiveTab: (tab: string) => void;
}

const exploreCategories = [
  {
    id: 'explore-lagos',
    title: 'Explore Lagos',
    description: 'Discover beaches, museums, art galleries, nightlife, and cultural landmarks',
    icon: Compass,
    color: 'from-emerald-500 to-teal-600',
    items: ['Beaches', 'Museums', 'Art Galleries', 'Nightlife', 'Historical Sites', 'Parks']
  },
  {
    id: 'vip-services',
    title: 'Lagos Assist',
    description: 'Premium concierge services, transportation, wellness, and personalized assistance',
    icon: HandRaisedIcon,
    color: 'from-blue-500 to-indigo-600',
    items: ['Airport Pickup', 'Personal Driver', 'Concierge', 'Spa & Wellness', 'Personal Shopper']
  },
  {
    id: 'business-lagos',
    title: 'Business Lagos',
    description: 'Corporate housing, meeting spaces, executive transportation, and relocation services',
    icon: Building2,
    color: 'from-slate-600 to-gray-700',
    items: ['Corporate Housing', 'Meeting Spaces', 'Executive Transport', 'Co-working', 'Relocation']
  },
  {
    id: 'events',
    title: 'Events',
    description: 'Concerts, festivals, exhibitions, conferences, and weekly happenings in Lagos',
    icon: CalendarIcon,
    color: 'from-rose-500 to-pink-600',
    items: ['Concerts', 'Festivals', 'Exhibitions', 'Conferences', 'Nightlife Events']
  }
];

const featuredExperiences = [
  { title: 'Beach Getaways', icon: Waves, count: 12 },
  { title: 'Fine Dining', icon: Utensils, count: 45 },
  { title: 'Nightlife', icon: Music, count: 28 },
  { title: 'Shopping', icon: ShoppingBag, count: 35 },
  { title: 'Wellness', icon: Flower2, count: 18 },
  { title: 'Family Fun', icon: Baby, count: 22 },
  { title: 'Yacht Charters', icon: Anchor, count: 8 },
  { title: 'Transport', icon: Car, count: 15 }
];

export default function ExploreHubView({ setActiveTab }: ExploreHubViewProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] flex items-center justify-center overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <img
            src="/assets/bundles/bundles-hero-background.jpeg"
            alt="Explore Lagos"
            className="w-full h-full object-cover opacity-30"
            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/horizontal/CozyLagos.jpeg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/90" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-[1px] bg-gold/50" />
            <span className="text-gold-light text-[10px] font-bold tracking-[0.4em] uppercase">
              Discover Lagos
            </span>
            <div className="w-8 h-[1px] bg-gold/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-parchment leading-tight tracking-tight max-w-4xl mb-4"
          >
            Explore <span className="italic font-light text-gold-light">Lagos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-sans text-sm sm:text-base text-parchment/70 max-w-2xl font-light leading-relaxed px-2"
          >
            From pristine beaches to vibrant nightlife, world-class dining to cultural landmarks — experience the best of Lagos through our curated categories.
          </motion.p>
        </div>
      </section>

      {/* Main Categories */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
            Choose Your Experience
          </span>
          <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-charcoal">
            What Would You Like to Explore?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {exploreCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => setActiveTab(category.id)}
                className="group cursor-pointer"
              >
                <div className={`relative bg-gradient-to-br ${category.color} rounded-3xl p-8 sm:p-10 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <ArrowRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                      {category.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/80 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full bg-charcoal/5">
        <div className="text-center mb-12">
          <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
            Popular Categories
          </span>
          <h2 className="font-serif font-semibold text-3xl text-charcoal">
            Featured Experiences
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {featuredExperiences.map((exp, index) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveTab('explore-lagos')}
              >
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-gold-dark" />
                </div>
                <h3 className="font-semibold text-charcoal mb-1">{exp.title}</h3>
                <p className="text-xs text-charcoal/50">{exp.count} options</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="bg-gradient-to-r from-charcoal to-charcoal/90 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
            <h3 className="font-serif text-2xl sm:text-3xl text-parchment mb-4">
              Ready to Experience Lagos?
            </h3>
            <p className="text-parchment/70 mb-8 max-w-xl mx-auto">
              Browse our curated bundles or create your own custom experience with our premium services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveTab('bundles')}
                className="px-8 py-4 bg-gold text-charcoal hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all inline-flex items-center justify-center gap-2"
              >
                <span>View Bundles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('vip-services')}
                className="px-8 py-4 border border-parchment/30 text-parchment hover:bg-parchment/10 font-bold text-xs tracking-widest uppercase rounded-xl transition-all"
              >
                Get Assistance
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
