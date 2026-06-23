import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Globe, Map, Crown, GraduationCap, Heart, Sparkles, ChevronRight, Check, X, Package } from 'lucide-react';
import { SERVICE_BUNDLES, ServiceBundle, BundleTier } from '../data';

const ICON_MAP: Record<string, React.ReactNode> = {
  briefcase: <Briefcase className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  map: <Map className="w-5 h-5" />,
  crown: <Crown className="w-5 h-5" />,
  graduation: <GraduationCap className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />
};

function TierCard({ tier, isSelected, onClick }: { tier: BundleTier; isSelected: boolean; onClick: () => void; key?: number }) {
  const tierLabel = tier.nights === 3 ? 'Economy' : tier.nights === 7 ? 'Standard' : 'Premium';
  const tierColor = tier.nights === 3 ? 'border-charcoal/10' : tier.nights === 7 ? 'border-gold/40' : 'border-gold';

  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
        isSelected
          ? `${tierColor} bg-gold/5 shadow-lg`
          : 'border-charcoal/5 hover:border-charcoal/20 hover:shadow-md'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-charcoal" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[9px] font-bold tracking-widest uppercase ${
          tier.nights === 3 ? 'text-charcoal/60' : tier.nights === 7 ? 'text-gold-dark' : 'text-gold'
        }`}>
          {tierLabel}
        </span>
      </div>
      <div className="font-serif text-lg font-bold text-charcoal">{tier.duration}</div>
      <div className="font-serif text-xl font-bold text-gold-dark mt-1">
        ₦{tier.price.toLocaleString()}
      </div>
    </button>
  );
}

function BundleCard({ bundle, index, key }: { bundle: ServiceBundle; index: number; key?: string }) {
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [showDetails, setShowDetails] = useState(false);

  const tier = bundle.tiers[selectedTier];
  const tierLabel = tier.nights === 3 ? 'Economy' : tier.nights === 7 ? 'Standard' : 'Premium';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-parchment border border-charcoal/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal">
        <img
          src={bundle.image}
          alt={bundle.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/horizontal/CozyLagos.jpeg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="bg-parchment/90 backdrop-blur-md p-2.5 rounded-xl text-gold-dark">
            {ICON_MAP[bundle.icon]}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-gold-light text-[9px] font-bold tracking-[0.3em] uppercase block mb-1">
            {bundle.tagline}
          </span>
          <h3 className="font-serif text-2xl font-bold text-parchment">
            {bundle.title}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs text-charcoal/70 font-light leading-relaxed mb-6">
          {bundle.description}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {bundle.tiers.map((t, i) => (
            <TierCard
              key={i}
              tier={t}
              isSelected={selectedTier === i}
              onClick={() => setSelectedTier(i)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
          <div>
            <span className="text-[9px] font-bold text-charcoal/40 uppercase tracking-widest block mb-0.5">
              {tierLabel} Package
            </span>
            <span className="font-serif text-2xl font-bold text-gold-dark">
              ₦{tier.price.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-5 py-3 bg-charcoal text-parchment hover:bg-gold-dark hover:text-parchment font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all duration-300 active:scale-95"
          >
            <span>{showDetails ? 'Hide' : 'View'} Breakdown</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-charcoal/5 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-gold-dark" />
                  <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest">
                    Cost Breakdown
                  </span>
                </div>
                {tier.components.map((comp, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-2 border-b border-charcoal/5 last:border-0">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-charcoal block">{comp.name}</span>
                      {comp.notes && (
                        <span className="text-[10px] text-charcoal/50 font-light">{comp.notes}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-gold-dark whitespace-nowrap">
                      ₦{comp.cost.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-gold/20">
                  <span className="text-sm font-bold text-charcoal uppercase tracking-wider">Total</span>
                  <span className="font-serif text-xl font-bold text-gold-dark">
                    ₦{tier.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ServiceBundlesView() {
  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-charcoal">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
            src="/assets/images/horizontal/Premium bondle.jpg"
            alt="Premium bundles"
            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/horizontal/CozyLagos.jpeg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/30 to-charcoal/90" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-[1px] bg-gold/50" />
            <span className="text-gold-light text-[10px] font-bold tracking-[0.4em] uppercase">
              Premium Service Catalog
            </span>
            <div className="w-10 h-[1px] bg-gold/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-serif text-4xl md:text-6xl xl:text-7xl text-parchment leading-tight tracking-tight max-w-4xl mb-4"
          >
            Curated Experience <span className="italic font-light text-gold-light">Bundles</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-sans text-sm md:text-base text-parchment/70 max-w-2xl font-light leading-relaxed"
          >
            Seamless, exclusive, high-quality. Transparent, itemized breakdown of costs for all Cozy Lagos service bundles, benchmarked against the 2026 Lagos luxury market.
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
            7 Exclusive Bundles
          </span>
          <h2 className="font-serif font-semibold text-3xl md:text-4xl text-charcoal">
            Choose Your Experience
          </h2>
          <p className="font-sans text-sm text-charcoal-light mt-3 max-w-xl mx-auto">
            Each bundle available in three tiers: Economy (3 Days), Standard (7 Days), and Premium (21 Days).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICE_BUNDLES.map((bundle, index) => (
            <BundleCard key={bundle.id} bundle={bundle} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-charcoal text-parchment rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-dark/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gold-dark/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="text-gold uppercase tracking-[0.3em] font-bold text-[10px] block mb-3">
              Price Variations
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-parchment leading-tight mb-6">
              All prices are estimates based on 2026 Lagos market research
            </h3>
            <p className="text-sm text-parchment/70 font-light leading-relaxed mb-8">
              Actual costs may vary by season, availability, and specific customizations. Contact Cozy Lagos for formal quotations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-parchment/5 backdrop-blur-md border border-parchment/10 rounded-xl p-4">
                <span className="text-gold-light text-[9px] font-bold tracking-widest uppercase block mb-2">Economy</span>
                <span className="text-xs text-parchment/80">Lekki Phase 1 / Orchid</span>
                <span className="text-xs text-parchment/60 block mt-1">1-2 BR | ₦120k-₦140k/day</span>
              </div>
              <div className="bg-parchment/5 backdrop-blur-md border border-gold/20 rounded-xl p-4">
                <span className="text-gold text-[9px] font-bold tracking-widest uppercase block mb-2">Standard</span>
                <span className="text-xs text-parchment/80">Lekki Phase 1 / VI</span>
                <span className="text-xs text-parchment/60 block mt-1">2-3 BR | ₦140k-₦200k/day</span>
              </div>
              <div className="bg-parchment/5 backdrop-blur-md border border-gold/40 rounded-xl p-4">
                <span className="text-gold-light text-[9px] font-bold tracking-widest uppercase block mb-2">Premium</span>
                <span className="text-xs text-parchment/80">Victoria Island</span>
                <span className="text-xs text-parchment/60 block mt-1">3+ BR Suite | ₦200k-₦280k+/day</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
