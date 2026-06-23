import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Scissors, ShoppingBag, Trophy, Dumbbell, Shirt, ChefHat,
  Camera, MapPin, Star, Clock, Check, X, ShoppingCart, Crown, Award,
  ChevronRight, Filter, Search, SlidersHorizontal, Grid3X3, List
} from 'lucide-react';
import { VIP_SERVICES, VIPService, getAllVIPServices } from '../data/vipServices';
import { useCart } from '../context/CartContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const iconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles className="w-5 h-5" />,
  scissors: <Scissors className="w-5 h-5" />,
  'shopping-bag': <ShoppingBag className="w-5 h-5" />,
  trophy: <Trophy className="w-5 h-5" />,
  dumbbell: <Dumbbell className="w-5 h-5" />,
  shirt: <Shirt className="w-5 h-5" />,
  'chef-hat': <ChefHat className="w-5 h-5" />,
  camera: <Camera className="w-5 h-5" />
};

function ServiceCard({ service, onSelect, viewMode }: { service: VIPService; onSelect: (s: VIPService) => void; viewMode: 'grid' | 'list' }) {
  const { addServiceToCart } = useCart();
  const categoryGradients: Record<string, string> = {
    spa: 'from-teal-500 via-emerald-400 to-green-400',
    barber: 'from-amber-700 via-yellow-600 to-orange-500',
    shopping: 'from-pink-600 via-rose-500 to-red-400',
    sports: 'from-blue-600 via-cyan-500 to-teal-400',
    gym: 'from-red-600 via-rose-500 to-pink-500',
    laundry: 'from-indigo-600 via-blue-500 to-cyan-400',
    chef: 'from-orange-600 via-red-500 to-rose-500',
    photography: 'from-violet-600 via-purple-500 to-fuchsia-500'
  };
  const gradient = categoryGradients[service.category] || 'from-gray-500 to-gray-600';

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={staggerItem}
        whileHover={{ x: 4 }}
        onClick={() => onSelect(service)}
        className="group cursor-pointer"
      >
        <div className="bg-white rounded-xl overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex">
          <div className={`w-32 sm:w-40 bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
            <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
              {iconMap[service.category] || <Sparkles className="w-8 h-8" />}
            </div>
          </div>
          <div className="flex-1 p-4 sm:p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-charcoal group-hover:text-gold-dark transition-colors truncate">
                  {service.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-charcoal/40" />
                    <span className="text-[10px] text-charcoal/50">{service.location}</span>
                  </div>
                  {service.duration && (
                    <>
                      <span className="text-charcoal/20">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-charcoal/40" />
                        <span className="text-[10px] text-charcoal/50">{service.duration}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                <span className="text-xs font-bold text-charcoal/70">{service.rating}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed line-clamp-2 mb-3">
              {service.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gold-dark">
                ₦{service.price.toLocaleString()} <span className="text-[9px] text-charcoal/40 font-normal">/ {service.priceUnit.replace('per_', '')}</span>
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); addServiceToCart({ id: service.id, title: service.title, category: service.category, price: service.price, providerName: service.providerName, image: service.image }); }}
                className="text-xs font-semibold text-gold-dark hover:text-charcoal transition-colors flex items-center gap-1"
              >
                <ShoppingCart className="w-3 h-3" />
                Add
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onSelect(service)}
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-xl transition-shadow duration-500">
        <div className={`relative h-44 sm:h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
          <div className="text-white/90 group-hover:scale-110 transition-transform duration-500">
            {iconMap[service.category] || <Sparkles className="w-10 h-10" />}
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-wide">
              ₦{service.price.toLocaleString()}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-semibold tracking-wide">{service.location}</span>
          </div>
          {service.verified && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-bold text-white flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> Verified
              </span>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-charcoal group-hover:text-gold-dark transition-colors">
              {service.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
              <span className="text-xs font-bold text-charcoal/70">{service.rating}</span>
            </div>
          </div>
          <p className="text-[10px] text-charcoal/40 mb-1">{service.providerName}</p>
          <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed line-clamp-2 mb-3">
            {service.description}
          </p>
          {service.duration && (
            <div className="flex items-center gap-1 text-[10px] text-charcoal/40 mb-3">
              <Clock className="w-3 h-3" />
              <span>{service.duration}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-charcoal/5">
            <span className="text-sm font-bold text-gold-dark">
              ₦{service.price.toLocaleString()}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); addServiceToCart({ id: service.id, title: service.title, category: service.category, price: service.price, providerName: service.providerName, image: service.image }); }}
              className="text-xs font-semibold text-gold-dark hover:text-charcoal transition-colors flex items-center gap-1"
            >
              <ShoppingCart className="w-3 h-3" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ServiceDetailPanel({ service, onClose }: { service: VIPService; onClose: () => void }) {
  const { addServiceToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-parchment h-full overflow-y-auto shadow-2xl"
      >
        <div className={`relative h-64 bg-gradient-to-br from-gold/30 via-gold-dark/20 to-charcoal/10 flex items-center justify-center`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-white/90 scale-150">
            {iconMap[service.category] || <Sparkles className="w-12 h-12" />}
          </div>
          {service.verified && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                <Check className="w-3 h-3" /> Verified Provider
              </span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">{service.title}</h2>
            <p className="text-sm text-gold-dark font-semibold mb-2">{service.providerName}</p>
            <div className="flex items-center gap-3 text-sm text-charcoal/60">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{service.location}</span>
              </div>
              {service.duration && (
                <>
                  <span className="text-charcoal/20">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                </>
              )}
              <span className="text-charcoal/20">•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span className="font-semibold">{service.rating} ({service.reviewsCount})</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-3">About</h3>
            <p className="text-sm text-charcoal/70 leading-relaxed">{service.description}</p>
          </div>

          {service.amenities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-3">What's Included</h3>
              <div className="space-y-2">
                {service.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-charcoal/5">
                    <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold-dark shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-charcoal font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-charcoal/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal/60">Price</span>
              <span className="text-2xl font-serif font-bold text-gold-dark">
                ₦{service.price.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-charcoal/60 uppercase tracking-widest">Quantity:</span>
              <div className="flex items-center gap-2 bg-white border border-charcoal/10 rounded-xl px-3 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 h-6 flex items-center justify-center text-charcoal/40 hover:text-charcoal">-</button>
                <span className="text-sm font-bold text-charcoal w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-6 h-6 flex items-center justify-center text-charcoal/40 hover:text-charcoal">+</button>
              </div>
            </div>

            <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addServiceToCart({ id: service.id, title: service.title, category: service.category, price: service.price, providerName: service.providerName, image: service.image });
                }
                onClose();
              }}
              className="w-full py-3.5 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart — ₦{(service.price * quantity).toLocaleString()}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VIPServicesView() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedService, setSelectedService] = useState<VIPService | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = searchQuery
    ? getAllVIPServices().filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory === 'all'
      ? getAllVIPServices()
      : VIP_SERVICES.find(c => c.id === activeCategory)?.services || [];

  return (
    <div className="flex-grow bg-parchment text-left">
      <section className="relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-gold/20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-[1px] bg-gold" />
              <span className="text-gold font-bold text-[10px] tracking-[0.25em] uppercase">
                Private VIP Guest Services
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-[1.05] tracking-tight">
              VIP{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">
                Services
              </span>
            </h1>
            <p className="font-sans text-sm sm:text-base md:text-lg text-white/60 font-light max-w-xl mt-5 leading-relaxed">
              Curated premium services for the distinguished guest. From spa treatments to personal chefs, experience Lagos in ultimate luxury.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-white/40">
                <Crown className="w-4 h-4" />
                <span className="text-xs font-medium">Verified Providers</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/40">
                <Award className="w-4 h-4" />
                <span className="text-xs font-medium">Premium Quality</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/40">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium">8 Categories</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-20 z-40 bg-parchment/90 backdrop-blur-xl border-b border-charcoal/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20">
          <div className="flex items-center justify-between py-3 sm:py-4 gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-charcoal/10 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${
                  activeCategory === 'all' && !searchQuery
                    ? 'bg-charcoal text-white shadow-lg shadow-charcoal/20'
                    : 'bg-white/70 text-charcoal/60 hover:bg-white hover:text-charcoal border border-charcoal/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">All Services</span>
                <span className="sm:hidden">All</span>
              </button>
              {VIP_SERVICES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${
                    activeCategory === cat.id && !searchQuery
                      ? 'bg-charcoal text-white shadow-lg shadow-charcoal/20'
                      : 'bg-white/70 text-charcoal/60 hover:bg-white hover:text-charcoal border border-charcoal/5'
                  }`}
                >
                  {iconMap[cat.icon]}
                  <span className="hidden sm:inline">{cat.title}</span>
                  <span className="sm:hidden">{cat.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-charcoal text-white' : 'bg-white/70 text-charcoal/60 hover:bg-white'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-charcoal text-white' : 'bg-white/70 text-charcoal/60 hover:bg-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-10 sm:py-14 md:py-20">
        {searchQuery ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-2">
              Search Results
            </h2>
            <p className="text-sm text-charcoal/50 mb-8">
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found for "{searchQuery}"
            </p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                : 'space-y-3'
              }
            >
              {filteredServices.map((service, i) => (
                <ServiceCard key={service.id} service={service} onSelect={setSelectedService} viewMode={viewMode} />
              ))}
            </motion.div>
            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <p className="text-charcoal/40 text-lg">No services found matching your search.</p>
              </div>
            )}
          </motion.div>
        ) : activeCategory === 'all' ? (
          VIP_SERVICES.map((category) => (
            <motion.section
              key={category.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="mb-16 sm:mb-20 last:mb-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark">
                  {iconMap[category.icon]}
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-charcoal">
                    {category.title}
                  </h2>
                </div>
              </div>
              <p className="text-sm sm:text-base text-charcoal/50 mb-6 sm:mb-8 max-w-2xl">
                {category.description}
              </p>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                  : 'space-y-3'
                }
              >
                {category.services.map((service, i) => (
                  <ServiceCard key={service.id} service={service} onSelect={setSelectedService} viewMode={viewMode} />
                ))}
              </motion.div>
            </motion.section>
          ))
        ) : (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            {(() => {
              const category = VIP_SERVICES.find(c => c.id === activeCategory);
              if (!category) return null;
              return (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark">
                      {iconMap[category.icon]}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                      {category.title}
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-charcoal/50 mb-8 max-w-2xl">
                    {category.description}
                  </p>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className={viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                      : 'space-y-3'
                    }
                  >
                    {category.services.map((service, i) => (
                      <ServiceCard key={service.id} service={service} onSelect={setSelectedService} viewMode={viewMode} />
                    ))}
                  </motion.div>
                </>
              );
            })()}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedService && (
          <ServiceDetailPanel service={selectedService} onClose={() => setSelectedService(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
