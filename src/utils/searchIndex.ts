import { Listing } from '../types';
import { SERVICE_BUNDLES, VIP_SERVICES } from '../data';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'stay' | 'explore' | 'assist' | 'experience' | 'business' | 'event';
  icon: string;
  action: string;
  data?: any;
  score: number;
}

export interface SearchCategory {
  id: string;
  label: string;
  icon: string;
  items: string[];
}

export const SEARCH_CATEGORIES: SearchCategory[] = [
  {
    id: 'stay',
    label: 'Lagos Gems',
    icon: '🏡',
    items: ['Apartments', 'Villas', 'Hotels', 'Beach Houses', 'Short Lets', 'Luxury Stays']
  },
  {
    id: 'explore',
    label: 'Explore Lagos',
    icon: '🌴',
    items: ['Beaches', 'Museums', 'Art Galleries', 'Historical Sites', 'Parks', 'Waterfronts', 'Restaurants', 'Nightlife', 'Events']
  },
  {
    id: 'assist',
    label: 'Lagos Assist',
    icon: '🤝',
    items: ['Airport Pickup', 'Personal Driver', 'Car Rental', 'Concierge', 'Fridge Stocking', 'In-home Massage', 'Personal Trainer', 'Personal Shopper', 'Visa Assistance']
  },
  {
    id: 'experience',
    label: 'Signature Experiences',
    icon: '✨',
    items: ['Romantic Lagos', 'Family Lagos', 'Luxury Lagos', 'Business Lagos', 'Weekend Lagos', 'Adventure Lagos', 'Art & Culture Lagos', 'Beach Escape Lagos']
  },
  {
    id: 'business',
    label: 'Business Lagos',
    icon: '💼',
    items: ['Corporate Housing', 'Executive Transportation', 'Business Concierge', 'Meeting Spaces', 'Relocation Services', 'Team Accommodation']
  },
  {
    id: 'event',
    label: 'Events',
    icon: '📅',
    items: ['Concerts', 'Festivals', 'Exhibitions', 'Conferences', 'Nightlife Events', 'Weekly Happenings']
  }
];

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[₦,]/g, '')
    .split(/[\s,;|]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2);
}

function scoreText(text: string, tokens: string[], weight: number): number {
  let score = 0;
  const lower = text.toLowerCase();
  for (const token of tokens) {
    if (lower.includes(token)) {
      score += weight;
      if (lower.startsWith(token)) score += weight * 0.5;
      if (lower === token) score += weight * 2;
    }
  }
  return score;
}

function scoreListing(listing: Listing, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  let score = 0;
  
  score += scoreText(listing.title, tokens, 10);
  score += scoreText(listing.location, tokens, 8);
  score += scoreText(listing.category, tokens, 6);
  score += scoreText(listing.description, tokens, 4);
  score += scoreText((listing.keywords || []).join(' '), tokens, 7);
  score += scoreText(listing.amenities.join(' '), tokens, 5);

  const priceToken = tokens.find(t => /^\d+$/.test(t) || t.includes('k') || t.includes('m'));
  if (priceToken) {
    let priceLimit = 0;
    if (priceToken.includes('k')) priceLimit = parseInt(priceToken.replace('k', '')) * 1000;
    else if (priceToken.includes('m')) priceLimit = parseInt(priceToken.replace('m', '')) * 1000000;
    else if (/^\d+$/.test(priceToken)) {
      const num = parseInt(priceToken);
      priceLimit = num < 10000 ? num * 1000 : num;
    }
    if (priceLimit > 0 && listing.nightlyRate <= priceLimit) {
      score += 15;
    }
  }

  const bedToken = tokens.find(t => t.includes('br') || t.includes('bed'));
  if (bedToken) {
    const beds = parseInt(bedToken);
    if (!isNaN(beds) && listing.bedrooms >= beds) score += 10;
  }

  return score;
}

function scoreBundle(bundle: typeof SERVICE_BUNDLES[0], tokens: string[]): number {
  if (tokens.length === 0) return 0;
  let score = 0;
  score += scoreText(bundle.title, tokens, 10);
  score += scoreText(bundle.tagline, tokens, 6);
  score += scoreText(bundle.description, tokens, 4);
  score += scoreText(bundle.highlights.join(' '), tokens, 5);
  return score;
}

function scoreVIPService(service: typeof VIP_SERVICES[0], tokens: string[]): number {
  if (tokens.length === 0) return 0;
  let score = 0;
  score += scoreText(service.title, tokens, 10);
  score += scoreText(service.category, tokens, 7);
  score += scoreText(service.description, tokens, 4);
  score += scoreText(service.location, tokens, 6);
  score += scoreText(service.highlights.join(' '), tokens, 5);
  return score;
}

export function buildSearchIndex(listings: Listing[]): SearchResult[] {
  const results: SearchResult[] = [];

  listings.forEach(listing => {
    results.push({
      id: listing.id,
      title: listing.title,
      subtitle: `${listing.location} • ₦${listing.nightlyRate.toLocaleString()}/night`,
      category: 'stay',
      icon: '🏡',
      action: 'view_listing',
      data: listing,
      score: 0
    });
  });

  SERVICE_BUNDLES.forEach(bundle => {
    results.push({
      id: bundle.id,
      title: bundle.title,
      subtitle: bundle.tagline,
      category: 'experience',
      icon: '✨',
      action: 'view_bundle',
      data: bundle,
      score: 0
    });
  });

  VIP_SERVICES.forEach(service => {
    results.push({
      id: service.id,
      title: service.title,
      subtitle: `${service.category} • ${service.location}`,
      category: 'assist',
      icon: '🤝',
      action: 'view_service',
      data: service,
      score: 0
    });
  });

  const exploreItems = [
    { id: 'beaches', title: 'Beaches', subtitle: 'Elegushi, Tarkwa Bay, Alpha Beach', category: 'explore' as const, icon: '🏖️' },
    { id: 'museums', title: 'Museums', subtitle: 'National Museum, Kalakuta Republic', category: 'explore' as const, icon: '🏛️' },
    { id: 'galleries', title: 'Art Galleries', subtitle: 'Nike Art Gallery, Alara', category: 'explore' as const, icon: '🎨' },
    { id: 'parks', title: 'Parks', subtitle: 'Lekki Conservation, Freedom Park', category: 'explore' as const, icon: '🌳' },
    { id: 'nightlife', title: 'Nightlife', subtitle: 'Quilox, Cubana, Hard Rock Café', category: 'explore' as const, icon: '🎵' },
    { id: 'restaurants', title: 'Restaurants', subtitle: 'RSVP, Ilu, Sky 16', category: 'explore' as const, icon: '🍽️' },
    { id: 'historic', title: 'Historic Sites', subtitle: 'Badagry, Freedom Park', category: 'explore' as const, icon: '🏰' },
  ];

  exploreItems.forEach(item => {
    results.push({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      icon: item.icon,
      action: 'view_explore',
      data: item,
      score: 0
    });
  });

  return results;
}

export function searchIndex(
  index: SearchResult[],
  query: string
): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = index.map(item => {
    let score = 0;
    
    score += scoreText(item.title, tokens, 10);
    score += scoreText(item.subtitle, tokens, 5);
    
    if (item.data) {
      if (item.category === 'stay' && item.data.title) {
        score += scoreListing(item.data, tokens);
      } else if (item.category === 'experience' && item.data.title) {
        score += scoreBundle(item.data, tokens);
      } else if (item.category === 'assist' && item.data.title) {
        score += scoreVIPService(item.data, tokens);
      }
    }

    SEARCH_CATEGORIES.forEach(cat => {
      if (cat.id === item.category) {
        score += scoreText(cat.label, tokens, 3);
        cat.items.forEach(subItem => {
          score += scoreText(subItem, tokens, 2);
        });
      }
    });

    return { ...item, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function getCategorySuggestions(query: string): SearchCategory[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return SEARCH_CATEGORIES;

  return SEARCH_CATEGORIES.filter(cat => {
    const labelScore = scoreText(cat.label, tokens, 1);
    const itemsScore = cat.items.reduce((sum, item) => sum + scoreText(item, tokens, 1), 0);
    return labelScore + itemsScore > 0;
  });
}

export function getSearchHistory(): string[] {
  try {
    const history = localStorage.getItem('cozy_lagos_search_history');
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string): void {
  try {
    const history = getSearchHistory();
    const updated = [query, ...history.filter(h => h !== query)].slice(0, 10);
    localStorage.setItem('cozy_lagos_search_history', JSON.stringify(updated));
  } catch {
    // Silent fail
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem('cozy_lagos_search_history');
  } catch {
    // Silent fail
  }
}
