import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Star, Clock, Waves, TreePine, Building2, Palette, Landmark,
  UtensilsCrossed, Music, ShoppingBag, Compass, Car, Sparkles, Crown,
  Search, X, ArrowRight, Sun, Wine, Gem, Drum, Gift, ChefHat, Sailboat
} from 'lucide-react';

interface ExploreItem {
  id: string;
  title: string;
  description: string;
  location: string;
  rating: number;
  price: string;
  icon: React.ReactNode;
  duration?: string;
  highlights?: string[];
  image?: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  items: ExploreItem[];
}

const categories: Category[] = [
  {
    id: 'beaches-nature',
    title: 'Beaches & Nature',
    description: 'Discover Lagos\' stunning coastline and green spaces',
    icon: <Waves className="w-6 h-6" />,
    gradient: 'from-cyan-500 via-blue-500 to-teal-500',
    items: [
      { id: 'b1', title: 'Tarkwa Bay Beach', description: 'Secluded beach accessible only by boat — golden sands and clear waters.', location: 'Tarkwa Bay', rating: 4.6, price: '₦5,000', icon: <Waves className="w-6 h-6" />, duration: 'Full day', highlights: ['Boat access', 'Water sports', 'Swimming'] },
      { id: 'b2', title: 'Elegushi Royal Beach', description: 'The quintessential Lagos beach with live music and VIP areas.', location: 'Lekki Phase 1', rating: 4.5, price: '₦10,000', icon: <Sun className="w-6 h-6" />, duration: 'Full day', highlights: ['Live music', 'VIP sections', 'Food vendors'] },
      { id: 'b3', title: 'Landmark Beach', description: 'Premium beach club with luxury amenities and restaurants.', location: 'Victoria Island', rating: 4.7, price: '₦15,000', icon: <Crown className="w-6 h-6" />, duration: 'Full day', highlights: ['Luxury amenities', 'Restaurants', 'Beach club'] },
      { id: 'p1', title: 'Lekki Conservation Centre', description: 'Famous canopy walkway and nature trails through Lagos biodiversity.', location: 'Lekki', rating: 4.7, price: '₦5,000', icon: <TreePine className="w-6 h-6" />, duration: '3-4 hours', highlights: ['Canopy walkway', 'Nature trails', 'Wildlife'] },
      { id: 'p2', title: 'LUFASI Nature Park', description: 'Serene nature reserve with hiking trails and peaceful picnic spots.', location: 'Lekki-Epe Expressway', rating: 4.5, price: '₦3,000', icon: <TreePine className="w-6 h-6" />, duration: '2-3 hours', highlights: ['Hiking trails', 'Wildlife', 'Picnics'] },
    ]
  },
  {
    id: 'culture-history',
    title: 'Culture & History',
    description: 'Explore Nigeria\'s rich heritage through museums, galleries, and landmarks',
    icon: <Building2 className="w-6 h-6" />,
    gradient: 'from-amber-600 via-orange-500 to-red-500',
    items: [
      { id: 'm1', title: 'National Museum Lagos', description: 'Nigeria\'s premier museum with ancient Nok terracottas and Benin bronzes.', location: 'Onikan, Lagos Island', rating: 4.3, price: '₦2,000', icon: <Building2 className="w-6 h-6" />, duration: '2-3 hours', highlights: ['Historical artifacts', 'Cultural exhibits', 'Guided tours'] },
      { id: 'm2', title: 'Kalakuta Republic Museum', description: 'The legendary former home of Fela Kuti — celebrating Africa\'s rebel icon.', location: 'Ikeja', rating: 4.4, price: '₦1,500', icon: <Drum className="w-6 h-6" />, duration: '1-2 hours', highlights: ['Music history', 'Memorabilia', 'Cultural significance'] },
      { id: 'g1', title: 'Nike Art Gallery', description: 'West Africa\'s largest art gallery with over 7,000 works.', location: 'Lekki Phase 1', rating: 4.8, price: 'Free', icon: <Palette className="w-6 h-6" />, duration: '2-3 hours', highlights: ['7,000+ artworks', 'Guided tours', 'Art workshops'] },
      { id: 'h1', title: 'Freedom Park', description: 'Former colonial prison transformed into a vibrant cultural hub.', location: 'Lagos Island', rating: 4.6, price: '₦3,000', icon: <Landmark className="w-6 h-6" />, duration: '2-4 hours', highlights: ['Historical tours', 'Live performances', 'Art exhibitions'] },
      { id: 'g2', title: 'Yemisi Shyllon Museum', description: 'One of Nigeria\'s most important modern art museums.', location: 'Pan-Atlantic University', rating: 4.7, price: 'Free', icon: <Gem className="w-6 h-6" />, duration: '2-3 hours', highlights: ['Modern art', 'Private collection', 'Educational'] },
    ]
  },
  {
    id: 'food-nightlife',
    title: 'Food & Nightlife',
    description: 'Savor Lagos flavors and experience the electric after-dark scene',
    icon: <UtensilsCrossed className="w-6 h-6" />,
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    items: [
      { id: 'f1', title: 'RSVP Restaurant', description: 'Multi-level fine dining with panoramic Lagos skyline views.', location: 'Victoria Island', rating: 4.9, price: '₦₦₦', icon: <Wine className="w-6 h-6" />, duration: '2-3 hours', highlights: ['Skyline views', 'Wine pairing', 'Rooftop'] },
      { id: 'f2', title: 'Cilantro Lagos', description: 'Award-winning contemporary African cuisine with modern flair.', location: 'Victoria Island', rating: 4.9, price: '₦₦₦₦', icon: <ChefHat className="w-6 h-6" />, duration: '2-3 hours', highlights: ['Award-winning', 'Contemporary African', 'Fine dining'] },
      { id: 'f3', title: 'Izanagi Restaurant', description: 'Premium Japanese dining with authentic sushi and teppanyaki.', location: 'Victoria Island', rating: 4.8, price: '₦₦₦', icon: <UtensilsCrossed className="w-6 h-6" />, duration: '2-3 hours', highlights: ['Japanese cuisine', 'Sushi bar', 'Teppanyaki'] },
      { id: 'n1', title: 'Quilox Nightclub', description: 'Lagos\'s most exclusive nightclub with world-class DJs.', location: 'Victoria Island', rating: 4.7, price: '₦₦₦', icon: <Music className="w-6 h-6" />, duration: '4-6 hours', highlights: ['VIP tables', 'World-class DJs', 'Exclusive'] },
      { id: 'n2', title: 'Cubana Bar', description: 'Open-air luxury lounge with infinity pool and Afrobeats DJs.', location: 'Lekki Phase 1', rating: 4.8, price: '₦₦₦', icon: <Wine className="w-6 h-6" />, duration: '3-5 hours', highlights: ['Infinity pool', 'Afrobeats', 'Luxury lounge'] },
      { id: 'n3', title: 'New Afrika Shrine', description: 'The spiritual home of Afrobeat culture and Fela\'s legacy.', location: 'Ikeja', rating: 4.6, price: '₦₦', icon: <Drum className="w-6 h-6" />, duration: '3-4 hours', highlights: ['Live Afrobeat', 'Cultural venue', 'Historic'] },
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping & Fashion',
    description: 'From luxury boutiques to vibrant markets — Africa\'s fashion capital',
    icon: <ShoppingBag className="w-6 h-6" />,
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    items: [
      { id: 's1', title: 'Alara Lagos', description: 'Curated luxury concept store with African and international designers.', location: 'Victoria Island', rating: 4.8, price: '₦₦₦', icon: <Gem className="w-6 h-6" />, duration: '2-3 hours', highlights: ['Luxury fashion', 'African designers', 'Premium brands'] },
      { id: 's2', title: 'Ikeja City Mall', description: 'Lagos\'s largest mall with 150+ stores, cinema, and international brands.', location: 'Ikeja', rating: 4.5, price: 'Free Entry', icon: <ShoppingBag className="w-6 h-6" />, duration: '3-5 hours', highlights: ['150+ stores', 'Cinema', 'International brands'] },
      { id: 's3', title: 'Balogun Market', description: 'Lagos\'s largest market — fabrics, fashion, and authentic bargaining.', location: 'Lagos Island', rating: 4.3, price: '₦', icon: <ShoppingBag className="w-6 h-6" />, duration: '2-4 hours', highlights: ['Local market', 'Fabrics', 'Authentic experience'] },
      { id: 's4', title: 'Lekki Arts & Crafts Market', description: 'Handcrafted souvenirs and bespoke jewelry from local artisans.', location: 'Lekki Phase 1', rating: 4.4, price: '₦', icon: <Gift className="w-6 h-6" />, duration: '2-3 hours', highlights: ['Handcrafted', 'Souvenirs', 'Local artisans'] },
      { id: 's5', title: 'Nigerian Designers', description: 'Shop from top designers — Lisa Folawiyo, Deola Sagoe, Mai Atafo.', location: 'Various Boutiques', rating: 4.7, price: '₦₦₦', icon: <Crown className="w-6 h-6" />, duration: '2-4 hours', highlights: ['Top designers', 'Bespoke', 'Custom tailoring'] },
    ]
  },
  {
    id: 'tours',
    title: 'Tours & Experiences',
    description: 'Curated journeys through Lagos with insider access',
    icon: <Compass className="w-6 h-6" />,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    items: [
      { id: 't1', title: 'Lagos Island Heritage Walk', description: 'Guided walking tour through the historical heart of Lagos.', location: 'Lagos Island', rating: 4.8, price: '₦15,000', icon: <Compass className="w-6 h-6" />, duration: '3 hours', highlights: ['Expert guides', 'Historical sites', 'Cultural insights'] },
      { id: 't2', title: 'Lekki Lagoon Sunset Cruise', description: 'Sunset cruise with champagne, canapés, and skyline views.', location: 'Lekki', rating: 4.9, price: '₦85,000', icon: <Sailboat className="w-6 h-6" />, duration: '3 hours', highlights: ['Sunset cruise', 'Champagne', 'Skyline views'] },
      { id: 't3', title: 'Private Yacht Experience', description: 'Luxury yacht charter with crew, catering, and waterway exploration.', location: 'Victoria Island', rating: 4.9, price: '₦500,000', icon: <Sailboat className="w-6 h-6" />, duration: '4-6 hours', highlights: ['Private yacht', 'Crew service', 'Catering'] },
      { id: 't4', title: 'Lagos Food Tour', description: 'Gastronomic adventure — taste 10+ local dishes with a foodie guide.', location: 'Surulere & Yaba', rating: 4.7, price: '₦25,000', icon: <ChefHat className="w-6 h-6" />, duration: '4 hours', highlights: ['10+ dishes', 'Local guide', 'Food adventure'] },
      { id: 't5', title: 'Corporate Lagos Experience', description: 'Tailored tour for business visitors — innovation hubs and networking.', location: 'VI & Ikoyi', rating: 4.7, price: '₦50,000', icon: <Car className="w-6 h-6" />, duration: '4 hours', highlights: ['Business districts', 'Innovation hubs', 'Networking'] },
    ]
  },
];

export default function ExploreLagosView({ onNavigateBundles }: { onNavigateBundles: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ExploreItem | null>(null);

  const filteredCategories = activeCategory
    ? categories.filter(cat => cat.id === activeCategory)
    : categories;

  const allItems = filteredCategories.flatMap(cat => cat.items);

  const searchedItems = searchQuery
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const displayItems = searchedItems ?? (activeCategory ? allItems : null);

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-charcoal">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover opacity-35 select-none pointer-events-none"
            src="/assets/images/horizontal/CozyLagos.jpeg"
            alt="Explore Lagos"
            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/bundles/bundles-hero-background.jpeg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/20 to-charcoal/80" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-10 h-[1px] bg-gold/40" />
            <span className="text-gold-light text-[10px] font-bold tracking-[0.4em] uppercase">
              Discover Lagos
            </span>
            <div className="w-10 h-[1px] bg-gold/40" />
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
            className="font-sans text-sm sm:text-base md:text-lg text-parchment/70 max-w-2xl font-light leading-relaxed px-4"
          >
            From pristine beaches to vibrant nightlife, world-class dining to cultural landmarks — experience the best of Lagos.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 w-full max-w-xl"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search beaches, restaurants, attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-4 bg-white/95 backdrop-blur-xl rounded-full text-sm sm:text-base text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-2xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-charcoal/5 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-charcoal/40" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-20 z-30 bg-parchment/95 backdrop-blur-xl border-b border-charcoal/5 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeCategory === null
                  ? 'bg-charcoal text-parchment shadow-lg'
                  : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>All</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-charcoal text-parchment shadow-lg'
                    : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
                }`}
              >
                {cat.icon}
                <span>{cat.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        {searchQuery && searchedItems ? (
          <div>
            <div className="mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                Search Results
              </h2>
              <p className="text-sm text-charcoal/60 mt-2">
                {searchedItems.length} result{searchedItems.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchedItems.map((item, index) => (
                <ExperienceCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
            {searchedItems.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-charcoal/30" />
                </div>
                <p className="text-lg font-semibold text-charcoal mb-2">No results found</p>
                <p className="text-sm text-charcoal/50">Try adjusting your search or browse categories</p>
              </div>
            )}
          </div>
        ) : activeCategory ? (
          <div>
            <div className="mb-10">
              <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
                {filteredCategories[0]?.items.length} Experiences
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
                {filteredCategories[0]?.title}
              </h2>
              <p className="text-sm sm:text-base text-charcoal/60 mt-2 max-w-2xl">
                {filteredCategories[0]?.description}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allItems.map((item, index) => (
                <ExperienceCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg`}>
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                        {category.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-charcoal/50 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className="hidden sm:flex items-center gap-2 text-gold-dark hover:text-charcoal font-bold text-xs tracking-wider uppercase transition-colors group"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.slice(0, 3).map((item, index) => (
                    <ExperienceCard
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className="sm:hidden mt-6 w-full py-3 bg-charcoal/5 hover:bg-charcoal/10 rounded-xl text-xs font-bold uppercase tracking-wider text-charcoal transition-colors flex items-center justify-center gap-2"
                >
                  <span>View All {category.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ExperienceCard({ item, index, onClick }: { item: ExploreItem; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
        <div className="relative h-48 bg-gradient-to-br from-charcoal/80 to-charcoal/60 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/30 group-hover:scale-110 transition-transform duration-500">
              {React.cloneElement(item.icon as React.ReactElement, { className: 'w-16 h-16' })}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-serif text-xl font-bold text-white mb-1">{item.title}</h3>
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3 text-gold fill-current" />
              <span className="text-xs font-bold text-white">{item.rating}</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-charcoal/60 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gold-dark">{item.price}</span>
            {item.duration && (
              <div className="flex items-center gap-1 text-xs text-charcoal/50">
                <Clock className="w-3 h-3" />
                <span>{item.duration}</span>
              </div>
            )}
          </div>
          {item.highlights && item.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-charcoal/5">
              {item.highlights.slice(0, 3).map((h, i) => (
                <span key={i} className="text-[10px] font-medium text-charcoal/50 bg-charcoal/5 px-2.5 py-1 rounded-full">
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ItemDetailModal({ item, onClose }: { item: ExploreItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-parchment rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="relative h-56 bg-gradient-to-br from-charcoal/80 to-charcoal/60 flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-white/40 scale-150">
            {React.cloneElement(item.icon as React.ReactElement, { className: 'w-20 h-20' })}
          </div>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="font-serif text-2xl font-bold text-white mb-1">{item.title}</h2>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 text-gold fill-current" />
              <span className="text-lg font-bold text-charcoal">{item.rating}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-charcoal/20" />
            <span className="text-lg font-bold text-gold-dark">{item.price}</span>
            {item.duration && (
              <>
                <div className="w-1 h-1 rounded-full bg-charcoal/20" />
                <div className="flex items-center gap-1 text-sm text-charcoal/60">
                  <Clock className="w-4 h-4" />
                  <span>{item.duration}</span>
                </div>
              </>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-2">About</h3>
            <p className="text-sm text-charcoal/70 leading-relaxed">{item.description}</p>
          </div>

          {item.highlights && item.highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-3">Highlights</h3>
              <div className="space-y-2">
                {item.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-charcoal/5">
                    <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold-dark shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-charcoal font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-4 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2"
          >
            <span>Book Experience</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
