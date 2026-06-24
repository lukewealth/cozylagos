import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Star, Clock, DollarSign, Landmark, UtensilsCrossed, Music, ShoppingBag,
  Compass, Car, Sparkles, Users, Briefcase, CalendarDays, Camera, Ship, Coffee,
  Wine, Palette, TreePine, Building2, Store, Gem, GraduationCap, Dumbbell,
  Heart, Baby, Monitor, Award, Ticket, Map, Sailboat, ChefHat,
  Theater, Film, BookOpen, Mic2, Piano, PartyPopper,
  Plane, KeyRound, Bike, Bus, Flower2, HandHeart, Scissors, Tent,
  Wifi, Calendar, Trophy, Drum, Gift,
  Grid3X3, List, X, ChevronRight, Check, Package, ArrowRight, LayoutGrid,
  SlidersHorizontal, Filter, Search, TrendingUp, Flame, Zap, Crown, Globe,
  Anchor, Waves, Home, Hotel, Tent as BeachTent, Sun, Moon, Cloud
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
  image?: string;
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
    id: 'beaches',
    title: 'Beaches',
    description: 'Discover Lagos\' stunning coastline — from private resort beaches to pristine natural waterfronts',
    icon: <Waves className="w-5 h-5" />,
    items: [
      { id: 'b1', title: 'Tarkwa Bay Beach', description: 'Secluded beach accessible only by boat — golden sands, clear waters, and weekend beach parties.', location: 'Tarkwa Bay', rating: 4.6, price: '₦5,000', gradient: 'from-cyan-500 via-blue-500 to-indigo-600', icon: <Waves className="w-8 h-8" />, duration: 'Full day', highlights: ['Boat access only', 'Water sports', 'Beach parties', 'Swimming'] },
      { id: 'b2', title: 'Elegushi Royal Beach', description: 'The quintessential Lagos beach experience with live music, VIP areas, and vibrant weekend energy.', location: 'Lekki Phase 1', rating: 4.5, price: '₦10,000', gradient: 'from-amber-500 via-orange-500 to-red-500', icon: <Sun className="w-8 h-8" />, duration: 'Full day', highlights: ['Live music', 'VIP sections', 'Water sports', 'Food vendors'] },
      { id: 'b3', title: 'Landmark Beach', description: 'Premium beach club experience with luxury amenities, restaurants, and entertainment.', location: 'Victoria Island', rating: 4.7, price: '₦15,000', gradient: 'from-emerald-500 via-teal-500 to-cyan-500', icon: <Crown className="w-8 h-8" />, duration: 'Full day', highlights: ['Luxury amenities', 'Restaurants', 'Beach club', 'Events'] },
      { id: 'b4', title: 'Eleko Beach', description: 'Serene and less crowded beach perfect for relaxation and family outings.', location: 'Ibeju-Lekki', rating: 4.4, price: '₦3,000', gradient: 'from-blue-400 via-cyan-400 to-teal-400', icon: <BeachTent className="w-8 h-8" />, duration: 'Full day', highlights: ['Peaceful', 'Family-friendly', 'Swimming', 'Picnics'] },
      { id: 'b5', title: 'Ilashe Beach', description: 'Hidden gem with pristine sands and crystal-clear waters — perfect for weekend escapes.', location: 'Ilashe', rating: 4.5, price: '₦5,000', gradient: 'from-sky-500 via-blue-500 to-indigo-500', icon: <Waves className="w-8 h-8" />, duration: 'Full day', highlights: ['Pristine sands', 'Clear waters', 'Less crowded', 'Nature'] },
      { id: 'b6', title: 'Kuramo Beach', description: 'Quiet beach near Victoria Island ideal for morning jogs and peaceful relaxation.', location: 'Victoria Island', rating: 4.2, price: 'Free', gradient: 'from-slate-500 via-gray-500 to-zinc-500', icon: <Sun className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Free entry', 'Near VI', 'Peaceful', 'Morning walks'] },
    ]
  },
  {
    id: 'museums',
    title: 'Museums',
    description: 'Explore Nigeria\'s rich history and cultural heritage through world-class museums',
    icon: <Building2 className="w-5 h-5" />,
    items: [
      { id: 'm1', title: 'National Museum Lagos', description: 'Nigeria\'s premier museum housing ancient Nok terracottas, Benin bronzes, and cultural artifacts spanning millennia.', location: 'Onikan, Lagos Island', rating: 4.3, price: '₦2,000', gradient: 'from-emerald-600 via-teal-500 to-green-400', icon: <Building2 className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Historical artifacts', 'Cultural exhibits', 'Guided tours', 'Gift shop'] },
      { id: 'm2', title: 'Kalakuta Republic Museum', description: 'The legendary former home of Fela Kuti — celebrating the life, music, and legacy of Africa\'s most iconic rebel.', location: 'Agege Motor Road, Ikeja', rating: 4.4, price: '₦1,500', gradient: 'from-red-600 via-rose-500 to-pink-500', icon: <Drum className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Music history', 'Memorabilia', 'Cultural significance', 'Live music events'] },
      { id: 'm3', title: 'Badagry Heritage Museum', description: 'Chronicles the trans-Atlantic slave trade and Badagry\'s role in this tragic history.', location: 'Badagry', rating: 4.5, price: '₦1,000', gradient: 'from-amber-700 via-orange-600 to-red-600', icon: <Landmark className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Historical tours', 'Slave route', 'Educational', 'Memorial'] },
      { id: 'm4', title: 'MOCA Lagos', description: 'Museum of Contemporary Art showcasing cutting-edge Nigerian and African modern art.', location: 'Lagos', rating: 4.6, price: '₦3,000', gradient: 'from-violet-600 via-purple-500 to-fuchsia-500', icon: <Palette className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Contemporary art', 'Modern exhibitions', 'Artist talks', 'Workshops'] },
    ]
  },
  {
    id: 'galleries',
    title: 'Art Galleries',
    description: 'Discover world-class art spaces showcasing Nigeria\'s vibrant contemporary art scene',
    icon: <Palette className="w-5 h-5" />,
    items: [
      { id: 'g1', title: 'Nike Art Gallery', description: 'West Africa\'s largest privately owned art gallery with over 7,000 works spanning traditional and contemporary Nigerian art.', location: 'Lekki Phase 1', rating: 4.8, price: 'Free', gradient: 'from-amber-600 via-orange-500 to-yellow-400', icon: <Palette className="w-8 h-8" />, duration: '2-3 hours', highlights: ['7,000+ artworks', 'Guided tours', 'Art workshops', 'Gift shop'] },
      { id: 'g2', title: 'Yemisi Shyllon Museum of Art', description: 'One of Nigeria\'s most important modern art museums housing an extensive private collection.', location: 'Pan-Atlantic University', rating: 4.7, price: 'Free', gradient: 'from-indigo-600 via-blue-500 to-cyan-400', icon: <Gem className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Modern art', 'Private collection', 'University setting', 'Educational'] },
      { id: 'g3', title: 'OX Gallery', description: 'Contemporary art gallery featuring emerging and established Nigerian artists.', location: 'Victoria Island', rating: 4.5, price: 'Free', gradient: 'from-rose-600 via-pink-500 to-fuchsia-500', icon: <Palette className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Contemporary', 'Emerging artists', 'Exhibitions', 'Art sales'] },
      { id: 'g4', title: 'Terra Kulture Gallery', description: 'Art gallery showcasing Nigerian culture through paintings, sculptures, and multimedia installations.', location: 'Victoria Island', rating: 4.4, price: '₦1,000', gradient: 'from-emerald-500 via-teal-500 to-cyan-500', icon: <Theater className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Cultural art', 'Theater', 'Restaurant', 'Events'] },
    ]
  },
  {
    id: 'historical',
    title: 'Historical Landmarks',
    description: 'Journey through Lagos\'s rich history from colonial times to modern independence',
    icon: <Landmark className="w-5 h-5" />,
    items: [
      { id: 'h1', title: 'Freedom Park', description: 'Former colonial prison transformed into a vibrant cultural hub for art, music, and community events.', location: 'Broad Street, Lagos Island', rating: 4.6, price: '₦3,000', gradient: 'from-violet-600 via-purple-500 to-fuchsia-500', icon: <Landmark className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Historical tours', 'Live performances', 'Art exhibitions', 'Memorial'] },
      { id: 'h2', title: 'Jaekel House', description: 'Beautifully restored colonial-era building showcasing Lagos\'s architectural heritage.', location: 'Lagos Island', rating: 4.3, price: '₦1,500', gradient: 'from-amber-600 via-orange-500 to-red-500', icon: <Building2 className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Colonial architecture', 'Historical tours', 'Cultural events', 'Photography'] },
      { id: 'h3', title: 'John Randle Centre', description: 'Centre for Yoruba Culture and History celebrating the rich heritage of the Yoruba people.', location: 'Lagos Island', rating: 4.5, price: '₦2,000', gradient: 'from-emerald-600 via-green-500 to-teal-500', icon: <BookOpen className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Yoruba culture', 'Historical exhibits', 'Cultural events', 'Educational'] },
      { id: 'h4', title: 'National Arts Theatre', description: 'Iconic military-era theatre showcasing Nigerian performing arts and cultural performances.', location: 'Iganmu', rating: 4.2, price: '₦2,500', gradient: 'from-rose-600 via-pink-500 to-fuchsia-500', icon: <Theater className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Performing arts', 'Cultural shows', 'Historical venue', 'Events'] },
    ]
  },
  {
    id: 'parks',
    title: 'Parks & Nature',
    description: 'Escape to Lagos\'s green spaces — from conservation centres to nature reserves',
    icon: <TreePine className="w-5 h-5" />,
    items: [
      { id: 'p1', title: 'Lekki Conservation Centre', description: 'Famous for its canopy walkway and nature trails — experience Lagos\'s biodiversity up close.', location: 'Lekki', rating: 4.7, price: '₦5,000', gradient: 'from-green-600 via-emerald-500 to-teal-400', icon: <TreePine className="w-8 h-8" />, duration: '3-4 hours', highlights: ['Canopy walkway', 'Nature trails', 'Wildlife', 'Educational'] },
      { id: 'p2', title: 'LUFASI Nature Park', description: 'Serene nature reserve with hiking trails, wildlife, and peaceful picnic spots.', location: 'Lekki-Epe Expressway', rating: 4.5, price: '₦3,000', gradient: 'from-lime-600 via-green-500 to-emerald-500', icon: <TreePine className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Hiking trails', 'Wildlife', 'Picnics', 'Nature walks'] },
      { id: 'p3', title: 'Omu Resort', description: 'Family-friendly resort with zoo, amusement park, and recreational activities.', location: 'Lekki-Epe', rating: 4.4, price: '₦8,000', gradient: 'from-amber-500 via-orange-500 to-red-500', icon: <Baby className="w-8 h-8" />, duration: 'Full day', highlights: ['Zoo', 'Amusement park', 'Family activities', 'Recreation'] },
      { id: 'p4', title: 'JJT Park', description: 'Johnson Jakande Tinubu Park — urban green space for relaxation and community events.', location: 'Lagos Island', rating: 4.1, price: 'Free', gradient: 'from-teal-500 via-cyan-500 to-blue-500', icon: <TreePine className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Free entry', 'Urban park', 'Events', 'Relaxation'] },
    ]
  },
  {
    id: 'food',
    title: 'Food & Dining',
    description: 'Savor the rich flavors of Lagos — from street-side suya to Michelin-worthy plates',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    items: [
      { id: 'f1', title: 'RSVP Restaurant', description: 'Multi-level fine dining destination offering contemporary European cuisine with panoramic Lagos skyline views.', location: 'Victoria Island', rating: 4.9, price: '₦₦₦', gradient: 'from-amber-700 via-yellow-600 to-orange-500', icon: <Wine className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Skyline views', 'Wine pairing', 'Private dining', 'Rooftop'] },
      { id: 'f2', title: 'Cilantro Lagos', description: 'Award-winning contemporary African cuisine celebrating Yoruba culinary traditions with modern flair.', location: 'Victoria Island', rating: 4.9, price: '₦₦₦₦', gradient: 'from-rose-600 via-pink-500 to-fuchsia-500', icon: <Gem className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Award-winning', 'Contemporary African', 'Fine dining', 'Wine list'] },
      { id: 'f3', title: 'Izanagi Restaurant', description: 'Premium Japanese dining experience with authentic sushi, sashimi, and teppanyaki.', location: 'Victoria Island', rating: 4.8, price: '₦₦₦', gradient: 'from-red-600 via-rose-500 to-pink-500', icon: <UtensilsCrossed className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Japanese cuisine', 'Sushi bar', 'Teppanyaki', 'Sake selection'] },
      { id: 'f4', title: 'Buka Hut', description: 'Modern twist on Nigerian street food — suya wraps, puff puff bites, and zobo spritzers in a chic setting.', location: 'Lekki Phase 1', rating: 4.5, price: '₦', gradient: 'from-lime-600 via-green-500 to-emerald-500', icon: <UtensilsCrossed className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Street food', 'Modern setting', 'Quick bites', 'Affordable'] },
      { id: 'f5', title: 'The Grill by Delis', description: 'Premium seafood and grill restaurant with ocean views and fresh daily catches.', location: 'Victoria Island', rating: 4.7, price: '₦₦₦', gradient: 'from-blue-600 via-cyan-500 to-teal-500', icon: <UtensilsCrossed className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Seafood', 'Ocean views', 'Fresh catches', 'Grill specialties'] },
      { id: 'f6', title: 'Yellow Chilli', description: 'Popular Nigerian restaurant chain serving authentic local dishes in a family-friendly atmosphere.', location: 'Multiple Locations', rating: 4.6, price: '₦₦', gradient: 'from-yellow-500 via-amber-500 to-orange-500', icon: <ChefHat className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Nigerian cuisine', 'Family-friendly', 'Multiple locations', 'Consistent quality'] },
    ]
  },
  {
    id: 'nightlife',
    title: 'Nightlife & Entertainment',
    description: 'When the sun sets, Lagos comes alive — discover the city\'s electric after-dark scene',
    icon: <Music className="w-5 h-5" />,
    items: [
      { id: 'n1', title: 'Quilox Nightclub', description: 'Lagos\'s most exclusive nightclub — world-class DJs, VIP tables, and an energy that lasts till dawn.', location: 'Victoria Island', rating: 4.7, price: '₦₦₦', gradient: 'from-violet-700 via-purple-600 to-indigo-600', icon: <Music className="w-8 h-8" />, duration: '4-6 hours', highlights: ['VIP tables', 'World-class DJs', 'Exclusive', 'Celebrity sightings'] },
      { id: 'n2', title: 'Cubana Bar', description: 'Open-air luxury lounge with infinity pool, premium spirits, and the best Afrobeats DJs in the city.', location: 'Lekki Phase 1', rating: 4.8, price: '₦₦₦', gradient: 'from-fuchsia-600 via-pink-500 to-rose-500', icon: <Wine className="w-8 h-8" />, duration: '3-5 hours', highlights: ['Infinity pool', 'Afrobeats', 'Luxury lounge', 'Outdoor seating'] },
      { id: 'n3', title: 'New Afrika Shrine', description: 'The spiritual home of Afrobeat culture — live music, cultural performances, and Fela\'s legacy.', location: 'Ikeja', rating: 4.6, price: '₦₦', gradient: 'from-red-700 via-rose-600 to-pink-600', icon: <Drum className="w-8 h-8" />, duration: '3-4 hours', highlights: ['Live Afrobeat', 'Cultural venue', 'Historic', 'Authentic experience'] },
      { id: 'n4', title: 'Sugar 52 Rooftop', description: 'Elevated rooftop bar with panoramic city views, craft cocktails, and vibrant weekend parties.', location: 'Lekki', rating: 4.7, price: '₦₦₦', gradient: 'from-indigo-600 via-blue-500 to-cyan-400', icon: <Wine className="w-8 h-8" />, duration: '3-4 hours', highlights: ['Rooftop views', 'Craft cocktails', 'Weekend parties', 'Instagram-worthy'] },
      { id: 'n5', title: 'Sailors Lounge', description: 'Waterfront lounge offering food, drinks, live music, and a relaxed atmosphere by the lagoon.', location: 'Lekki', rating: 4.3, price: '₦₦', gradient: 'from-cyan-600 via-teal-500 to-emerald-500', icon: <Wine className="w-8 h-8" />, duration: '3-5 hours', highlights: ['Waterfront', 'Live music', 'Relaxed vibe', 'Food & drinks'] },
      { id: 'n6', title: 'The View Rooftop', description: 'Premium rooftop experience with elevated views of Lekki, cocktails, and weekend DJ sets.', location: 'Lekki', rating: 4.4, price: '₦₦₦', gradient: 'from-purple-600 via-violet-500 to-indigo-500', icon: <Moon className="w-8 h-8" />, duration: '3-4 hours', highlights: ['Panoramic views', 'Cocktails', 'DJ sets', 'Premium experience'] },
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping & Fashion',
    description: 'From luxury boutiques to vibrant markets — Lagos is Africa\'s fashion capital',
    icon: <ShoppingBag className="w-5 h-5" />,
    items: [
      { id: 's1', title: 'Ikeja City Mall', description: 'Lagos\'s largest shopping mall with 150+ stores, cinema, bowling alley, and international brands.', location: 'Ikeja', rating: 4.5, price: 'Free Entry', gradient: 'from-pink-600 via-rose-500 to-red-400', icon: <Store className="w-8 h-8" />, duration: '3-5 hours', highlights: ['150+ stores', 'Cinema', 'International brands', 'Food court'] },
      { id: 's2', title: 'Balogun Market', description: 'Lagos\'s largest and most vibrant market — a sensory explosion of fabrics, fashion, and bargaining.', location: 'Lagos Island', rating: 4.3, price: '₦', gradient: 'from-orange-500 via-amber-500 to-yellow-400', icon: <ShoppingBag className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Local market', 'Fabrics', 'Bargaining', 'Authentic experience'] },
      { id: 's3', title: 'Alara Lagos', description: 'Curated luxury concept store featuring African and international designer fashion, art, and lifestyle.', location: 'Victoria Island', rating: 4.8, price: '₦₦₦', gradient: 'from-slate-700 via-gray-600 to-zinc-500', icon: <Gem className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Luxury fashion', 'African designers', 'Art gallery', 'Premium brands'] },
      { id: 's4', title: 'Lekki Arts & Crafts Market', description: 'Handcrafted souvenirs, traditional textiles, carved masks, and bespoke jewelry from local artisans.', location: 'Lekki Phase 1', rating: 4.4, price: '₦', gradient: 'from-teal-600 via-emerald-500 to-green-400', icon: <Gift className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Handcrafted', 'Souvenirs', 'Local artisans', 'Bargaining'] },
      { id: 's5', title: 'Fabric Markets', description: 'Explore vibrant fabric markets specializing in Ankara, Lace, Aso Oke, Adire, and George fabrics.', location: 'Multiple Locations', rating: 4.6, price: '₦₦', gradient: 'from-purple-600 via-violet-500 to-indigo-500', icon: <ShoppingBag className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Ankara', 'Lace', 'Aso Oke', 'Adire'] },
      { id: 's6', title: 'Nigerian Designers', description: 'Shop from top Nigerian fashion designers — Lisa Folawiyo, Deola Sagoe, Orange Culture, Mai Atafo.', location: 'Various Boutiques', rating: 4.7, price: '₦₦₦', gradient: 'from-rose-600 via-pink-500 to-fuchsia-500', icon: <Crown className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Top designers', 'Bespoke', 'Luxury fashion', 'Custom tailoring'] },
    ]
  },
  {
    id: 'tours',
    title: 'Tours & Experiences',
    description: 'Curated journeys through Lagos — see the city through the eyes of insiders',
    icon: <Compass className="w-5 h-5" />,
    items: [
      { id: 't1', title: 'Lagos Island Heritage Walk', description: 'Guided walking tour through the historical heart of Lagos — from Broad Street to Marina with expert storytellers.', location: 'Lagos Island', rating: 4.8, price: '₦15,000', gradient: 'from-emerald-600 via-green-500 to-lime-500', icon: <Map className="w-8 h-8" />, duration: '3 hours', highlights: ['Expert guides', 'Historical sites', 'Walking tour', 'Cultural insights'] },
      { id: 't2', title: 'Lekki Lagoon Sunset Cruise', description: 'Sunset cruise across the tranquil Lekki Lagoon with champagne, canapés, and stunning skyline views.', location: 'Lekki', rating: 4.9, price: '₦85,000', gradient: 'from-blue-600 via-cyan-500 to-teal-400', icon: <Sailboat className="w-8 h-8" />, duration: '3 hours', highlights: ['Sunset cruise', 'Champagne', 'Skyline views', 'Romantic'] },
      { id: 't3', title: 'Private Yacht Experience', description: 'Luxury yacht charter with crew, catering, and the freedom to explore Lagos\'s waterways in style.', location: 'Victoria Island', rating: 4.9, price: '₦500,000', gradient: 'from-indigo-700 via-blue-600 to-cyan-500', icon: <Ship className="w-8 h-8" />, duration: '4-6 hours', highlights: ['Private yacht', 'Crew service', 'Catering', 'Luxury experience'] },
      { id: 't4', title: 'Lagos Food Tour', description: 'A gastronomic adventure through Surulere and Yaba — taste 10+ local dishes with a foodie guide.', location: 'Surulere & Yaba', rating: 4.7, price: '₦25,000', gradient: 'from-orange-600 via-red-500 to-rose-500', icon: <ChefHat className="w-8 h-8" />, duration: '4 hours', highlights: ['10+ dishes', 'Local guide', 'Food adventure', 'Cultural insights'] },
      { id: 't5', title: 'Photography Walk — Makoko', description: 'Capture the floating village of Makoko with a professional photographer guide. Camera rental available.', location: 'Makoko', rating: 4.5, price: '₦20,000', gradient: 'from-amber-600 via-yellow-500 to-orange-400', icon: <Camera className="w-8 h-8" />, duration: '3 hours', highlights: ['Professional guide', 'Camera rental', 'Unique location', 'Cultural experience'] },
      { id: 't6', title: 'Corporate Lagos Experience', description: 'Tailored tour for business visitors — visit key business districts, innovation hubs, and networking spots.', location: 'VI & Ikoyi', rating: 4.7, price: '₦50,000', gradient: 'from-slate-600 via-gray-500 to-zinc-400', icon: <Briefcase className="w-8 h-8" />, duration: '4 hours', highlights: ['Business districts', 'Innovation hubs', 'Networking', 'Professional'] },
    ]
  },
  {
    id: 'transport',
    title: 'Transportation Services',
    description: 'Move around Lagos in style — premium rides, airport transfers, and chauffeur services',
    icon: <Car className="w-5 h-5" />,
    items: [
      { id: 'tr1', title: 'Airport VIP Pickup', description: 'Meet-and-greet service at Murtala Muhammed Airport with luxury sedan, cold water, and fast-track through arrivals.', location: 'MMIA Airport', rating: 4.8, price: '₦35,000', gradient: 'from-sky-600 via-blue-500 to-indigo-500', icon: <Plane className="w-8 h-8" />, duration: '1 hour', highlights: ['Meet & greet', 'Luxury sedan', 'Fast-track', 'Cold water'] },
      { id: 'tr2', title: 'Chauffeur Service', description: 'Professional chauffeur-driven Mercedes or Range Rover for the day — perfect for business or special occasions.', location: 'Island-wide', rating: 4.9, price: '₦150,000', gradient: 'from-gray-700 via-slate-600 to-zinc-500', icon: <KeyRound className="w-8 h-8" />, duration: 'Full day', highlights: ['Mercedes/Range Rover', 'Professional driver', 'All-day service', 'Premium'] },
      { id: 'tr3', title: 'Luxury Car Rental', description: 'Self-drive or chauffeured rentals — from Toyota Camry to Rolls Royce. Insurance and fuel included.', location: 'All Lagos', rating: 4.6, price: '₦80,000/day', gradient: 'from-red-600 via-rose-500 to-pink-500', icon: <Car className="w-8 h-8" />, duration: 'Per day', highlights: ['Self-drive option', 'Insurance included', 'Wide range', 'Flexible'] },
      { id: 'tr4', title: 'Water Taxi', description: 'Fast and scenic water transportation across Lagos Lagoon — beat the traffic in style.', location: 'Various Routes', rating: 4.5, price: '₦15,000', gradient: 'from-cyan-600 via-teal-500 to-emerald-500', icon: <Ship className="w-8 h-8" />, duration: '30-60 mins', highlights: ['Scenic route', 'Fast', 'Traffic-free', 'Unique experience'] },
      { id: 'tr5', title: 'Intercity Transfer', description: 'Comfortable door-to-door transfers between Lagos, Ibadan, Abeokuta, and Benin City in premium vehicles.', location: 'Inter-city', rating: 4.4, price: '₦65,000', gradient: 'from-amber-600 via-orange-500 to-yellow-500', icon: <Bus className="w-8 h-8" />, duration: '2-4 hours', highlights: ['Door-to-door', 'Premium vehicles', 'Multiple cities', 'Comfortable'] },
      { id: 'tr6', title: 'Ride-Hailing Premium', description: 'Uber, Bolt, and inDrive premium options — economy, comfort, and premium categories available.', location: 'All Lagos', rating: 4.3, price: '₦5,000-₦50,000', gradient: 'from-green-600 via-emerald-500 to-teal-500', icon: <Car className="w-8 h-8" />, duration: 'Variable', highlights: ['Multiple apps', 'All categories', 'Cashless', 'Tracking'] },
    ]
  },
  {
    id: 'wellness',
    title: 'Wellness & Relaxation',
    description: 'Recharge your body and mind at Lagos\'s finest wellness destinations',
    icon: <Sparkles className="w-5 h-5" />,
    items: [
      { id: 'w1', title: 'Serenity Spa Ikoyi', description: 'Award-winning day spa offering deep tissue massage, aromatherapy, and holistic body treatments.', location: 'Ikoyi', rating: 4.9, price: '₦₦₦', gradient: 'from-teal-500 via-emerald-400 to-green-400', icon: <Flower2 className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Deep tissue', 'Aromatherapy', 'Award-winning', 'Luxury'] },
      { id: 'w2', title: 'The Wellness Hub', description: 'State-of-the-art fitness center with personal trainers, yoga classes, and a rooftop infinity pool.', location: 'Victoria Island', rating: 4.7, price: '₦₦', gradient: 'from-blue-500 via-indigo-400 to-violet-400', icon: <Dumbbell className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Personal trainers', 'Yoga classes', 'Infinity pool', 'Modern equipment'] },
      { id: 'w3', title: 'Zen Yoga Studio', description: 'Tranquil yoga and meditation studio offering daily classes from Vinyasa to sound healing sessions.', location: 'Lekki Phase 1', rating: 4.8, price: '₦', gradient: 'from-purple-500 via-fuchsia-400 to-pink-400', icon: <Heart className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Daily classes', 'Meditation', 'Sound healing', 'Peaceful'] },
      { id: 'w4', title: 'Glow Beauty Lounge', description: 'Premium beauty services — facials, manicures, hair styling, and bridal packages by top stylists.', location: 'Ikoyi', rating: 4.6, price: '₦₦₦', gradient: 'from-rose-500 via-pink-400 to-fuchsia-400', icon: <Scissors className="w-8 h-8" />, duration: '1-3 hours', highlights: ['Facials', 'Bridal packages', 'Top stylists', 'Premium products'] },
      { id: 'w5', title: 'Eko Wellness Retreat', description: 'Full-day wellness escape with spa treatments, organic meals, meditation, and nature walks.', location: 'Epe', rating: 4.8, price: '₦₦₦', gradient: 'from-green-600 via-emerald-500 to-teal-400', icon: <Tent className="w-8 h-8" />, duration: 'Full day', highlights: ['Spa treatments', 'Organic meals', 'Nature walks', 'Full escape'] },
      { id: 'w6', title: 'Therapeutic Massage Studio', description: 'Specialized sports and therapeutic massage for recovery — deep tissue, hot stone, and reflexology.', location: 'Lekki', rating: 4.5, price: '₦₦', gradient: 'from-cyan-500 via-teal-400 to-emerald-400', icon: <HandHeart className="w-8 h-8" />, duration: '1-2 hours', highlights: ['Sports massage', 'Hot stone', 'Reflexology', 'Recovery'] },
    ]
  },
  {
    id: 'family',
    title: 'Family Activities',
    description: 'Fun and educational experiences for the whole family — from theme parks to nature reserves',
    icon: <Baby className="w-5 h-5" />,
    items: [
      { id: 'fa1', title: 'Omu Resort', description: 'Family-friendly resort with zoo, amusement park, water activities, and recreational facilities.', location: 'Lekki-Epe', rating: 4.4, price: '₦8,000', gradient: 'from-amber-500 via-orange-500 to-red-500', icon: <Baby className="w-8 h-8" />, duration: 'Full day', highlights: ['Zoo', 'Amusement park', 'Water activities', 'Family fun'] },
      { id: 'fa2', title: 'Lekki Conservation Centre', description: 'Nature reserve with canopy walkway, nature trails, and educational programs for children.', location: 'Lekki', rating: 4.7, price: '₦5,000', gradient: 'from-green-600 via-emerald-500 to-teal-400', icon: <TreePine className="w-8 h-8" />, duration: '3-4 hours', highlights: ['Canopy walkway', 'Nature trails', 'Educational', 'Wildlife'] },
      { id: 'fa3', title: 'Landmark Beach', description: 'Family-friendly beach with calm waters, playgrounds, and beach activities for all ages.', location: 'Victoria Island', rating: 4.7, price: '₦15,000', gradient: 'from-cyan-500 via-blue-500 to-indigo-500', icon: <Waves className="w-8 h-8" />, duration: 'Full day', highlights: ['Calm waters', 'Playgrounds', 'Beach activities', 'Family-friendly'] },
      { id: 'fa4', title: 'Cinema Experiences', description: 'Premium cinema experiences at Ikeja City Mall, Palms Mall, and Silverbird — latest movies and family screenings.', location: 'Multiple Locations', rating: 4.5, price: '₦5,000', gradient: 'from-purple-600 via-violet-500 to-indigo-500', icon: <Film className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Latest movies', 'Family screenings', 'Premium seating', 'Popcorn & snacks'] },
      { id: 'fa5', title: 'National Museum Lagos', description: 'Educational and cultural experience with historical artifacts and interactive exhibits for children.', location: 'Onikan, Lagos Island', rating: 4.3, price: '₦2,000', gradient: 'from-emerald-600 via-teal-500 to-green-400', icon: <Building2 className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Historical artifacts', 'Educational', 'Cultural exhibits', 'Family-friendly'] },
      { id: 'fa6', title: 'Bowling & Arcade', description: 'Indoor entertainment with bowling alleys, arcade games, and family fun zones.', location: 'Ikeja City Mall', rating: 4.4, price: '₦10,000', gradient: 'from-rose-500 via-pink-500 to-fuchsia-500', icon: <Trophy className="w-8 h-8" />, duration: '2-3 hours', highlights: ['Bowling', 'Arcade games', 'Indoor fun', 'All ages'] },
    ]
  },
];

export default function ExploreLagosView({ onNavigateBundles }: { onNavigateBundles: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = activeCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.id === activeCategory);

  const allItems = filteredCategories.flatMap(cat => 
    cat.items.map(item => ({ ...item, categoryId: cat.id, categoryTitle: cat.title, categoryIcon: cat.icon }))
  );

  const searchedItems = searchQuery
    ? allItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allItems;

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-charcoal">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
            src="/assets/images/horizontal/CozyLagos.jpeg"
            alt="Explore Lagos"
            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/bundles/bundles-hero-background.jpeg'; }}
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
              Discover Lagos
            </span>
            <div className="w-8 sm:w-10 h-[1px] bg-gold/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-parchment leading-tight tracking-tight max-w-4xl mb-3 sm:mb-4"
          >
            Explore <span className="italic font-light text-gold-light">Lagos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-sans text-xs sm:text-sm md:text-base text-parchment/70 max-w-2xl font-light leading-relaxed px-2"
          >
            From pristine beaches to vibrant nightlife, world-class dining to cultural landmarks — experience the best of Lagos through curated guides and insider recommendations.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 w-full max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search beaches, restaurants, attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-xl rounded-full text-sm sm:text-base text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-20 z-30 bg-parchment/95 backdrop-blur-xl border-b border-charcoal/5 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-charcoal text-parchment'
                  : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>All</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-charcoal text-parchment'
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
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        {searchQuery ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                  Search Results
                </h2>
                <p className="text-sm text-charcoal/60 mt-1">
                  {searchedItems.length} result{searchedItems.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="flex items-center gap-2 px-4 py-2 bg-charcoal/5 hover:bg-charcoal/10 rounded-lg text-xs font-bold text-charcoal transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-gold-dark font-bold text-[9px] sm:text-[10px] tracking-[0.25em] uppercase block mb-2">
                  {filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'}
                </span>
                <h2 className="font-serif font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal">
                  {activeCategory === 'all' ? 'All Experiences' : filteredCategories[0]?.title}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-light mt-2 max-w-xl">
                  {activeCategory === 'all' 
                    ? 'Discover everything Lagos has to offer'
                    : filteredCategories[0]?.description
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-charcoal text-parchment' : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-charcoal text-parchment' : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer"
              >
                <div className="bg-parchment border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className={`relative h-48 bg-gradient-to-br ${item.gradient} overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                        {item.icon}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-xl font-bold text-white mb-1">{item.title}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-charcoal/60 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-gold-dark fill-current" />
                        <span className="text-sm font-bold text-charcoal">{item.rating}</span>
                      </div>
                      <span className="text-sm font-bold text-gold-dark">{item.price}</span>
                    </div>
                    {item.highlights && (
                      <div className="flex flex-wrap gap-1">
                        {item.highlights.slice(0, 2).map((h, i) => (
                          <span key={i} className="text-[9px] font-medium text-charcoal/50 bg-charcoal/5 px-2 py-0.5 rounded-full">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {searchedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer"
              >
                <div className="bg-parchment border border-charcoal/5 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex">
                  <div className={`w-32 sm:w-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}>
                    <div className="text-white/80">{item.icon}</div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-charcoal group-hover:text-gold-dark transition-colors">{item.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-charcoal/60 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-gold-dark fill-current" />
                        <span className="text-sm font-bold text-charcoal">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-charcoal/60 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gold-dark">{item.price}</span>
                      {item.duration && (
                        <div className="flex items-center gap-1 text-xs text-charcoal/60">
                          <Clock className="w-3 h-3" />
                          <span>{item.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {searchedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-charcoal/30" />
            </div>
            <p className="text-lg font-semibold text-charcoal mb-2">No results found</p>
            <p className="text-sm text-charcoal/50">Try adjusting your search or browse categories</p>
          </div>
        )}
      </section>

      {/* Bundle Integration CTA */}
      <section className="py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="bg-gradient-to-br from-charcoal via-charcoal to-charcoal/90 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-gold uppercase tracking-[0.3em] font-bold text-[9px] sm:text-[10px] block mb-3">
              Curated Experiences
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-parchment leading-tight mb-4">
              Bundle Your Lagos Adventure
            </h3>
            <p className="text-xs sm:text-sm text-parchment/70 font-light leading-relaxed mb-6">
              Combine accommodation, transportation, tours, and experiences into seamless packages. Save time and money with our curated bundles designed for every type of traveler.
            </p>
            <button
              onClick={onNavigateBundles}
              className="inline-flex items-center gap-2 bg-gold text-charcoal hover:bg-gold-dark px-6 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all"
            >
              <span>View Bundles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-parchment w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`relative h-48 sm:h-64 bg-gradient-to-br ${selectedItem.gradient} overflow-hidden shrink-0`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white">
                      {selectedItem.icon}
                    </div>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">{selectedItem.title}</h2>
                  <div className="flex items-center gap-2 text-white/80 text-xs mt-2">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedItem.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-gold-dark fill-current" />
                    <span className="text-lg font-bold text-charcoal">{selectedItem.rating}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gold-dark">{selectedItem.price}</span>
                    {selectedItem.duration && (
                      <div className="flex items-center gap-1 text-xs text-charcoal/60 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{selectedItem.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-charcoal/70 leading-relaxed mb-6">{selectedItem.description}</p>

                {selectedItem.highlights && (
                  <div className="mb-6">
                    <h4 className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3">Highlights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedItem.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gold/5 border border-gold/10">
                          <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                          <span className="text-xs text-charcoal font-medium">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-charcoal text-parchment rounded-2xl p-4 sm:p-6">
                  <span className="text-[9px] font-bold text-gold uppercase tracking-widest block mb-1">Ready to Visit?</span>
                  <p className="text-xs text-parchment/70 mb-4">
                    Book this experience as part of a bundle or contact our concierge for custom arrangements.
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-gold text-charcoal hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all">
                      Book Now
                    </button>
                    <button className="px-4 py-3 border border-parchment/30 text-parchment hover:bg-parchment/10 font-bold text-xs tracking-widest uppercase rounded-xl transition-all">
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
