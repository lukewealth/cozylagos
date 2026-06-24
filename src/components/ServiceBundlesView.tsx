import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase, Globe, Map, Crown, GraduationCap, Heart, Sparkles,
  ChevronRight, Check, X, Package, Monitor, Plane, Building, Utensils,
  Wifi, Camera, Landmark, Music, Waves, Home,
  Shield, Users, Anchor, Sun,
  Star, Clock, MapPin, Zap, Leaf, ShoppingBag, BookOpen,
  GlassWater, PartyPopper, GraduationCap as SchoolIcon, Activity
} from 'lucide-react';
import { SERVICE_BUNDLES, ServiceBundle, BundleTier, BundleActivity } from '../data';

const ICON_MAP: Record<string, React.ReactNode> = {
  briefcase: <Briefcase className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  map: <Map className="w-5 h-5" />,
  crown: <Crown className="w-5 h-5" />,
  graduation: <GraduationCap className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />
};

const ACTIVITY_ICON_MAP: Record<string, React.ReactNode> = {
  monitor: <Monitor className="w-4 h-4" />,
  plane: <Plane className="w-4 h-4" />,
  building: <Building className="w-4 h-4" />,
  utensils: <Utensils className="w-4 h-4" />,
  wifi: <Wifi className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
  tree: <Leaf className="w-4 h-4" />,
  landmark: <Landmark className="w-4 h-4" />,
  music: <Music className="w-4 h-4" />,
  waves: <Waves className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  home: <Home className="w-4 h-4" />,
  book: <BookOpen className="w-4 h-4" />,
  smile: <PartyPopper className="w-4 h-4" />,
  glass: <GlassWater className="w-4 h-4" />,
  shield: <Shield className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  helicopter: <Plane className="w-4 h-4" />,
  anchor: <Anchor className="w-4 h-4" />,
  school: <SchoolIcon className="w-4 h-4" />,
  sun: <Sun className="w-4 h-4" />,
  activity: <Activity className="w-4 h-4" />,
  star: <Star className="w-4 h-4" />,
  clock: <Clock className="w-4 h-4" />,
  map: <MapPin className="w-4 h-4" />,
  zap: <Zap className="w-4 h-4" />,
  heart: <Heart className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  crown: <Crown className="w-4 h-4" />,
  ring: <Heart className="w-4 h-4" />,
  golf: <Star className="w-4 h-4" />
};

function TierSelector({ tier, isSelected, onClick }: { tier: BundleTier; isSelected: boolean; onClick: () => void }) {
  const tierLabel = tier.nights === 3 ? 'Economy' : tier.nights === 7 ? 'Standard' : 'Premium';
  const tierColor = tier.nights === 3 ? 'border-charcoal/10' : tier.nights === 7 ? 'border-gold/40' : 'border-gold';

  return (
    <button
      onClick={onClick}
      className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left w-full ${
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
      <span className={`text-[8px] sm:text-[9px] font-bold tracking-widest uppercase ${
        tier.nights === 3 ? 'text-charcoal/60' : tier.nights === 7 ? 'text-gold-dark' : 'text-gold'
      }`}>
        {tierLabel}
      </span>
      <div className="font-serif text-base sm:text-lg font-bold text-charcoal mt-1">{tier.duration}</div>
      <div className="font-serif text-lg sm:text-xl font-bold text-gold-dark mt-1">
        ₦{tier.price.toLocaleString()}
      </div>
    </button>
  );
}

function ActivityItem({ activity, index }: { activity: BundleActivity; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 p-3 rounded-xl bg-parchment/50 border border-charcoal/5 hover:bg-gold/5 transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold-dark shrink-0">
        {ACTIVITY_ICON_MAP[activity.icon] || <Star className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold text-charcoal truncate">{activity.name}</span>
          <span className="text-[9px] sm:text-[10px] font-bold text-gold-dark bg-gold/10 px-2 py-0.5 rounded-full whitespace-nowrap">
            {activity.duration}
          </span>
        </div>
        <p className="text-[10px] sm:text-xs text-charcoal/60 mt-0.5 leading-relaxed">{activity.description}</p>
      </div>
    </motion.div>
  );
}

function BundleDetailPanel({ bundle, onClose }: { bundle: ServiceBundle; onClose: () => void }) {
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'breakdown'>('overview');
  const tier = bundle.tiers[selectedTier];

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
        {/* Header */}
        <div className="relative h-40 sm:h-48 overflow-hidden shrink-0">
          <img
            src={bundle.image}
            alt={bundle.title}
            className="w-full h-full object-cover"
          />
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
                {ICON_MAP[bundle.icon]}
              </div>
              <span className="text-gold-light text-[9px] font-bold tracking-[0.3em] uppercase">
                {bundle.tagline}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment">{bundle.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Tier Selector */}
          <div className="p-4 sm:p-6 border-b border-charcoal/5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {bundle.tiers.map((t, i) => (
                <TierSelector
                  key={i}
                  tier={t}
                  isSelected={selectedTier === i}
                  onClick={() => setSelectedTier(i)}
                />
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-charcoal/5 px-4 sm:px-6">
            {(['overview', 'activities', 'breakdown'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-gold text-gold-dark'
                    : 'border-transparent text-charcoal/40 hover:text-charcoal/60'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'activities' ? `Activities (${bundle.activities.length})` : 'Cost Breakdown'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-charcoal/70 leading-relaxed">{bundle.description}</p>
                  <div>
                    <h4 className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3">Package Highlights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {bundle.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gold/5 border border-gold/10">
                          <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                          <span className="text-xs text-charcoal font-medium">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-charcoal text-parchment rounded-2xl p-4 sm:p-6">
                    <span className="text-[9px] font-bold text-gold uppercase tracking-widest block mb-1">Selected Package</span>
                    <div className="flex items-baseline justify-between">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-parchment">
                        ₦{tier.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-parchment/60">{tier.duration}</span>
                    </div>
                    <p className="text-[10px] text-parchment/50 mt-2">
                      {tier.components.length} items included &bull; All-inclusive pricing
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'activities' && (
                <motion.div
                  key="activities"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-charcoal">Included Activities & Experiences</h4>
                    <span className="text-[10px] text-gold-dark font-bold bg-gold/10 px-2 py-1 rounded-full">
                      {bundle.activities.filter(a => a.included).length} included
                    </span>
                  </div>
                  <div className="space-y-2">
                    {bundle.activities.map((activity, i) => (
                      <ActivityItem key={i} activity={activity} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'breakdown' && (
                <motion.div
                  key="breakdown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-4 h-4 text-gold-dark" />
                    <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest">
                      Cost Breakdown — {tier.duration}
                    </span>
                  </div>
                  {tier.components.map((comp, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-charcoal/5 last:border-0">
                      <div className="flex-1">
                        <span className="text-xs sm:text-sm font-semibold text-charcoal block">{comp.name}</span>
                        {comp.notes && (
                          <span className="text-[10px] sm:text-xs text-charcoal/50 font-light">{comp.notes}</span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gold-dark whitespace-nowrap">
                        ₦{comp.cost.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-gold/20">
                    <span className="text-sm font-bold text-charcoal uppercase tracking-wider">Total</span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-gold-dark">
                      ₦{tier.price.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-charcoal/5 bg-white/50 shrink-0">
          <button className="w-full py-3.5 sm:py-4 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
            <span>Book This Package</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BundleCard({ bundle, index, onSelect }: { bundle: ServiceBundle; index: number; onSelect: () => void }) {
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const tier = bundle.tiers[selectedTier];
  const tierLabel = tier.nights === 3 ? 'Economy' : tier.nights === 7 ? 'Standard' : 'Premium';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="bg-parchment border border-charcoal/5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal">
        <img
          src={bundle.image}
          alt={bundle.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/horizontal/CozyLagos.jpeg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
          <div className="bg-parchment/90 backdrop-blur-md p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-gold-dark">
            {ICON_MAP[bundle.icon]}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
          <span className="text-gold-light text-[8px] sm:text-[9px] font-bold tracking-[0.3em] uppercase block mb-0.5 sm:mb-1">
            {bundle.tagline}
          </span>
          <h3 className="font-serif text-lg sm:text-2xl font-bold text-parchment leading-tight">
            {bundle.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <p className="text-[11px] sm:text-xs text-charcoal/70 font-light leading-relaxed mb-4 line-clamp-2">
          {bundle.description}
        </p>

        {/* Highlights chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bundle.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="text-[9px] font-medium text-charcoal/60 bg-charcoal/5 px-2 py-1 rounded-full">
              {h}
            </span>
          ))}
          {bundle.highlights.length > 3 && (
            <span className="text-[9px] font-medium text-gold-dark bg-gold/10 px-2 py-1 rounded-full">
              +{bundle.highlights.length - 3} more
            </span>
          )}
        </div>

        {/* Tier Selector */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {bundle.tiers.map((t, i) => (
            <TierSelector
              key={i}
              tier={t}
              isSelected={selectedTier === i}
              onClick={() => setSelectedTier(i)}
            />
          ))}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-charcoal/5 mt-auto">
          <div>
            <span className="text-[8px] sm:text-[9px] font-bold text-charcoal/40 uppercase tracking-widest block mb-0.5">
              {tierLabel} Package
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-gold-dark">
              {tier.price.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="p-2.5 sm:px-4 sm:py-2.5 border border-charcoal/10 hover:border-charcoal/30 rounded-lg sm:rounded-xl transition-all text-charcoal/60 hover:text-charcoal"
              title="View breakdown"
            >
              <Package className="w-4 h-4" />
            </button>
            <button
              onClick={onSelect}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-[9px] sm:text-[10px] tracking-widest uppercase rounded-lg sm:rounded-xl transition-all active:scale-95"
            >
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Inline Breakdown */}
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-charcoal/5 space-y-2">
                {tier.components.slice(0, 4).map((comp, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-1.5">
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-medium text-charcoal truncate block">{comp.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-gold-dark whitespace-nowrap">
                      ₦{comp.cost.toLocaleString()}
                    </span>
                  </div>
                ))}
                {tier.components.length > 4 && (
                  <p className="text-[10px] text-charcoal/40 text-center pt-1">
                    +{tier.components.length - 4} more items
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-gold/20">
                  <span className="text-xs font-bold text-charcoal">Total</span>
                  <span className="font-serif text-lg font-bold text-gold-dark">
                    {tier.price.toLocaleString()}
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
  const [selectedBundle, setSelectedBundle] = useState<ServiceBundle | null>(null);

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-charcoal">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
            src="/assets/bundles/bundles-hero-background.jpeg"
            alt="Premium bundles"
            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/horizontal/CozyLagos.jpeg'; }}
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
              Premium Service Catalog
            </span>
            <div className="w-8 sm:w-10 h-[1px] bg-gold/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-serif text-3xl sm:text-4xl md:text-6xl xl:text-7xl text-parchment leading-tight tracking-tight max-w-4xl mb-3 sm:mb-4"
          >
            Curated Experience <span className="italic font-light text-gold-light">Bundles</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-sans text-xs sm:text-sm md:text-base text-parchment/70 max-w-2xl font-light leading-relaxed px-2"
          >
            Seamless, exclusive, high-quality. Transparent, itemized breakdown of costs for all Cozy Lagos service bundles.
          </motion.p>
        </div>
      </section>

      {/* Bundle Grid Section */}
      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-gold-dark font-bold text-[9px] sm:text-[10px] tracking-[0.25em] uppercase block mb-2">
            7 Exclusive Bundles
          </span>
          <h2 className="font-serif font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal">
            Choose Your Experience
          </h2>
          <p className="font-sans text-xs sm:text-sm text-charcoal-light mt-2 sm:mt-3 max-w-xl mx-auto px-2">
            Each bundle available in three tiers: Economy (3 Days), Standard (7 Days), and Premium (21 Days).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {SERVICE_BUNDLES.map((bundle, index) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              index={index}
              onSelect={() => setSelectedBundle(bundle)}
            />
          ))}
        </div>

        {/* Price Variations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 sm:mt-16 bg-charcoal text-parchment rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gold-dark/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 sm:w-80 h-64 sm:h-80 bg-gold-dark/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="text-gold uppercase tracking-[0.3em] font-bold text-[9px] sm:text-[10px] block mb-2 sm:mb-3">
              Price Variations
            </span>
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-parchment leading-tight mb-4 sm:mb-6">
              All prices are estimates based on 2026 Lagos market research
            </h3>
            <p className="text-xs sm:text-sm text-parchment/70 font-light leading-relaxed mb-6 sm:mb-8 px-2">
              Actual costs may vary by season, availability, and specific customizations. Contact Cozy Lagos for formal quotations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
              <div className="bg-parchment/5 backdrop-blur-md border border-parchment/10 rounded-xl p-3 sm:p-4">
                <span className="text-gold-light text-[8px] sm:text-[9px] font-bold tracking-widest uppercase block mb-1 sm:mb-2">Economy</span>
                <span className="text-[11px] sm:text-xs text-parchment/80">Lekki Phase 1 / Orchid</span>
                <span className="text-[10px] sm:text-xs text-parchment/60 block mt-1">1-2 BR | ₦120k-₦140k/day</span>
              </div>
              <div className="bg-parchment/5 backdrop-blur-md border border-gold/20 rounded-xl p-3 sm:p-4">
                <span className="text-gold text-[8px] sm:text-[9px] font-bold tracking-widest uppercase block mb-1 sm:mb-2">Standard</span>
                <span className="text-[11px] sm:text-xs text-parchment/80">Lekki Phase 1 / VI</span>
                <span className="text-[10px] sm:text-xs text-parchment/60 block mt-1">2-3 BR | ₦140k-₦200k/day</span>
              </div>
              <div className="bg-parchment/5 backdrop-blur-md border border-gold/40 rounded-xl p-3 sm:p-4">
                <span className="text-gold-light text-[8px] sm:text-[9px] font-bold tracking-widest uppercase block mb-1 sm:mb-2">Premium</span>
                <span className="text-[11px] sm:text-xs text-parchment/80">Victoria Island</span>
                <span className="text-[10px] sm:text-xs text-parchment/60 block mt-1">3+ BR Suite | ₦200k-280k+/day</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedBundle && (
          <BundleDetailPanel
            bundle={selectedBundle}
            onClose={() => setSelectedBundle(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
