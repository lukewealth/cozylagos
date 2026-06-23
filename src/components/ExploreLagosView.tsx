import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  MapPin, Star, Clock, DollarSign, Landmark, UtensilsCrossed, Music, ShoppingBag,
  Compass, Car, Sparkles, Users, Briefcase, CalendarDays, Camera, Ship, Coffee,
  Wine, Palette, TreePine, Building2, Store, Gem, GraduationCap, Dumbbell,
  Heart, Baby, Monitor, Network, Award, Ticket, Map, Sailboat, ChefHat,
  Theater, FerrisWheel, Film, Gamepad2, BookOpen, Mic2, Piano, PartyPopper,
  Plane, KeyRound, Bike, Bus, Flower2, HandHeart, Scissors, Tent,
  Wifi, Presentation, FolderOpen, Calendar, Trophy, Drum, ArrowUp, Gift
} from 'lucide-react';

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  location: string;
  rating: number;
  price: string;
  gradient: string;
  icon: React.ReactNode;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: CategoryItem[];
}

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

const categories: Category[] = [
  {
    id: 'attractions',
    title: 'Attractions & Landmarks',
    description: 'Discover the iconic sights and hidden gems that define Lagos',
    icon: <Landmark className="w-5 h-5" />,
    items: [
      { id: 'a1', title: 'Nike Art Gallery', description: 'West Africa\'s largest art gallery with over 7,000 works spanning traditional and contemporary Nigerian art.', location: 'Lekki Phase 1', rating: 4.8, price: 'Free', gradient: 'from-amber-600 via-orange-500 to-yellow-400', icon: <Palette className="w-8 h-8" /> },
      { id: 'a2', title: 'Elegushi Beach', description: 'The quintessential Lagos beach experience with golden sands, live music, and vibrant weekend energy.', location: 'Ikate, Lekki', rating: 4.5, price: '₦5,000', gradient: 'from-cyan-500 via-blue-500 to-indigo-600', icon: <TreePine className="w-8 h-8" /> },
      { id: 'a3', title: 'Lagos National Museum', description: 'A treasure trove of Nigerian cultural heritage featuring ancient Nok terracottas and Benin bronzes.', location: 'Onikan, Lagos Island', rating: 4.3, price: '₦2,000', gradient: 'from-emerald-600 via-teal-500 to-green-400', icon: <Building2 className="w-8 h-8" /> },
      { id: 'a4', title: 'Freedom Park', description: 'Former colonial prison transformed into a vibrant cultural hub for art, music, and community events.', location: 'Broad Street, Lagos Island', rating: 4.6, price: '₦3,000', gradient: 'from-violet-600 via-purple-500 to-fuchsia-500', icon: <Landmark className="w-8 h-8" /> },
      { id: 'a5', title: 'Eko Atlantic City', description: 'Africa\'s most ambitious real estate project — a futuristic city reclaimed from the Atlantic Ocean.', location: 'Victoria Island', rating: 4.7, price: 'Free', gradient: 'from-slate-600 via-gray-500 to-zinc-400', icon: <Building2 className="w-8 h-8" /> },
      { id: 'a6', title: 'Kalakuta Republic Museum', description: 'The legendary former home of Fela Kuti, celebrating the life and music of Africa\'s most iconic rebel.', location: 'Agege Motor Road, Ikeja', rating: 4.4, price: '₦1,500', gradient: 'from-red-600 via-rose-500 to-pink-500', icon: <Drum className="w-8 h-8" /> },
    ]
  },
  {
    id: 'food',
    title: 'Food & Dining',
    description: 'Savor the rich flavors of Lagos — from street-side suya to Michelin-worthy plates',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    items: [
      { id: 'f1', title: 'The RSVP Restaurant', description: 'Multi-level fine dining destination offering contemporary European cuisine with panoramic Lagos skyline views.', location: 'Victoria Island', rating: 4.9, price: '₦₦₦₦', gradient: 'from-amber-700 via-yellow-600 to-orange-500', icon: <Wine className="w-8 h-8" /> },
      { id: 'f2', title: 'Mama Put Paradise', description: 'Authentic Nigerian jollof rice, pounded yam, and egusi soup served with the warmth of home cooking.', location: 'Surulere', rating: 4.7, price: '₦', gradient: 'from-orange-600 via-red-500 to-rose-600', icon: <ChefHat className="w-8 h-8" /> },
      { id: 'f3', title: 'Sky 16 Rooftop', description: 'Elevated dining 16 floors above Lagos with craft cocktails, tapas, and unforgettable sunset views.', location: 'Eko Hotel, VI', rating: 4.8, price: '₦₦₦', gradient: 'from-indigo-600 via-blue-500 to-cyan-400', icon: <Star className="w-8 h-8" /> },
      { id: 'f4', title: 'Café Neo', description: 'Lagos\'s homegrown specialty coffee brand — single-origin Nigerian beans roasted to perfection.', location: 'Multiple Locations', rating: 4.6, price: '₦₦', gradient: 'from-amber-800 via-yellow-700 to-orange-600', icon: <Coffee className="w-8 h-8" /> },
      { id: 'f5', title: 'Bukka Hut', description: 'Modern twist on Nigerian street food — suya wraps, puff puff bites, and zobo spritzers in a chic setting.', location: 'Lekki Phase 1', rating: 4.5, price: '₦₦', gradient: 'from-lime-600 via-green-500 to-emerald-500', icon: <UtensilsCrossed className="w-8 h-8" /> },
      { id: 'f6', title: 'Ilu Restaurant', description: 'Award-winning contemporary African cuisine celebrating Yoruba culinary traditions with modern flair.', location: 'Ikoyi', rating: 4.9, price: '₦₦₦₦', gradient: 'from-rose-600 via-pink-500 to-fuchsia-500', icon: <Gem className="w-8 h-8" /> },
    ]
  },
  {
    id: 'nightlife',
    title: 'Nightlife & Entertainment',
    description: 'When the sun sets, Lagos comes alive — discover the city\'s electric after-dark scene',
    icon: <Music className="w-5 h-5" />,
    items: [
      { id: 'n1', title: 'Quilox Nightclub', description: 'Lagos\'s most exclusive nightclub — world-class DJs, VIP tables, and an energy that lasts till dawn.', location: 'Victoria Island', rating: 4.7, price: '₦₦₦', gradient: 'from-violet-700 via-purple-600 to-indigo-600', icon: <Music className="w-8 h-8" /> },
      { id: 'n2', title: 'The Cubana Bar', description: 'Open-air luxury lounge with infinity pool, premium spirits, and the best Afrobeats DJs in the city.', location: 'Lekki Phase 1', rating: 4.8, price: '₦₦₦', gradient: 'from-fuchsia-600 via-pink-500 to-rose-500', icon: <Wine className="w-8 h-8" /> },
      { id: 'n3', title: 'The Comedy Hub', description: 'Home of Lagos\'s hottest stand-up comedy nights featuring Nigeria\'s top comedians and rising stars.', location: 'Ikeja GRA', rating: 4.6, price: '₦₦', gradient: 'from-yellow-500 via-amber-500 to-orange-500', icon: <Mic2 className="w-8 h-8" /> },
      { id: 'n4', title: 'Hard Rock Café Lagos', description: 'Live band performances every weekend, signature cocktails, and an iconic rock \'n\' roll atmosphere.', location: 'Victoria Island', rating: 4.5, price: '₦₦₦', gradient: 'from-red-700 via-rose-600 to-pink-600', icon: <Piano className="w-8 h-8" /> },
      { id: 'n5', title: 'Beach Party @ Tarkwa Bay', description: 'Weekend beach parties accessible only by boat — dancing in the sand under the stars.', location: 'Tarkwa Bay', rating: 4.4, price: '₦₦', gradient: 'from-cyan-600 via-teal-500 to-emerald-500', icon: <PartyPopper className="w-8 h-8" /> },
      { id: 'n6', title: 'Eko Convention Centre Events', description: 'Lagos\'s premier venue for mega concerts, award shows, and international entertainment spectaculars.', location: 'Victoria Island', rating: 4.7, price: '₦₦₦', gradient: 'from-blue-700 via-indigo-600 to-violet-600', icon: <Theater className="w-8 h-8" /> },
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping & Fashion',
    description: 'From luxury boutiques to vibrant markets — Lagos is Africa\'s fashion capital',
    icon: <ShoppingBag className="w-5 h-5" />,
    items: [
      { id: 's1', title: 'Palm Shopping Mall', description: 'Lekki\'s premier shopping destination with 150+ stores, cinema, bowling alley, and international brands.', location: 'Lekki Phase 1', rating: 4.5, price: 'Free Entry', gradient: 'from-pink-600 via-rose-500 to-red-400', icon: <Store className="w-8 h-8" /> },
      { id: 's2', title: 'Balogun Market', description: 'Lagos\'s largest and most vibrant market — a sensory explosion of fabrics, fashion, and bargaining.', location: 'Lagos Island', rating: 4.3, price: '₦', gradient: 'from-orange-500 via-amber-500 to-yellow-400', icon: <ShoppingBag className="w-8 h-8" /> },
      { id: 's3', title: 'Alara Lagos', description: 'Curated luxury concept store featuring African and international designer fashion, art, and lifestyle.', location: 'Victoria Island', rating: 4.8, price: '₦₦₦₦', gradient: 'from-slate-700 via-gray-600 to-zinc-500', icon: <Gem className="w-8 h-8" /> },
      { id: 's4', title: 'Ikoyi Fashion District', description: 'Boutique-lined streets showcasing Nigeria\'s top fashion designers and bespoke tailoring ateliers.', location: 'Ikoyi', rating: 4.6, price: '₦₦₦', gradient: 'from-purple-600 via-violet-500 to-indigo-500', icon: <ShoppingBag className="w-8 h-8" /> },
      { id: 's5', title: 'Artisan Market Lekki', description: 'Handcrafted souvenirs, traditional textiles, carved masks, and bespoke jewelry from local artisans.', location: 'Lekki Phase 1', rating: 4.4, price: '₦₦', gradient: 'from-teal-600 via-emerald-500 to-green-400', icon: <Gift className="w-8 h-8" /> },
    ]
  },
  {
    id: 'tours',
    title: 'Tours & Experiences',
    description: 'Curated journeys through Lagos — see the city through the eyes of insiders',
    icon: <Compass className="w-5 h-5" />,
    items: [
      { id: 't1', title: 'Lagos Island Heritage Walk', description: 'Guided walking tour through the historical heart of Lagos — from Broad Street to Marina with expert storytellers.', location: 'Lagos Island', rating: 4.8, price: '₦15,000', gradient: 'from-emerald-600 via-green-500 to-lime-500', icon: <Map className="w-8 h-8" /> },
      { id: 't2', title: 'Lekki Lagoon Boat Cruise', description: 'Sunset cruise across the tranquil Lekki Lagoon with champagne, canapés, and stunning skyline views.', location: 'Lekki', rating: 4.9, price: '₦85,000', gradient: 'from-blue-600 via-cyan-500 to-teal-400', icon: <Sailboat className="w-8 h-8" /> },
      { id: 't3', title: 'Lagos Food Tour', description: 'A gastronomic adventure through Surulere and Yaba — taste 10+ local dishes with a foodie guide.', location: 'Surulere & Yaba', rating: 4.7, price: '₦25,000', gradient: 'from-orange-600 via-red-500 to-rose-500', icon: <ChefHat className="w-8 h-8" /> },
      { id: 't4', title: 'Lagos by Night City Tour', description: 'Experience Lagos\'s electric nightlife from a luxury bus — club hopping, street food, and live music.', location: 'VI & Lekki', rating: 4.6, price: '₦35,000', gradient: 'from-indigo-700 via-purple-600 to-violet-500', icon: <Bus className="w-8 h-8" /> },
      { id: 't5', title: 'Photography Walk — Makoko', description: 'Capture the floating village of Makoko with a professional photographer guide. Camera rental available.', location: 'Makoko', rating: 4.5, price: '₦20,000', gradient: 'from-amber-600 via-yellow-500 to-orange-400', icon: <Camera className="w-8 h-8" /> },
      { id: 't6', title: 'Corporate Lagos Experience', description: 'Tailored tour for business visitors — visit key business districts, innovation hubs, and networking spots.', location: 'VI & Ikoyi', rating: 4.7, price: '₦50,000', gradient: 'from-slate-600 via-gray-500 to-zinc-400', icon: <Briefcase className="w-8 h-8" /> },
    ]
  },
  {
    id: 'transport',
    title: 'Transportation Services',
    description: 'Move around Lagos in style — premium rides, airport transfers, and chauffeur services',
    icon: <Car className="w-5 h-5" />,
    items: [
      { id: 'tr1', title: 'Airport VIP Pickup', description: 'Meet-and-greet service at Murtala Muhammed Airport with luxury sedan, cold water, and fast-track through arrivals.', location: 'MMIA Airport', rating: 4.8, price: '₦35,000', gradient: 'from-sky-600 via-blue-500 to-indigo-500', icon: <Plane className="w-8 h-8" /> },
      { id: 'tr2', title: 'Chauffeur Service', description: 'Professional chauffeur-driven Mercedes or Range Rover for the day — perfect for business or special occasions.', location: 'Island-wide', rating: 4.9, price: '₦150,000', gradient: 'from-gray-700 via-slate-600 to-zinc-500', icon: <KeyRound className="w-8 h-8" /> },
      { id: 'tr3', title: 'Luxury Car Rental', description: 'Self-drive or chauffeured rentals — from Toyota Camry to Rolls Royce. Insurance and fuel included.', location: 'All Lagos', rating: 4.6, price: '₦80,000/day', gradient: 'from-red-600 via-rose-500 to-pink-500', icon: <Car className="w-8 h-8" /> },
      { id: 'tr4', title: 'Corporate Fleet Transport', description: 'Dedicated fleet management for businesses — staff shuttles, executive transport, and logistics coordination.', location: 'All Lagos', rating: 4.5, price: 'Custom', gradient: 'from-emerald-700 via-teal-600 to-green-500', icon: <Bus className="w-8 h-8" /> },
      { id: 'tr5', title: 'Inter-City Transfer', description: 'Comfortable door-to-door transfers between Lagos, Ibadan, Abeokuta, and Benin City in premium vehicles.', location: 'Inter-city', rating: 4.4, price: '₦65,000', gradient: 'from-amber-600 via-orange-500 to-yellow-500', icon: <Bus className="w-8 h-8" /> },
    ]
  },
  {
    id: 'wellness',
    title: 'Wellness & Relaxation',
    description: 'Recharge your body and mind at Lagos\'s finest wellness destinations',
    icon: <Sparkles className="w-5 h-5" />,
    items: [
      { id: 'w1', title: 'Serenity Spa Ikoyi', description: 'Award-winning day spa offering deep tissue massage, aromatherapy, and holistic body treatments.', location: 'Ikoyi', rating: 4.9, price: '₦₦₦', gradient: 'from-teal-500 via-emerald-400 to-green-400', icon: <Flower2 className="w-8 h-8" /> },
      { id: 'w2', title: 'The Wellness Hub', description: 'State-of-the-art fitness center with personal trainers, yoga classes, and a rooftop infinity pool.', location: 'Victoria Island', rating: 4.7, price: '₦₦', gradient: 'from-blue-500 via-indigo-400 to-violet-400', icon: <Dumbbell className="w-8 h-8" /> },
      { id: 'w3', title: 'Zen Yoga Studio', description: 'Tranquil yoga and meditation studio offering daily classes from Vinyasa to sound healing sessions.', location: 'Lekki Phase 1', rating: 4.8, price: '₦₦', gradient: 'from-purple-500 via-fuchsia-400 to-pink-400', icon: <Heart className="w-8 h-8" /> },
      { id: 'w4', title: 'Glow Beauty Lounge', description: 'Premium beauty services — facials, manicures, hair styling, and bridal packages by top stylists.', location: 'Ikoyi', rating: 4.6, price: '₦₦₦', gradient: 'from-rose-500 via-pink-400 to-fuchsia-400', icon: <Scissors className="w-8 h-8" /> },
      { id: 'w5', title: 'Eko Wellness Retreat', description: 'Full-day wellness escape with spa treatments, organic meals, meditation, and nature walks.', location: 'Epe', rating: 4.8, price: '₦₦₦₦', gradient: 'from-green-600 via-emerald-500 to-teal-400', icon: <Tent className="w-8 h-8" /> },
      { id: 'w6', title: 'Therapeutic Massage Studio', description: 'Specialized sports and therapeutic massage for recovery — deep tissue, hot stone, and reflexology.', location: 'Lekki', rating: 4.5, price: '₦₦', gradient: 'from-cyan-500 via-teal-400 to-emerald-400', icon: <HandHeart className="w-8 h-8" /> },
    ]
  },
  {
    id: 'family',
    title: 'Family Activities',
    description: 'Create lasting memories with family-friendly fun across Lagos',
    icon: <Users className="w-5 h-5" />,
    items: [
      { id: 'fa1', title: 'Fantasy Dome', description: 'Enchanting children\'s theme park with rides, arcade games, puppet shows, and birthday party packages.', location: 'Lekki Phase 1', rating: 4.6, price: '₦8,000', gradient: 'from-pink-500 via-rose-400 to-red-400', icon: <Baby className="w-8 h-8" /> },
      { id: 'fa2', title: 'Lekki Conservation Centre', description: 'Walk the longest canopy walkway in Africa, spot monkeys, and explore nature trails in the heart of Lagos.', location: 'Lekki', rating: 4.7, price: '₦5,000', gradient: 'from-green-600 via-lime-500 to-emerald-400', icon: <TreePine className="w-8 h-8" /> },
      { id: 'fa3', title: 'Silverbird Cinemas', description: 'Premium movie experience with IMAX screens, plush recliners, and the best popcorn in Lagos.', location: 'Victoria Island', rating: 4.5, price: '₦5,000', gradient: 'from-indigo-600 via-blue-500 to-purple-500', icon: <Film className="w-8 h-8" /> },
      { id: 'fa4', title: 'Adventure Hub Lagos', description: 'Indoor trampoline parks, laser tag, go-karting, and climbing walls for the whole family.', location: 'Ikeja', rating: 4.4, price: '₦12,000', gradient: 'from-orange-500 via-amber-400 to-yellow-400', icon: <Gamepad2 className="w-8 h-8" /> },
      { id: 'fa5', title: 'Lagos Planetarium', description: 'Interactive science museum and planetarium — educational space shows and hands-on exhibits for kids.', location: 'Marina, Lagos Island', rating: 4.6, price: '₦3,500', gradient: 'from-violet-600 via-indigo-500 to-blue-500', icon: <BookOpen className="w-8 h-8" /> },
    ]
  },
  {
    id: 'business',
    title: 'Business & Corporate Lagos',
    description: 'Premium workspaces and networking venues for the modern professional',
    icon: <Briefcase className="w-5 h-5" />,
    items: [
      { id: 'b1', title: 'Co-Creation Hub', description: 'Africa\'s leading innovation hub — co-working spaces, mentorship programs, and a thriving startup community.', location: 'Yaba', rating: 4.8, price: '₦₦', gradient: 'from-slate-600 via-gray-500 to-zinc-400', icon: <Wifi className="w-8 h-8" /> },
      { id: 'b2', title: 'Radisson Blu Meeting Rooms', description: 'Executive boardrooms with AV equipment, catering, and dedicated event coordinators for corporate meetings.', location: 'Victoria Island', rating: 4.7, price: '₦₦₦', gradient: 'from-blue-700 via-indigo-600 to-violet-600', icon: <Presentation className="w-8 h-8" /> },
      { id: 'b3', title: 'The Zone Business Center', description: 'Fully serviced offices and hot desks in Ikoyi — high-speed internet, printing, and reception services.', location: 'Ikoyi', rating: 4.5, price: '₦₦', gradient: 'from-emerald-600 via-teal-500 to-cyan-500', icon: <FolderOpen className="w-8 h-8" /> },
      { id: 'b4', title: 'Lagos Networking Lounge', description: 'Exclusive members-only lounge for business networking — weekly mixers, pitch nights, and industry panels.', location: 'Victoria Island', rating: 4.6, price: '₦₦₦', gradient: 'from-amber-600 via-yellow-500 to-orange-500', icon: <Network className="w-8 h-8" /> },
      { id: 'b5', title: 'Eko Hotels Conference Centre', description: 'World-class conference facilities for up to 5,000 guests — ideal for summits, expos, and galas.', location: 'Victoria Island', rating: 4.9, price: '₦₦₦₦', gradient: 'from-rose-600 via-pink-500 to-fuchsia-500', icon: <Monitor className="w-8 h-8" /> },
    ]
  },
  {
    id: 'events',
    title: 'Events Calendar',
    description: 'Don\'t miss a thing — the hottest festivals, concerts, and cultural events in Lagos',
    icon: <CalendarDays className="w-5 h-5" />,
    items: [
      { id: 'e1', title: 'Eko Fest Carnival', description: 'Lagos\'s biggest annual street carnival — colorful floats, masquerades, live music, and cultural displays.', location: 'Tafawa Balewa Square', rating: 4.8, price: '₦10,000', gradient: 'from-yellow-500 via-orange-500 to-red-500', icon: <PartyPopper className="w-8 h-8" /> },
      { id: 'e2', title: 'AfroNation Lagos', description: 'The world\'s largest Afrobeats festival — 3 days, 100+ artists, and 50,000 fans dancing on the beach.', location: 'Elegushi Beach', rating: 4.9, price: '₦75,000', gradient: 'from-purple-600 via-violet-500 to-indigo-500', icon: <Drum className="w-8 h-8" /> },
      { id: 'e3', title: 'Lagos Art Fair', description: 'Premier contemporary art exhibition showcasing 200+ African artists — gallery talks and live auctions.', location: 'Eko Hotel, VI', rating: 4.7, price: '₦5,000', gradient: 'from-teal-600 via-emerald-500 to-green-400', icon: <Palette className="w-8 h-8" /> },
      { id: 'e4', title: 'Lagos Trade Fair', description: 'West Africa\'s largest trade exhibition — 1,000+ exhibitors across industries from tech to agriculture.', location: 'Lagos Trade Fair Complex', rating: 4.5, price: '₦3,000', gradient: 'from-blue-600 via-sky-500 to-cyan-400', icon: <Award className="w-8 h-8" /> },
      { id: 'e5', title: 'Lagos Marathon', description: 'Annual city marathon through iconic Lagos landmarks — 10K, half, and full marathon categories.', location: 'Lagos Island', rating: 4.6, price: '₦15,000', gradient: 'from-rose-600 via-red-500 to-orange-500', icon: <Trophy className="w-8 h-8" /> },
      { id: 'e6', title: 'Detty December Festival', description: 'The ultimate end-of-year celebration — concerts, beach parties, and cultural events all through December.', location: 'Multiple Venues', rating: 4.9, price: '₦₦₦', gradient: 'from-fuchsia-600 via-pink-500 to-rose-500', icon: <Calendar className="w-8 h-8" /> },
    ]
  },
];

const featuredItems: (CategoryItem & { categoryLabel: string })[] = [
  { ...categories[1].items[0], categoryLabel: 'Food & Dining' },
  { ...categories[4].items[1], categoryLabel: 'Tours & Experiences' },
  { ...categories[9].items[1], categoryLabel: 'Events Calendar' },
];

const categoryNav = categories.map(c => ({ id: c.id, title: c.title, icon: c.icon }));

function ItemCard({ item, index }: { item: CategoryItem; index: number; key?: string }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-xl transition-shadow duration-500">
        <div className={`relative h-44 sm:h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
          <div className="text-white/90 group-hover:scale-110 transition-transform duration-500">
            {item.icon}
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-wide">
              {item.price}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-semibold tracking-wide">{item.location}</span>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-charcoal group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 fill-primary-container text-primary-container" />
              <span className="text-xs font-bold text-charcoal/70">{item.rating}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function CategorySection({ category }: { category: Category; key?: string }) {
  return (
    <motion.section
      id={`category-${category.id}`}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="scroll-mt-28"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary">
          {category.icon}
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
      >
        {category.items.map((item, i) => (
          <ItemCard key={item.id} item={item} index={i} />
        ))}
      </motion.div>
    </motion.section>
  );
}

export default function ExploreLagosView() {
  const [activeCategory, setActiveCategory] = useState<string>('attractions');
  const navRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(`category-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={containerRef} className="flex-grow bg-parchment text-left">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-primary/20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-[1px] bg-primary-container" />
              <span className="text-primary-container font-bold text-[10px] tracking-[0.25em] uppercase">
                Your Lagos Guide
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-[1.05] tracking-tight">
              Explore{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-inverse-primary">
                Lagos
              </span>
            </h1>
            <p className="font-sans text-sm sm:text-base md:text-lg text-white/60 font-light max-w-xl mt-5 leading-relaxed">
              Discover the pulse of Africa's most dynamic city — from pristine beaches and world-class dining to electric nightlife and cultural treasures. Your curated guide to the best of Lagos awaits.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-white/40">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">10 Categories</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/40">
                <Star className="w-4 h-4" />
                <span className="text-xs font-medium">50+ Destinations</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/40">
                <Compass className="w-4 h-4" />
                <span className="text-xs font-medium">Curated Experiences</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY NAV PILLS */}
      <div className="sticky top-0 z-40 bg-parchment/90 backdrop-blur-xl border-b border-charcoal/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20">
          <div
            ref={navRef}
            className="flex gap-2 overflow-x-auto py-3 sm:py-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoryNav.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-charcoal text-white shadow-lg shadow-charcoal/20'
                    : 'bg-white/70 text-charcoal/60 hover:bg-white hover:text-charcoal border border-charcoal/5'
                }`}
              >
                <span className={`transition-colors ${activeCategory === cat.id ? 'text-primary-container' : ''}`}>
                  {cat.icon}
                </span>
                <span className="hidden sm:inline">{cat.title}</span>
                <span className="sm:hidden">{cat.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED THIS WEEK */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary-container" />
            <span className="font-bold text-[10px] tracking-[0.2em] uppercase text-primary">
              Featured This Week
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-8">
            Editor's Picks
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
        >
          {featuredItems.map((item, i) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-2xl transition-shadow duration-500">
                <div className={`relative h-52 sm:h-60 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                  <div className="text-white/80 group-hover:scale-110 transition-transform duration-700">
                    {item.icon}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-wider uppercase">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span className="text-[11px] font-bold text-white">{item.rating}</span>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-charcoal group-hover:text-primary transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-charcoal/55 leading-relaxed line-clamp-2 mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-charcoal/40">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{item.location}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {item.price}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20">
        <div className="h-px bg-gradient-to-r from-transparent via-charcoal/10 to-transparent" />
      </div>

      {/* ALL CATEGORY SECTIONS */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-10 sm:py-14 md:py-20 space-y-16 sm:space-y-20 md:space-y-28">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>

      {/* FOOTER CTA */}
      <section className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-primary/10" />
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-16 sm:py-20 md:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-4">
              Ready to Explore?
            </h2>
            <p className="text-white/50 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Let Cozy Lagos curate the perfect experience for you. From hidden gems to iconic landmarks, your adventure starts here.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-container text-charcoal font-bold text-sm rounded-full hover:bg-inverse-primary transition-colors duration-300"
            >
              <ArrowUp className="w-4 h-4" />
              Back to Top
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}