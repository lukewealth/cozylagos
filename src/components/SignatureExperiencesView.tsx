import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, Star, Clock, MapPin, Sparkles } from 'lucide-react';
import { SIGNATURE_EXPERIENCES, SignatureExperience } from '../data-new-sections';

function ExperienceCard({ experience, index, onSelect }: { experience: SignatureExperience; index: number; onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="bg-parchment border border-charcoal/5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <div className="bg-parchment/90 backdrop-blur-md p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
            <span className="text-2xl">{experience.icon}</span>
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
          <span className="text-gold-light text-[8px] sm:text-[9px] font-bold tracking-[0.3em] uppercase block mb-0.5 sm:mb-1">
            {experience.tagline}
          </span>
          <h3 className="font-serif text-lg sm:text-2xl font-bold text-parchment leading-tight">
            {experience.title}
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <p className="text-[11px] sm:text-xs text-charcoal/70 font-light leading-relaxed mb-4 line-clamp-2">
          {experience.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {experience.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="text-[9px] font-medium text-charcoal/60 bg-charcoal/5 px-2 py-1 rounded-full">
              {h}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-charcoal/5 mt-auto">
          <div>
            <span className="text-[8px] sm:text-[9px] font-bold text-charcoal/40 uppercase tracking-widest block mb-0.5">
              Starting from
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-gold-dark">
              ₦{experience.startingPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-charcoal/50">
              <Clock className="w-3 h-3" />
              <span>{experience.duration}</span>
            </div>
            <button
              onClick={onSelect}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-[9px] sm:text-[10px] tracking-widest uppercase rounded-lg sm:rounded-xl transition-all active:scale-95"
            >
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ExperienceDetailPanel({ experience, onClose }: { experience: SignatureExperience; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-parchment w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="relative h-40 sm:h-48 overflow-hidden shrink-0">
          <img src={experience.image} alt={experience.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-parchment/90 backdrop-blur-md p-2 rounded-lg text-gold-dark">
                <span className="text-xl">{experience.icon}</span>
              </div>
              <span className="text-gold-light text-[9px] font-bold tracking-[0.3em] uppercase">
                {experience.tagline}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment">{experience.title}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <p className="text-sm text-charcoal/70 leading-relaxed mb-6">{experience.description}</p>
          
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3">Experience Highlights</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {experience.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gold/5 border border-gold/10">
                  <Sparkles className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                  <span className="text-xs text-charcoal font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-charcoal text-parchment rounded-2xl p-4 sm:p-6 mb-6">
            <span className="text-[9px] font-bold text-gold uppercase tracking-widest block mb-1">Package Details</span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-parchment">
                ₦{experience.startingPrice.toLocaleString()}
              </span>
              <span className="text-xs text-parchment/60">{experience.duration}</span>
            </div>
            <p className="text-[10px] text-parchment/50 mt-2">
              Customizable to your preferences • All-inclusive pricing
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-charcoal/5 bg-white/50 shrink-0">
          <button className="w-full py-3.5 sm:py-4 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
            <span>Book This Experience</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SignatureExperiencesView() {
  const [selectedExperience, setSelectedExperience] = useState<SignatureExperience | null>(null);

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-charcoal">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
            src="/assets/bundles/bundles-hero-background.jpeg"
            alt="Signature experiences"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/30 to-charcoal/90" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-4 sm:mb-6"
          >
            <div className="w-8 sm:w-10 h-[1px] bg-gold/50" />
            <span className="text-gold-light text-[9px] sm:text-[10px] font-bold tracking-[0.4em] uppercase">
              Curated For You
            </span>
            <div className="w-8 sm:w-10 h-[1px] bg-gold/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-serif text-3xl sm:text-4xl md:text-6xl xl:text-7xl text-parchment leading-tight tracking-tight max-w-4xl mb-3 sm:mb-4"
          >
            Signature <span className="italic font-light text-gold-light">Experiences</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-sans text-xs sm:text-sm md:text-base text-parchment/70 max-w-2xl font-light leading-relaxed px-2"
          >
            Premium curated packages designed for every type of traveler. From romantic getaways to business excellence.
          </motion.p>
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-gold-dark font-bold text-[9px] sm:text-[10px] tracking-[0.25em] uppercase block mb-2">
            8 Signature Experiences
          </span>
          <h2 className="font-serif font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal">
            Choose Your Journey
          </h2>
          <p className="font-sans text-xs sm:text-sm text-charcoal-light mt-2 sm:mt-3 max-w-xl mx-auto px-2">
            Each experience is fully customizable to your preferences and duration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {SIGNATURE_EXPERIENCES.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              index={index}
              onSelect={() => setSelectedExperience(experience)}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedExperience && (
          <ExperienceDetailPanel
            experience={selectedExperience}
            onClose={() => setSelectedExperience(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
