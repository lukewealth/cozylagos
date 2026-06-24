import { ServiceBundle } from './data';

export interface SignatureExperience {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  highlights: string[];
  startingPrice: number;
  duration: string;
}

export const SIGNATURE_EXPERIENCES: SignatureExperience[] = [
  {
    id: 'romantic-lagos',
    title: 'Romantic Lagos',
    tagline: 'Love in the City',
    description: 'Curated romantic experiences for couples — from private yacht cruises to candlelit dinners overlooking the lagoon.',
    icon: '💕',
    image: '/assets/bundles/lavish-love-bundle.png',
    highlights: ['Private yacht cruise', 'Candlelit dinner', 'Couples spa', 'Rose petal setup'],
    startingPrice: 2800000,
    duration: '3-7 days'
  },
  {
    id: 'family-lagos',
    title: 'Family Lagos',
    tagline: 'Memories Together',
    description: 'Family-friendly experiences with activities for all ages — from beach days to cultural tours and educational visits.',
    icon: '👨‍👩‍👧‍👦',
    image: '/assets/bundles/edu-care-bundle.png',
    highlights: ['Family suites', 'Kids activities', 'School tours', 'Beach days'],
    startingPrice: 1200000,
    duration: '7-21 days'
  },
  {
    id: 'luxury-lagos',
    title: 'Luxury Lagos',
    tagline: 'Elite Living',
    description: 'The pinnacle of Lagos luxury — presidential suites, private jets, yacht charters, and exclusive access to the city\'s finest.',
    icon: '👑',
    image: '/assets/bundles/executive-elite-bundle.png',
    highlights: ['Presidential suite', 'Private jet', 'Yacht charter', 'VIP access'],
    startingPrice: 18500000,
    duration: '7-21 days'
  },
  {
    id: 'business-lagos-exp',
    title: 'Business Lagos',
    tagline: 'Corporate Excellence',
    description: 'Executive packages for business travelers — premium workspaces, networking events, and seamless logistics.',
    icon: '💼',
    image: '/assets/bundles/business-bundle.png',
    highlights: ['Executive workspace', 'Airport fast-track', 'Business lounge', 'Networking'],
    startingPrice: 1650000,
    duration: '3-7 days'
  },
  {
    id: 'weekend-lagos',
    title: 'Weekend Lagos',
    tagline: 'Quick Escape',
    description: 'Perfect weekend getaways — maximize your 48 hours with curated experiences from beaches to nightlife.',
    icon: '🎉',
    image: '/assets/bundles/pulse-zen-bundle.png',
    highlights: ['Beach club', 'Nightlife VIP', 'Spa treatment', 'City tour'],
    startingPrice: 750000,
    duration: '2-3 days'
  },
  {
    id: 'adventure-lagos',
    title: 'Adventure Lagos',
    tagline: 'Thrill Seeker',
    description: 'For the adventurous soul — water sports, zip-lining, safari experiences, and off-the-beaten-path explorations.',
    icon: '🏄',
    image: '/assets/bundles/tourist-bundle.png',
    highlights: ['Water sports', 'Nature trails', 'Adventure parks', 'Off-road tours'],
    startingPrice: 950000,
    duration: '3-7 days'
  },
  {
    id: 'art-culture-lagos',
    title: 'Art & Culture Lagos',
    tagline: 'Creative Soul',
    description: 'Immerse yourself in Lagos\'s vibrant art scene — gallery tours, music festivals, fashion weeks, and cultural heritage.',
    icon: '🎨',
    image: '/assets/bundles/diaspora-bundle.png',
    highlights: ['Gallery tours', 'Music festivals', 'Fashion events', 'Cultural sites'],
    startingPrice: 1200000,
    duration: '5-10 days'
  },
  {
    id: 'beach-escape-lagos',
    title: 'Beach Escape Lagos',
    tagline: 'Coastal Bliss',
    description: 'Sun, sand, and sea — beachfront accommodations, water activities, and seaside dining experiences.',
    icon: '🏖️',
    image: '/assets/bundles/tourist-bundle.png',
    highlights: ['Beachfront stay', 'Water sports', 'Seaside dining', 'Sunset cruises'],
    startingPrice: 850000,
    duration: '3-7 days'
  }
];

export interface BusinessService {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  startingPrice: number;
}

export const BUSINESS_SERVICES: BusinessService[] = [
  {
    id: 'corporate-housing',
    title: 'Corporate Housing',
    description: 'Fully furnished executive apartments with workspaces, high-speed internet, and concierge services.',
    icon: '🏢',
    features: ['Executive furniture', 'Dedicated workspace', 'High-speed WiFi', 'Housekeeping', '24/7 support'],
    startingPrice: 200000
  },
  {
    id: 'executive-transport',
    title: 'Executive Transportation',
    description: 'Professional chauffeur services with luxury vehicles for business meetings, airport transfers, and city navigation.',
    icon: '🚗',
    features: ['Luxury vehicles', 'Professional drivers', 'Airport transfers', 'Hourly/daily rates', 'Multi-city'],
    startingPrice: 150000
  },
  {
    id: 'business-concierge',
    title: 'Business Concierge',
    description: 'Dedicated concierge for business travelers — meeting scheduling, restaurant reservations, and local assistance.',
    icon: '🤵',
    features: ['Meeting coordination', 'Restaurant bookings', 'Local assistance', 'Translation services', '24/7 availability'],
    startingPrice: 50000
  },
  {
    id: 'meeting-spaces',
    title: 'Meeting Spaces',
    description: 'Premium meeting rooms and event spaces with AV equipment, catering, and professional support.',
    icon: '📊',
    features: ['AV equipment', 'Catering options', 'High-speed internet', 'Professional setup', 'Flexible hours'],
    startingPrice: 75000
  },
  {
    id: 'relocation-services',
    title: 'Relocation Services',
    description: 'Complete relocation support for executives and families moving to Lagos — housing, schools, and settling in.',
    icon: '📦',
    features: ['Housing search', 'School placement', 'Settling assistance', 'Local orientation', 'Ongoing support'],
    startingPrice: 500000
  },
  {
    id: 'team-accommodation',
    title: 'Team Accommodation',
    description: 'Group housing solutions for corporate teams — multiple units, coordinated services, and team facilities.',
    icon: '👥',
    features: ['Multiple units', 'Coordinated services', 'Team facilities', 'Group dining', 'Activity coordination'],
    startingPrice: 150000
  }
];

export interface LagosEvent {
  id: string;
  title: string;
  description: string;
  category: 'concert' | 'festival' | 'exhibition' | 'conference' | 'nightlife' | 'weekly';
  date: string;
  location: string;
  price: string;
  image: string;
  highlights: string[];
}

export const LAGOS_EVENTS: LagosEvent[] = [
  {
    id: 'evt-1',
    title: 'Afrobeats Festival 2026',
    description: 'The biggest Afrobeats music festival featuring top artists from across Africa and the diaspora.',
    category: 'festival',
    date: '2026-07-15',
    location: 'Eko Convention Centre',
    price: '₦25,000 - ₦150,000',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
    highlights: ['Top artists', '3-day event', 'Food vendors', 'VIP areas']
  },
  {
    id: 'evt-2',
    title: 'Lagos Fashion Week',
    description: 'Premier fashion event showcasing African designers, runway shows, and industry networking.',
    category: 'exhibition',
    date: '2026-08-20',
    location: 'Federal Palace Hotel',
    price: '₦50,000 - ₦250,000',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    highlights: ['Runway shows', 'Designer showcases', 'Networking', 'After-parties']
  },
  {
    id: 'evt-3',
    title: 'Tech Conference Lagos',
    description: 'Leading technology conference with keynotes, workshops, and exhibitions on innovation in Africa.',
    category: 'conference',
    date: '2026-09-10',
    location: 'Landmark Centre',
    price: '₦75,000 - ₦300,000',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    highlights: ['Keynote speakers', 'Workshops', 'Exhibition hall', 'Networking']
  },
  {
    id: 'evt-4',
    title: 'Beach Party Series',
    description: 'Weekly beach parties every weekend at Elegushi Beach with live DJs and entertainment.',
    category: 'nightlife',
    date: 'Every Saturday',
    location: 'Elegushi Beach',
    price: '₦5,000 - ₦20,000',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    highlights: ['Live DJs', 'Beach setting', 'Food & drinks', 'Night swimming']
  },
  {
    id: 'evt-5',
    title: 'Art Exhibition: Contemporary Lagos',
    description: 'Curated exhibition of contemporary Nigerian art featuring emerging and established artists.',
    category: 'exhibition',
    date: '2026-06-01 to 2026-06-30',
    location: 'Nike Art Gallery',
    price: 'Free entry',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
    highlights: ['Local artists', 'Guided tours', 'Art workshops', 'Gift shop']
  },
  {
    id: 'evt-6',
    title: 'Lagos Food Festival',
    description: 'Celebrate Nigerian cuisine with food stalls, cooking demonstrations, and cultural performances.',
    category: 'festival',
    date: '2026-10-05',
    location: 'Freedom Park',
    price: '₦10,000 - ₦50,000',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    highlights: ['Food stalls', 'Cooking demos', 'Cultural shows', 'Family-friendly']
  },
  {
    id: 'evt-7',
    title: 'Jazz Night Fridays',
    description: 'Weekly jazz nights featuring local and international musicians in an intimate setting.',
    category: 'weekly',
    date: 'Every Friday',
    location: 'The RSVP, VI',
    price: '₦15,000',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
    highlights: ['Live jazz', 'Fine dining', 'Intimate setting', 'Cocktail bar']
  },
  {
    id: 'evt-8',
    title: 'Startup Pitch Night',
    description: 'Monthly event where Lagos startups pitch to investors and industry leaders.',
    category: 'weekly',
    date: 'Last Thursday monthly',
    location: 'Co-Creation Hub',
    price: 'Free entry',
    image: 'https://images.unsplash.com/photo-1559223607-a43c990c6923?w=800&h=600&fit=crop',
    highlights: ['Startup pitches', 'Investor networking', 'Mentorship', 'Prizes']
  }
];

export interface Favorite {
  id: string;
  type: 'listing' | 'experience' | 'restaurant' | 'beach' | 'service';
  itemId: string;
  title: string;
  subtitle: string;
  image: string;
  addedAt: string;
}

export function getFavorites(): Favorite[] {
  try {
    const favorites = localStorage.getItem('cozy_lagos_favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
}

export function addFavorite(favorite: Omit<Favorite, 'addedAt'>): void {
  try {
    const favorites = getFavorites();
    const exists = favorites.find(f => f.itemId === favorite.itemId && f.type === favorite.type);
    if (!exists) {
      favorites.unshift({ ...favorite, addedAt: new Date().toISOString() });
      localStorage.setItem('cozy_lagos_favorites', JSON.stringify(favorites));
    }
  } catch {
    // Silent fail
  }
}

export function removeFavorite(type: string, itemId: string): void {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(f => !(f.itemId === itemId && f.type === type));
    localStorage.setItem('cozy_lagos_favorites', JSON.stringify(filtered));
  } catch {
    // Silent fail
  }
}

export function isFavorite(type: string, itemId: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.itemId === itemId && f.type === type);
}
