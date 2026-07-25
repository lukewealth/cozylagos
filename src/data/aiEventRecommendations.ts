import { LagosEvent } from '../types';

const LAGOS_EVENT_RECOMMENDATIONS: Record<string, Partial<LagosEvent>[]> = {
  concert: [
    {
      title: 'Afrobeats Festival 2026',
      description: 'The biggest Afrobeats music festival featuring top artists from across Africa and the diaspora. Experience the rhythm of Lagos with live performances, food vendors, and VIP areas.',
      category: 'festival',
      date: '2026-07-15',
      location: 'Eko Convention Centre, Victoria Island',
      price: '₦25,000 - ₦150,000',
      pricePerTicket: 25000,
      ticketsAvailable: 5000,
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop'],
      highlights: ['Top artists', '3-day event', 'Food vendors', 'VIP areas'],
      tags: ['afrobeats', 'music', 'festival', 'live-music'],
      isTrending: true,
    },
    {
      title: 'Lagos Jazz Festival',
      description: 'An intimate evening of smooth jazz featuring local and international artists at the iconic Terra Kulture.',
      category: 'concert',
      date: '2026-08-05',
      location: 'Terra Kulture, Victoria Island',
      price: '₦15,000 - ₦50,000',
      pricePerTicket: 15000,
      ticketsAvailable: 300,
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop'],
      highlights: ['Live jazz', 'Intimate setting', 'Fine dining', 'Networking'],
      tags: ['jazz', 'live-music', 'culture'],
      isTrending: false,
    },
    {
      title: 'Gidi Culture Festival 2026',
      description: 'Nigeria\'s premier music and arts festival. Three days of non-stop entertainment with the biggest names in Afrobeats, hip-hop, and R&B.',
      category: 'festival',
      date: '2026-06-20',
      location: 'Elegushi Beach, Lagos',
      price: '₦30,000 - ₦200,000',
      pricePerTicket: 30000,
      ticketsAvailable: 10000,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop'],
      highlights: ['3 days', '50+ artists', 'Beach venue', 'Art installations'],
      tags: ['afrobeats', 'festival', 'beach', 'culture'],
      isTrending: true,
    },
  ],
  nightlife: [
    {
      title: 'Beach Party Series',
      description: 'Weekly beach parties every weekend at Elegushi Beach with live DJs, fire dancers, and the best nightlife experience in Lagos.',
      category: 'nightlife',
      date: 'Every Saturday',
      location: 'Elegushi Beach, Lekki',
      price: '₦5,000 - ₦20,000',
      pricePerTicket: 5000,
      ticketsAvailable: 2000,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop'],
      highlights: ['Live DJs', 'Beach setting', 'Fire dancers', 'Night swimming'],
      tags: ['beach', 'party', 'nightlife', 'weekly'],
      isTrending: true,
    },
    {
      title: 'Quilox VIP Night',
      description: 'Exclusive VIP night at Lagos\' most prestigious nightclub. Bottle service, live band, and celebrity sightings.',
      category: 'nightlife',
      date: 'Every Friday',
      location: 'Quilox Nightclub, Victoria Island',
      price: '₦50,000 - ₦500,000',
      pricePerTicket: 50000,
      ticketsAvailable: 200,
      image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=600&fit=crop'],
      highlights: ['VIP tables', 'Bottle service', 'Live band', 'Celebrity guests'],
      tags: ['vip', 'nightclub', 'exclusive', 'luxury'],
      isTrending: true,
    },
    {
      title: 'Cubana Lagos Weekend',
      description: 'The ultimate weekend party experience at Cubana. World-class DJs, stunning views, and unmatched energy.',
      category: 'nightlife',
      date: 'Every Friday & Saturday',
      location: 'Cubana Lagos, Eko Atlantic',
      price: '₦10,000 - ₦100,000',
      pricePerTicket: 10000,
      ticketsAvailable: 1000,
      image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f25cc?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1571266028243-e4733b0f25cc?w=800&h=600&fit=crop'],
      highlights: ['Ocean view', 'World-class DJs', 'VIP sections', 'Premium bar'],
      tags: ['nightclub', 'ocean-view', 'party', 'luxury'],
      isTrending: true,
    },
  ],
  conference: [
    {
      title: 'Tech Conference Lagos 2026',
      description: 'Leading technology conference with keynotes from industry leaders, workshops, and exhibitions on innovation in Africa.',
      category: 'conference',
      date: '2026-09-10',
      location: 'Landmark Centre, Victoria Island',
      price: '₦75,000 - ₦300,000',
      pricePerTicket: 75000,
      ticketsAvailable: 1000,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'],
      highlights: ['Keynote speakers', 'Workshops', 'Exhibition hall', 'Networking'],
      tags: ['tech', 'conference', 'innovation', 'networking'],
      isTrending: true,
    },
    {
      title: 'Lagos Business Summit',
      description: 'Connect with top entrepreneurs, investors, and business leaders at Lagos\' premier business networking event.',
      category: 'conference',
      date: '2026-08-15',
      location: 'Eko Hotels & Suites, Victoria Island',
      price: '₦100,000 - ₦500,000',
      pricePerTicket: 100000,
      ticketsAvailable: 500,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop'],
      highlights: ['Investor meetings', 'Pitch competitions', 'Mentorship', 'Deal-making'],
      tags: ['business', 'entrepreneurship', 'investing', 'networking'],
      isTrending: false,
    },
    {
      title: 'Startup Pitch Night',
      description: 'Monthly pitch event where Lagos\'s hottest startups compete for funding and mentorship from top VCs.',
      category: 'conference',
      date: 'Last Thursday monthly',
      location: 'Co-Creation Hub, Yaba',
      price: '₦5,000 - ₦15,000',
      pricePerTicket: 5000,
      ticketsAvailable: 200,
      image: 'https://images.unsplash.com/photo-1559223607-a43c990c6923?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1559223607-a43c990c6923?w=800&h=600&fit=crop'],
      highlights: ['Startup pitches', 'VC panel', 'Networking', 'Prizes'],
      tags: ['startups', 'pitch', 'funding', 'monthly'],
      isTrending: false,
    },
  ],
  exhibition: [
    {
      title: 'Lagos Fashion Week 2026',
      description: 'Premier fashion event showcasing African designers, runway shows, and industry networking. The biggest fashion event in West Africa.',
      category: 'exhibition',
      date: '2026-08-20',
      location: 'Federal Palace Hotel, Victoria Island',
      price: '₦50,000 - ₦250,000',
      pricePerTicket: 50000,
      ticketsAvailable: 800,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'],
      highlights: ['Runway shows', 'Designer showcases', 'Networking', 'After-parties'],
      tags: ['fashion', 'runway', 'designers', 'luxury'],
      isTrending: true,
    },
    {
      title: 'Art Exhibition: Contemporary Lagos',
      description: 'Curated exhibition of contemporary Nigerian art featuring emerging and established artists from across Lagos.',
      category: 'exhibition',
      date: '2026-06-01 to 2026-06-30',
      location: 'Nike Art Gallery, Lekki',
      price: 'Free entry',
      pricePerTicket: 0,
      ticketsAvailable: 0,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop'],
      highlights: ['Local artists', 'Guided tours', 'Art workshops', 'Gift shop'],
      tags: ['art', 'exhibition', 'contemporary', 'free'],
      isTrending: false,
    },
    {
      title: 'Lagos Photo Festival',
      description: 'Annual photography festival showcasing works from African and international photographers. Exhibitions, talks, and workshops.',
      category: 'exhibition',
      date: '2026-10-15',
      location: 'Muson Centre, Onikan',
      price: '₦10,000 - ₦30,000',
      pricePerTicket: 10000,
      ticketsAvailable: 500,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop'],
      highlights: ['Photo exhibitions', 'Talks', 'Workshops', 'Book launches'],
      tags: ['photography', 'art', 'festival', 'annual'],
      isTrending: false,
    },
  ],
  festival: [
    {
      title: 'Lagos Food Festival',
      description: 'Celebrate Nigerian cuisine with food stalls, cooking demonstrations, and cultural performances. A feast for all senses.',
      category: 'festival',
      date: '2026-10-05',
      location: 'Freedom Park, Lagos Island',
      price: '₦10,000 - ₦50,000',
      pricePerTicket: 10000,
      ticketsAvailable: 3000,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'],
      highlights: ['Food stalls', 'Cooking demos', 'Cultural performances', 'Kids zone'],
      tags: ['food', 'festival', 'culture', 'family'],
      isTrending: true,
    },
    {
      title: 'Eyo Festival Lagos',
      description: 'Experience the colorful Eyo festival, a traditional Lagos cultural celebration with masquerades, music, and dance.',
      category: 'festival',
      date: '2026-11-20',
      location: 'Lagos Island',
      price: 'Free entry',
      pricePerTicket: 0,
      ticketsAvailable: 0,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop'],
      highlights: ['Masquerades', 'Traditional music', 'Dance', 'Cultural heritage'],
      tags: ['culture', 'traditional', 'festival', 'free'],
      isTrending: false,
    },
  ],
  weekly: [
    {
      title: 'Jazz Night Fridays',
      description: 'Weekly jazz nights featuring the best local jazz musicians. Smooth vibes, great food, and cocktails.',
      category: 'weekly',
      date: 'Every Friday',
      location: 'The RSVP, Victoria Island',
      price: '₦10,000 - ₦25,000',
      pricePerTicket: 10000,
      ticketsAvailable: 100,
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop'],
      highlights: ['Live jazz', 'Cocktails', 'Fine dining', 'Intimate setting'],
      tags: ['jazz', 'weekly', 'friday', 'dining'],
      isTrending: false,
    },
    {
      title: 'Sunday Brunch & Groove',
      description: 'Lazy Sunday brunch with live music, unlimited drinks, and a buffet of Nigerian and continental dishes.',
      category: 'weekly',
      date: 'Every Sunday',
      location: 'The Place Restaurant, Lekki',
      price: '₦15,000 - ₦35,000',
      pricePerTicket: 15000,
      ticketsAvailable: 150,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'],
      highlights: ['Buffet brunch', 'Live music', 'Unlimited drinks', 'Family-friendly'],
      tags: ['brunch', 'sunday', 'weekly', 'family'],
      isTrending: false,
    },
  ],
};

export function getAIEventRecommendations(category?: string): Partial<LagosEvent>[] {
  if (category && LAGOS_EVENT_RECOMMENDATIONS[category]) {
    return LAGOS_EVENT_RECOMMENDATIONS[category];
  }
  
  const allEvents: Partial<LagosEvent>[] = [];
  for (const events of Object.values(LAGOS_EVENT_RECOMMENDATIONS)) {
    allEvents.push(...events);
  }
  return allEvents;
}

export function getTrendingEvents(): Partial<LagosEvent>[] {
  const allEvents = getAIEventRecommendations();
  return allEvents.filter(e => e.isTrending);
}

export function getEventsByCategory(category: string): Partial<LagosEvent>[] {
  return LAGOS_EVENT_RECOMMENDATIONS[category] || [];
}

export function searchEvents(query: string): Partial<LagosEvent>[] {
  const allEvents = getAIEventRecommendations();
  const lowerQuery = query.toLowerCase();
  return allEvents.filter(e =>
    e.title?.toLowerCase().includes(lowerQuery) ||
    e.description?.toLowerCase().includes(lowerQuery) ||
    e.location?.toLowerCase().includes(lowerQuery) ||
    e.tags?.some(t => t.toLowerCase().includes(lowerQuery))
  );
}
