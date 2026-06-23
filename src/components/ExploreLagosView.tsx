import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Star, Clock, DollarSign, Landmark, UtensilsCrossed, Music, ShoppingBag,
  Compass, Car, Sparkles, Users, Briefcase, CalendarDays, Camera, Ship, Coffee,
  Wine, Palette, TreePine, Building2, Store, Gem, GraduationCap, Dumbbell,
  Heart, Baby, Monitor, Network, Award, Ticket, Map, Sailboat, ChefHat,
  Theater, FerrisWheel, Film, Gamepad2, BookOpen, Mic2, Piano, PartyPopper,
  Plane, KeyRound, Bike, Bus, Flower2, HandHeart, Scissors, Tent,
  Wifi, Presentation, FolderOpen, Calendar, Trophy, Drum, ArrowUp, Gift,
  Grid3X3, List, X, ChevronRight, Check, Package, ArrowRight, LayoutGrid,
  SlidersHorizontal, Filter, Search, TrendingUp, Flame, Zap, Crown, Globe
} from 'lucide-react';
import { SERVICE_BUNDLES } from '../data';

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  location: string;
  rating: number;
  price: string;
  gradient: string;
  icon: React.ReactNode;
  duration?: string;
  highlights?: string[];
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
      { id: 'a1', title: 'Nike Art Gallery', description: 'West Africa\'s largest art gallery with over 7,000 works spanning traditional and contemporary Nigerian art.', location: 'Lekki Phase 1', rating: 4.8, price: 'Free', gradient: 'from-amber-600 via-orange-500 to-yellow-400', icon: <Palette className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Guided tours', 'Art workshops', 'Gift shop'] },
      { id: 'a2', title: 'Elegushi Beach', description: 'The quintessential Lagos beach experience with golden sands, live music, and vibrant weekend energy.', location: 'Ikate, Lekki', rating: 4.5, price: '₦5,000', gradient: 'from-cyan-500 via-blue-500 to-indigo-600', icon: <TreePine className="w-8 h-8" />, duration: 'Full day', highlights: ['Live music', 'Water sports', 'Beach bars'] },
      { id: 'a3', title: 'Lagos National Museum', description: 'A treasure trove of Nigerian cultural heritage featuring ancient Nok terracottas and Benin bronzes.', location: 'Onikan, Lagos Island', rating: 4.3, price: '₦2,000', gradient: 'from-emerald-600 via-teal-500 to-green-400', icon: <Building2 className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Historical artifacts', 'Cultural exhibits', 'Guided tours'] },
      { id: 'a4', title: 'Freedom Park', description: 'Former colonial prison transformed into a vibrant cultural hub for art, music, and community events.', location: 'Broad Street, Lagos Island', rating: 4.6, price: '₦3,000', gradient: 'from-violet-600 via-purple-500 to-fuchsia-500', icon: <Landmark className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Live performances', 'Art exhibitions', 'Historical tours'] },
      { id: 'a5', title: 'Eko Atlantic City', description: 'Africa\'s most ambitious real estate project — a futuristic city reclaimed from the Atlantic Ocean.', location: 'Victoria Island', rating: 4.7, price: 'Free', gradient: 'from-slate-600 via-gray-500 to-zinc-400', icon: <Building2 className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Architecture tours', 'Beachfront', 'Modern development'] },
      { id: 'a6', title: 'Kalakuta Republic Museum', description: 'The legendary former home of Fela Kuti, celebrating the life and music of Africa\'s most iconic rebel.', location: 'Agege Motor Road, Ikeja', rating: 4.4, price: '₦1,500', gradient: 'from-red-600 via-rose-500 to-pink-500', icon: <Drum className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Music history', 'Memorabilia', 'Cultural significance'] },
    ]
  },
  {
    id: 'food',
    title: 'Food & Dining',
    description: 'Savor the rich flavors of Lagos — from street-side suya to Michelin-worthy plates',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    items: [
      { id: 'f1', title: 'The RSVP Restaurant', description: 'Multi-level fine dining destination offering contemporary European cuisine with panoramic Lagos skyline views.', location: 'Victoria Island', rating: 4.9, price: '₦₦₦', gradient: 'from-amber-700 via-yellow-600 to-orange-500', icon: <Wine className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Skyline views', 'Wine pairing', 'Private dining'] },
      { id: 'f2', title: 'Mama Put Paradise', description: 'Authentic Nigerian jollof rice, pounded yam, and egusi soup served with the warmth of home cooking.', location: 'Surulere', rating: 4.7, price: '₦', gradient: 'from-orange-600 via-red-500 to-rose-600', icon: <ChefHat className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Local cuisine', 'Family-friendly', 'Affordable'] },
      { id: 'f3', title: 'Sky 16 Rooftop', description: 'Elevated dining 16 floors above Lagos with craft cocktails, tapas, and unforgettable sunset views.', location: 'Eko Hotel, VI', rating: 4.8, price: '₦₦₦', gradient: 'from-indigo-600 via-blue-500 to-cyan-400', icon: <Star className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Rooftop views', 'Craft cocktails', 'Sunset dining'] },
      { id: 'f4', title: 'Café Neo', description: 'Lagos\'s homegrown specialty coffee brand — single-origin Nigerian beans roasted to perfection.', location: 'Multiple Locations', rating: 4.6, price: '₦₦', gradient: 'from-amber-800 via-yellow-700 to-orange-600', icon: <Coffee className="w-8 h-8" />, duration: '1 hour', highlights: ['Specialty coffee', 'Pastries', 'WiFi'] },
      { id: 'f5', title: 'Bukka Hut', description: 'Modern twist on Nigerian street food — suya wraps, puff puff bites, and zobo spritzers in a chic setting.', location: 'Lekki Phase 1', rating: 4.5, price: '₦', gradient: 'from-lime-600 via-green-500 to-emerald-500', icon: <UtensilsCrossed className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Street food', 'Modern setting', 'Quick bites'] },
      { id: 'f6', title: 'Ilu Restaurant', description: 'Award-winning contemporary African cuisine celebrating Yoruba culinary traditions with modern flair.', location: 'Ikoyi', rating: 4.9, price: '₦₦₦₦', gradient: 'from-rose-600 via-pink-500 to-fuchsia-500', icon: <Gem className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Award-winning', 'Contemporary African', 'Fine dining'] },
    ]
  },
  {
    id: 'nightlife',
    title: 'Nightlife & Entertainment',
    description: 'When the sun sets, Lagos comes alive — discover the city\'s electric after-dark scene',
    icon: <Music className="w-5 h-5" />,
    items: [
      { id: 'n1', title: 'Quilox Nightclub', description: 'Lagos\'s most exclusive nightclub — world-class DJs, VIP tables, and an energy that lasts till dawn.', location: 'Victoria Island', rating: 4.7, price: '₦₦₦', gradient: 'from-violet-700 via-purple-600 to-indigo-600', icon: <Music className="w-8 h-8" />, duration: '4-6 hours', highlights: ['VIP tables', 'World-class DJs', 'Exclusive'] },
      { id: 'n2', title: 'The Cubana Bar', description: 'Open-air luxury lounge with infinity pool, premium spirits, and the best Afrobeats DJs in the city.', location: 'Lekki Phase 1', rating: 4.8, price: '₦₦₦', gradient: 'from-fuchsia-600 via-pink-500 to-rose-500', icon: <Wine className="w-8 h-8" />, duration: '3-5 hours', highlights: ['Infinity pool', 'Afrobeats', 'Luxury lounge'] },
      { id: 'n3', title: 'The Comedy Hub', description: 'Home of Lagos\'s hottest stand-up comedy nights featuring Nigeria\'s top comedians and rising stars.', location: 'Ikeja GRA', rating: 4.6, price: '₦₦', gradient: 'from-yellow-500 via-amber-500 to-orange-500', icon: <Mic2 className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Stand-up comedy', 'Live shows', 'Local comedians'] },
      { id: 'n4', title: 'Hard Rock Café Lagos', description: 'Live band performances every weekend, signature cocktails, and an iconic rock \'n\' roll atmosphere.', location: 'Victoria Island', rating: 4.5, price: '₦₦₦', gradient: 'from-red-700 via-rose-600 to-pink-600', icon: <Piano className="w-8 h-8" />, duration: '3-4 hours', highlights: ['Live bands', 'Signature cocktails', 'Rock atmosphere'] },
      { id: 'n5', title: 'Beach Party @ Tarkwa Bay', description: 'Weekend beach parties accessible only by boat — dancing in the sand under the stars.', location: 'Tarkwa Bay', rating: 4.4, price: '₦₦', gradient: 'from-cyan-600 via-teal-500 to-emerald-500', icon: <PartyPopper className="w-8 h-8" />, duration: '4-6 hours', highlights: ['Beach party', 'Boat access', 'Under the stars'] },
      { id: 'n6', title: 'Eko Convention Centre Events', description: 'Lagos\'s premier venue for mega concerts, award shows, and international entertainment spectaculars.', location: 'Victoria Island', rating: 4.7, price: '₦₦', gradient: 'from-blue-700 via-indigo-600 to-violet-600', icon: <Theater className="w-8 h-8" />, duration: '3-5 hours', highlights: ['Mega concerts', 'Award shows', 'International acts'] },
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping & Fashion',
    description: 'From luxury boutiques to vibrant markets — Lagos is Africa\'s fashion capital',
    icon: <ShoppingBag className="w-5 h-5" />,
    items: [
      { id: 's1', title: 'Palm Shopping Mall', description: 'Lekki\'s premier shopping destination with 150+ stores, cinema, bowling alley, and international brands.', location: 'Lekki Phase 1', rating: 4.5, price: 'Free Entry', gradient: 'from-pink-600 via-rose-500 to-red-400', icon: <Store className="w-8 h-8" />, duration: '3-5 hours', highlights: ['150+ stores', 'Cinema', 'International brands'] },
      { id: 's2', title: 'Balogun Market', description: 'Lagos\'s largest and most vibrant market — a sensory explosion of fabrics, fashion, and bargaining.', location: 'Lagos Island', rating: 4.3, price: '₦', gradient: 'from-orange-500 via-amber-500 to-yellow-400', icon: <ShoppingBag className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Local market', 'Fabrics', 'Bargaining'] },
      { id: 's3', title: 'Alara Lagos', description: 'Curated luxury concept store featuring African and international designer fashion, art, and lifestyle.', location: 'Victoria Island', rating: 4.8, price: '₦₦₦', gradient: 'from-slate-700 via-gray-600 to-zinc-500', icon: <Gem className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Luxury fashion', 'African designers', 'Art gallery'] },
      { id: 's4', title: 'Ikoyi Fashion District', description: 'Boutique-lined streets showcasing Nigeria\'s top fashion designers and bespoke tailoring ateliers.', location: 'Ikoyi', rating: 4.6, price: '₦₦₦', gradient: 'from-purple-600 via-violet-500 to-indigo-500', icon: <ShoppingBag className="w-8 h-8" />, duration: '3-4 hours', highlights: ['Fashion boutiques', 'Bespoke tailoring', 'Local designers'] },
      { id: 's5', title: 'Artisan Market Lekki', description: 'Handcrafted souvenirs, traditional textiles, carved masks, and bespoke jewelry from local artisans.', location: 'Lekki Phase 1', rating: 4.4, price: '₦', gradient: 'from-teal-600 via-emerald-500 to-green-400', icon: <Gift className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Handcrafted', 'Souvenirs', 'Local artisans'] },
    ]
  },
  {
    id: 'tours',
    title: 'Tours & Experiences',
    description: 'Curated journeys through Lagos — see the city through the eyes of insiders',
    icon: <Compass className="w-5 h-5" />,
    items: [
      { id: 't1', title: 'Lagos Island Heritage Walk', description: 'Guided walking tour through the historical heart of Lagos — from Broad Street to Marina with expert storytellers.', location: 'Lagos Island', rating: 4.8, price: '₦15,000', gradient: 'from-emerald-600 via-green-500 to-lime-500', icon: <Map className="w-8 h-8" />, duration: '3 hours', highlights: ['Expert guides', 'Historical sites', 'Walking tour'] },
      { id: 't2', title: 'Lekki Lagoon Boat Cruise', description: 'Sunset cruise across the tranquil Lekki Lagoon with champagne, canapés, and stunning skyline views.', location: 'Lekki', rating: 4.9, price: '₦85,000', gradient: 'from-blue-600 via-cyan-500 to-teal-400', icon: <Sailboat className="w-8 h-8" />, duration: '3 hours', highlights: ['Sunset cruise', 'Champagne', 'Skyline views'] },
      { id: 't3', title: 'Lagos Food Tour', description: 'A gastronomic adventure through Surulere and Yaba — taste 10+ local dishes with a foodie guide.', location: 'Surulere & Yaba', rating: 4.7, price: '₦25,000', gradient: 'from-orange-600 via-red-500 to-rose-500', icon: <ChefHat className="w-8 h-8" />, duration: '4 hours', highlights: ['10+ dishes', 'Local guide', 'Food adventure'] },
      { id: 't4', title: 'Lagos by Night City Tour', description: 'Experience Lagos\'s electric nightlife from a luxury bus — club hopping, street food, and live music.', location: 'VI & Lekki', rating: 4.6, price: '35,000', gradient: 'from-indigo-700 via-purple-600 to-violet-500', icon: <Bus className="w-8 h-8" />, duration: '5 hours', highlights: ['Luxury bus', 'Club hopping', 'Live music'] },
      { id: 't5', title: 'Photography Walk — Makoko', description: 'Capture the floating village of Makoko with a professional photographer guide. Camera rental available.', location: 'Makoko', rating: 4.5, price: '₦20,000', gradient: 'from-amber-600 via-yellow-500 to-orange-400', icon: <Camera className="w-8 h-8" />, duration: '3 hours', highlights: ['Professional guide', 'Camera rental', 'Unique location'] },
      { id: 't6', title: 'Corporate Lagos Experience', description: 'Tailored tour for business visitors — visit key business districts, innovation hubs, and networking spots.', location: 'VI & Ikoyi', rating: 4.7, price: '₦50,000', gradient: 'from-slate-600 via-gray-500 to-zinc-400', icon: <Briefcase className="w-8 h-8" />, duration: '4 hours', highlights: ['Business districts', 'Innovation hubs', 'Networking'] },
    ]
  },
  {
    id: 'transport',
    title: 'Transportation Services',
    description: 'Move around Lagos in style — premium rides, airport transfers, and chauffeur services',
    icon: <Car className="w-5 h-5" />,
    items: [
      { id: 'tr1', title: 'Airport VIP Pickup', description: 'Meet-and-greet service at Murtala Muhammed Airport with luxury sedan, cold water, and fast-track through arrivals.', location: 'MMIA Airport', rating: 4.8, price: '₦35,000', gradient: 'from-sky-600 via-blue-500 to-indigo-500', icon: <Plane className="w-8 h-8" />, duration: '1 hour', highlights: ['Meet & greet', 'Luxury sedan', 'Fast-track'] },
      { id: 'tr2', title: 'Chauffeur Service', description: 'Professional chauffeur-driven Mercedes or Range Rover for the day — perfect for business or special occasions.', location: 'Island-wide', rating: 4.9, price: '₦150,000', gradient: 'from-gray-700 via-slate-600 to-zinc-500', icon: <KeyRound className="w-8 h-8" />, duration: 'Full day', highlights: ['Mercedes/Range Rover', 'Professional driver', 'All-day service'] },
      { id: 'tr3', title: 'Luxury Car Rental', description: 'Self-drive or chauffeured rentals — from Toyota Camry to Rolls Royce. Insurance and fuel included.', location: 'All Lagos', rating: 4.6, price: '₦80,000/day', gradient: 'from-red-600 via-rose-500 to-pink-500', icon: <Car className="w-8 h-8" />, duration: 'Per day', highlights: ['Self-drive option', 'Insurance included', 'Wide range'] },
      { id: 'tr4', title: 'Corporate Fleet Transport', description: 'Dedicated fleet management for businesses — staff shuttles, executive transport, and logistics coordination.', location: 'All Lagos', rating: 4.5, price: 'Custom', gradient: 'from-emerald-700 via-teal-600 to-green-500', icon: <Bus className="w-8 h-8" />, duration: 'Ongoing', highlights: ['Fleet management', 'Staff shuttles', 'Logistics'] },
      { id: 'tr5', title: 'Inter-City Transfer', description: 'Comfortable door-to-door transfers between Lagos, Ibadan, Abeokuta, and Benin City in premium vehicles.', location: 'Inter-city', rating: 4.4, price: '65,000', gradient: 'from-amber-600 via-orange-500 to-yellow-500', icon: <Bus className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Door-to-door', 'Premium vehicles', 'Multiple cities'] },
    ]
  },
  {
    id: 'wellness',
    title: 'Wellness & Relaxation',
    description: 'Recharge your body and mind at Lagos\'s finest wellness destinations',
    icon: <Sparkles className="w-5 h-5" />,
    items: [
      { id: 'w1', title: 'Serenity Spa Ikoyi', description: 'Award-winning day spa offering deep tissue massage, aromatherapy, and holistic body treatments.', location: 'Ikoyi', rating: 4.9, price: '₦₦₦', gradient: 'from-teal-500 via-emerald-400 to-green-400', icon: <Flower2 className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Deep tissue', 'Aromatherapy', 'Award-winning'] },
      { id: 'w2', title: 'The Wellness Hub', description: 'State-of-the-art fitness center with personal trainers, yoga classes, and a rooftop infinity pool.', location: 'Victoria Island', rating: 4.7, price: '₦₦', gradient: 'from-blue-500 via-indigo-400 to-violet-400', icon: <Dumbbell className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Personal trainers', 'Yoga classes', 'Infinity pool'] },
      { id: 'w3', title: 'Zen Yoga Studio', description: 'Tranquil yoga and meditation studio offering daily classes from Vinyasa to sound healing sessions.', location: 'Lekki Phase 1', rating: 4.8, price: '₦', gradient: 'from-purple-500 via-fuchsia-400 to-pink-400', icon: <Heart className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Daily classes', 'Meditation', 'Sound healing'] },
      { id: 'w4', title: 'Glow Beauty Lounge', description: 'Premium beauty services — facials, manicures, hair styling, and bridal packages by top stylists.', location: 'Ikoyi', rating: 4.6, price: '₦₦₦', gradient: 'from-rose-500 via-pink-400 to-fuchsia-400', icon: <Scissors className="w-8 h-8" />, duration: '1-3 hours', highlights: ['Facials', 'Bridal packages', 'Top stylists'] },
      { id: 'w5', title: 'Eko Wellness Retreat', description: 'Full-day wellness escape with spa treatments, organic meals, meditation, and nature walks.', location: 'Epe', rating: 4.8, price: '₦₦₦', gradient: 'from-green-600 via-emerald-500 to-teal-400', icon: <Tent className="w-8 h-8" />, duration: 'Full day', highlights: ['Spa treatments', 'Organic meals', 'Nature walks'] },
      { id: 'w6', title: 'Therapeutic Massage Studio', description: 'Specialized sports and therapeutic massage for recovery — deep tissue, hot stone, and reflexology.', location: 'Lekki', rating: 4.5, price: '₦₦', gradient: 'from-cyan-500 via-teal-400 to-emerald-400', icon: <HandHeart className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Sports massage', 'Hot stone', 'Reflexology'] },
    ]
  },
  {
    id: 'family',
    title: 'Family Activities',
    description: 'Create lasting memories with family-friendly fun across Lagos',
    icon: <Users className="w-5 h-5" />,
    items: [
      { id: 'fa1', title: 'Fantasy Dome', description: 'Enchanting children\'s theme park with rides, arcade games, puppet shows, and birthday party packages.', location: 'Lekki Phase 1', rating: 4.6, price: '₦8,000', gradient: 'from-pink-500 via-rose-400 to-red-400', icon: <Baby className="w-8 h-8" />, duration: '3-5 hours', highlights: ['Theme park', 'Arcade games', 'Birthday packages'] },
      { id: 'fa2', title: 'Lekki Conservation Centre', description: 'Walk the longest canopy walkway in Africa, spot monkeys, and explore nature trails in the heart of Lagos.', location: 'Lekki', rating: 4.7, price: '₦5,000', gradient: 'from-green-600 via-lime-500 to-emerald-400', icon: <TreePine className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Canopy walkway', 'Wildlife', 'Nature trails'] },
      { id: 'fa3', title: 'Silverbird Cinemas', description: 'Premium movie experience with IMAX screens, plush recliners, and the best popcorn in Lagos.', location: 'Victoria Island', rating: 4.5, price: '₦5,000', gradient: 'from-indigo-600 via-blue-500 to-purple-500', icon: <Film className="w-8 h-8" />, duration: '2-3 hours', highlights: ['IMAX screens', 'Plush recliners', 'Premium experience'] },
      { id: 'fa4', title: 'Adventure Hub Lagos', description: 'Indoor trampoline parks, laser tag, go-karting, and climbing walls for the whole family.', location: 'Ikeja', rating: 4.4, price: '₦12,000', gradient: 'from-orange-500 via-amber-400 to-yellow-400', icon: <Gamepad2 className="w-8 h-8" />, duration: '3-4 hours', highlights: ['Trampoline park', 'Laser tag', 'Go-karting'] },
      { id: 'fa5', title: 'Lagos Planetarium', description: 'Interactive science museum and planetarium — educational space shows and hands-on exhibits for kids.', location: 'Marina, Lagos Island', rating: 4.6, price: '₦3,500', gradient: 'from-violet-600 via-indigo-500 to-blue-500', icon: <BookOpen className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Space shows', 'Interactive exhibits', 'Educational'] },
    ]
  },
  {
    id: 'business',
    title: 'Business & Corporate Lagos',
    description: 'Premium workspaces and networking venues for the modern professional',
    icon: <Briefcase className="w-5 h-5" />,
    items: [
      { id: 'b1', title: 'Co-Creation Hub', description: 'Africa\'s leading innovation hub — co-working spaces, mentorship programs, and a thriving startup community.', location: 'Yaba', rating: 4.8, price: '₦₦', gradient: 'from-slate-600 via-gray-500 to-zinc-400', icon: <Wifi className="w-8 h-8" />, duration: 'Flexible', highlights: ['Co-working', 'Mentorship', 'Startup community'] },
      { id: 'b2', title: 'Radisson Blu Meeting Rooms', description: 'Executive boardrooms with AV equipment, catering, and dedicated event coordinators for corporate meetings.', location: 'Victoria Island', rating: 4.7, price: '₦₦', gradient: 'from-blue-700 via-indigo-600 to-violet-600', icon: <Presentation className="w-8 h-8" />, duration: 'Half/Full day', highlights: ['AV equipment', 'Catering', 'Event coordinators'] },
      { id: 'b3', title: 'The Zone Business Center', description: 'Fully serviced offices and hot desks in Ikoyi — high-speed internet, printing, and reception services.', location: 'Ikoyi', rating: 4.5, price: '₦₦', gradient: 'from-emerald-600 via-teal-500 to-cyan-500', icon: <FolderOpen className="w-8 h-8" />, duration: 'Flexible', highlights: ['Serviced offices', 'High-speed internet', 'Reception'] },
      { id: 'b4', title: 'Lagos Networking Lounge', description: 'Exclusive members-only lounge for business networking — weekly mixers, pitch nights, and industry panels.', location: 'Victoria Island', rating: 4.6, price: '₦₦₦', gradient: 'from-amber-600 via-yellow-500 to-orange-500', icon: <Network className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Members-only', 'Weekly mixers', 'Pitch nights'] },
      { id: 'b5', title: 'Eko Hotels Conference Centre', description: 'World-class conference facilities for up to 5,000 guests — ideal for summits, expos, and galas.', location: 'Victoria Island', rating: 4.9, price: '₦₦₦', gradient: 'from-rose-600 via-pink-500 to-fuchsia-500', icon: <Monitor className="w-8 h-8" />, duration: 'Full day', highlights: ['5,000 capacity', 'World-class', 'Summits & expos'] },
    ]
  },
  {
    id: 'events',
    title: 'Events Calendar',
    description: 'Don\'t miss a thing — the hottest festivals, concerts, and cultural events in Lagos',
    icon: <CalendarDays className="w-5 h-5" />,
    items: [
      { id: 'e1', title: 'Eko Fest Carnival', description: 'Lagos\'s biggest annual street carnival — colorful floats, masquerades, live music, and cultural displays.', location: 'Tafawa Balewa Square', rating: 4.8, price: '₦10,000', gradient: 'from-yellow-500 via-orange-500 to-red-500', icon: <PartyPopper className="w-8 h-8" />, duration: 'Full day', highlights: ['Street carnival', 'Live music', 'Cultural displays'] },
      { id: 'e2', title: 'AfroNation Lagos', description: 'The world\'s largest Afrobeats festival — 3 days, 100+ artists, and 50,000 fans dancing on the beach.', location: 'Elegushi Beach', rating: 4.9, price: '₦75,000', gradient: 'from-purple-600 via-violet-500 to-indigo-500', icon: <Drum className="w-8 h-8" />, duration: '3 days', highlights: ['100+ artists', 'Beach venue', '50,000 fans'] },
      { id: 'e3', title: 'Lagos Art Fair', description: 'Premier contemporary art exhibition showcasing 200+ African artists — gallery talks and live auctions.', location: 'Eko Hotel, VI', rating: 4.7, price: '₦5,000', gradient: 'from-teal-600 via-emerald-500 to-green-400', icon: <Palette className="w-8 h-8" />, duration: '2-3 days', highlights: ['200+ artists', 'Gallery talks', 'Live auctions'] },
      { id: 'e4', title: 'Lagos Trade Fair', description: 'West Africa\'s largest trade exhibition — 1,000+ exhibitors across industries from tech to agriculture.', location: 'Lagos Trade Fair Complex', rating: 4.5, price: '₦3,000', gradient: 'from-blue-600 via-sky-500 to-cyan-400', icon: <Award className="w-8 h-8" />, duration: '5 days', highlights: ['1,000+ exhibitors', 'Multiple industries', 'Networking'] },
      { id: 'e5', title: 'Lagos Marathon', description: 'Annual city marathon through iconic Lagos landmarks — 10K, half, and full marathon categories.', location: 'Lagos Island', rating: 4.6, price: '₦15,000', gradient: 'from-rose-600 via-red-500 to-orange-500', icon: <Trophy className="w-8 h-8" />, duration: 'Half day', highlights: ['10K/Half/Full', 'City landmarks', 'Annual event'] },
      { id: 'e6', title: 'Detty December Festival', description: 'The ultimate end-of-year celebration — concerts, beach parties, and cultural events all through December.', location: 'Multiple Venues', rating: 4.9, price: '₦₦₦', gradient: 'from-fuchsia-600 via-pink-500 to-rose-500', icon: <Calendar className="w-8 h-8" />, duration: 'All December', highlights: ['Concerts', 'Beach parties', 'Cultural events'] },
    ]
  },
];

const featuredItems: (CategoryItem & { categoryLabel: string })[] = [
  { ...categories[1].items[0], categoryLabel: 'Food & Dining' },
  { ...categories[4].items[1], categoryLabel: 'Tours & Experiences' },
  { ...categories[9].items[1], categoryLabel: 'Events Calendar' },
];

const categoryNav = categories.map(c => ({ id: c.id, title: c.title, icon: c.icon }));

function ItemCard({ item, index, viewMode, onSelect }: { item: CategoryItem; index: number; viewMode: 'grid' | 'list'; onSelect: (item: CategoryItem) => void; key?: string }) {
  if (viewMode === 'list') {
    return (
      <motion.div
        variants={staggerItem}
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={() => onSelect(item)}
        className="group cursor-pointer"
      >
        <div className="bg-white rounded-xl overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex">
          <div className={`w-32 sm:w-40 bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}>
            <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
          </div>
          <div className="flex-1 p-4 sm:p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-charcoal group-hover:text-primary transition-colors truncate">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-charcoal/40" />
                    <span className="text-[10px] text-charcoal/50">{item.location}</span>
                  </div>
                  {item.duration && (
                    <>
                      <span className="text-charcoal/20">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-charcoal/40" />
                        <span className="text-[10px] text-charcoal/50">{item.duration}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <Star className="w-3.5 h-3.5 fill-primary-container text-primary-container" />
                <span className="text-xs font-bold text-charcoal/70">{item.rating}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed line-clamp-2 mb-3">
              {item.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary">{item.price}</span>
              <button className="text-xs font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                View Details
                <ChevronRight className="w-3 h-3" />
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
      onClick={() => onSelect(item)}
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
          <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed line-clamp-2 mb-3">
            {item.description}
          </p>
          {item.duration && (
            <div className="flex items-center gap-1 text-[10px] text-charcoal/40 mb-3">
              <Clock className="w-3 h-3" />
              <span>{item.duration}</span>
            </div>
          )}
          <button className="text-xs font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-1">
            View Details
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CategorySection({ category, viewMode, onSelectItem }: { category: Category; viewMode: 'grid' | 'list'; onSelectItem: (item: CategoryItem) => void; key?: string }) {
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
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
          : 'space-y-3'
        }
      >
        {category.items.map((item, i) => (
          <ItemCard key={item.id} item={item} index={i} viewMode={viewMode} onSelect={onSelectItem} />
        ))}
      </motion.div>
    </motion.section>
  );
}

function SidePanel({ item, onClose, onBookBundle }: { item: CategoryItem; onClose: () => void; onBookBundle: () => void }) {
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
        <div className={`relative h-64 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-white/90 scale-150">
            {item.icon}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-wider uppercase">
              {item.price}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">{item.title}</h2>
            <div className="flex items-center gap-3 text-sm text-charcoal/60">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{item.location}</span>
              </div>
              {item.duration && (
                <>
                  <span className="text-charcoal/20">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.duration}</span>
                  </div>
                </>
              )}
              <span className="text-charcoal/20">•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary-container text-primary-container" />
                <span className="font-semibold">{item.rating}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-3">About</h3>
            <p className="text-sm text-charcoal/70 leading-relaxed">{item.description}</p>
          </div>

          {item.highlights && item.highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-3">Highlights</h3>
              <div className="space-y-2">
                {item.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-charcoal/5">
                    <div className="w-8 h-8 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-charcoal font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-charcoal/10 space-y-3">
            <button
              onClick={onBookBundle}
              className="w-full py-3.5 bg-primary-container text-charcoal font-bold text-sm rounded-xl hover:bg-inverse-primary transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Book with Bundle Package
            </button>
            <button className="w-full py-3.5 bg-charcoal text-parchment font-bold text-sm rounded-xl hover:bg-charcoal-light transition-colors">
              Request Booking
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ExploreLagosView({ onNavigateBundles }: { onNavigateBundles?: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('attractions');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-27');
  const [selectedTime, setSelectedTime] = useState<string>('02:00 PM');
  const [guestCount, setGuestCount] = useState<string>('up-to-5');
  const [bookingRequested, setBookingRequested] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(`category-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBookBundle = () => {
    setSelectedItem(null);
    if (onNavigateBundles) {
      onNavigateBundles();
    }
  };

  const handleBookingRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingRequested(true);
  };

  return (
    <div className="flex-grow bg-parchment text-left">
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
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div
              ref={navRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 mr-4"
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
              onClick={() => setSelectedItem(item)}
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
          <CategorySection key={category.id} category={category} viewMode={viewMode} onSelectItem={setSelectedItem} />
        ))}
      </div>

      {/* BUNDLES SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-10 sm:py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="text-primary font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
            Premium Packages
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-3">
            Curated Experience Bundles
          </h2>
          <p className="text-sm text-charcoal/60 max-w-xl mx-auto">
            All-inclusive packages from 3-day escapes to 21-day luxury immersions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
              <motion.div
                key={bundle.id}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={onNavigateBundles}
                className="group bg-white border border-charcoal/5 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-500 cursor-pointer"
              >
                <div className="p-5">
                  <div className="w-10 h-10 bg-primary-container/15 rounded-xl flex items-center justify-center mb-3 text-primary group-hover:scale-110 transition-transform">
                    {iconMap[bundle.icon]}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-charcoal mb-1">{bundle.title}</h3>
                  <p className="text-[11px] text-charcoal/50 mb-3">{bundle.tagline}</p>
                  <p className="text-xs text-charcoal/60 line-clamp-2 mb-4 leading-relaxed">{bundle.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-charcoal/5">
                    <div>
                      <span className="text-[9px] text-charcoal/40 uppercase tracking-widest block">From</span>
                      <span className="font-serif font-bold text-primary">{lowestPrice.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-charcoal/40">{bundle.tiers.length} tiers</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

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

      {/* SIDE PANEL */}
      <AnimatePresence>
        {selectedItem && (
          <SidePanel
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onBookBundle={handleBookBundle}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
