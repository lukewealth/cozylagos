import { Listing, Booking, Transaction, ChatMessage, Service } from "./types";

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: "bourdillon-penthouse",
    title: "The Bourdillon Penthouse",
    description: "A breathtaking, futuristic duplex penthouse in the absolute heart of Ikoyi, Lagos. Features extensive double-height glass facades that offer pure 180-degree panoramic sweeps of the Victoria Island skyline and the glittering lagoon below at sunset.",
    category: "Penthouse",
    location: "Ikoyi",
    bedrooms: 4,
    bathrooms: 4.5,
    maxGuests: 8,
    squareFootage: 5500,
    nightlyRate: 450000,
    weekendPremium: 15,
    cleaningFee: 25000,
    securityDeposit: 150000,
    image: "/assets/images/vertical/IMG-20260621-WA0039.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0164.jpg", "/assets/images/vertical/IMG-20260621-WA0039.jpg"],
    amenities: ["24/7 Power", "Infinity Pool", "Private Chef", "Concierge", "High-Speed Wi-Fi", "Private Gym"],
    keywords: ["penthouse", "duplex", "ikoyi", "panoramic", "lagoon", "skyline", "luxury", "futuristic", "glass", "sunset", "pool", "gym", "chef", "concierge", "high-rise", "executive", "premium", "bourdillon"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 32,
    rating: 4.9,
    aiMatchPercent: 98,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4541,
    lng: 3.4390
  },
  {
    id: "lagoon-view-villa",
    title: "Lagoon View Villa",
    description: "Set directly on the private shoreline of Banana Island, this striking architectural achievement merges concrete facades with a tropical courtyard. Complete with an infinity lap pool that spills into the serene lagoon waters.",
    category: "Luxury Villa",
    location: "Banana Island",
    bedrooms: 5,
    bathrooms: 6.0,
    maxGuests: 10,
    squareFootage: 8000,
    nightlyRate: 650000,
    weekendPremium: 15,
    cleaningFee: 35000,
    securityDeposit: 250000,
    image: "/assets/images/vertical/IMG-20260621-WA0041.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0173.jpg", "/assets/images/vertical/IMG-20260621-WA0041.jpg"],
    amenities: ["24/7 Power", "Infinity Pool", "Private Chef", "Concierge", "High-Speed Wi-Fi", "Yacht Access", "Wine Cellar"],
    keywords: ["villa", "banana island", "lagoon", "shoreline", "infinity pool", "tropical", "courtyard", "luxury", "waterfront", "yacht", "wine", "exclusive", "private", "architectural"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 18,
    rating: 4.8,
    aiMatchPercent: 94,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4467,
    lng: 3.4125
  },
  {
    id: "eko-loft",
    title: "The Eko Loft Sanctuary",
    description: "An exceptional, industrially inspired loft featuring towering double-height concrete ceilings and immense black frame ironmongery windows. Placed securely within upscale Victoria Island.",
    category: "Executive Studio",
    location: "Victoria Island",
    bedrooms: 2,
    bathrooms: 2.0,
    maxGuests: 4,
    squareFootage: 2500,
    nightlyRate: 250000,
    weekendPremium: 10,
    cleaningFee: 15000,
    securityDeposit: 80000,
    image: "/assets/images/vertical/IMG-20260621-WA0041.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0038.jpg", "/assets/images/vertical/IMG-20260621-WA0041.jpg"],
    amenities: ["24/7 Power", "High-Speed Wi-Fi", "Concierge", "Safety-pact Lock system", "Acoustic Shielding"],
    keywords: ["loft", "studio", "victoria island", "industrial", "concrete", "iron", "executive", "urban", "modern", "secure", "acoustic", "double-height", "ceiling"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 45,
    rating: 4.7,
    aiMatchPercent: 91,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4281,
    lng: 3.4241
  },
  {
    id: "ekpo-apartment",
    title: "Ekpo - Luxury 1-Bedroom",
    description: "Our Unique Studio Bedroom Apartment with Swimming Pool, Smartlock Door, complimentary breakfast, and Gym",
    category: "Serviced Apartment",
    location: "Lekki Phase 1",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    squareFootage: 1200,
    nightlyRate: 180000,
    weekendPremium: 15,
    cleaningFee: 15000,
    securityDeposit: 50000,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
    amenities: ["24/7 Power Supply", "Treated Water Supply", "High-Profile Security", "Unlimited Internet", "DSTV & Netflix", "Housekeeping Service", "Swimming Pool", "Fully Equipped Gym"],
    keywords: ["1br", "studio", "lekki", "pool", "gym", "smartlock", "breakfast", "serviced", "furnished", "security", "netflix", "dstv"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 12,
    rating: 4.8,
    aiMatchPercent: 95,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4333,
    lng: 3.4667
  },
  {
    id: "studio-lekki-130k",
    title: "Studio Suite with Pool",
    description: "Unique Studio Bedroom Apartment with Swimming Pool, Smartlock Door, complimentary breakfast, and Gym",
    category: "Serviced Apartment",
    location: "Lekki Phase 1",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    squareFootage: 900,
    nightlyRate: 130000,
    weekendPremium: 10,
    cleaningFee: 10000,
    securityDeposit: 40000,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["Swimming Pool", "Smartlock Door", "Complimentary Breakfast", "Fully Equipped Gym", "24/7 Power", "Housekeeping"],
    keywords: ["studio", "pool", "lekki", "budget", "breakfast", "gym", "smartlock", "serviced", "1br", "affordable"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 9,
    rating: 4.7,
    aiMatchPercent: 89,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4350,
    lng: 3.4680
  },
  {
    id: "whitestone-2br",
    title: "Whitestone - Luxury 2BR",
    description: "Luxury 2bedroom Apartment with swimming pool",
    category: "Luxury Villa",
    location: "Lekki Phase 1",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    squareFootage: 1800,
    nightlyRate: 270000,
    weekendPremium: 15,
    cleaningFee: 20000,
    securityDeposit: 100000,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"],
    amenities: ["Swimming Pool", "Luxury Living"],
    keywords: ["2br", "lekki", "pool", "luxury", "villa", "whitestone", "swimming", "family"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 8,
    rating: 4.7,
    aiMatchPercent: 90,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4340,
    lng: 3.4690
  },
  {
    id: "maisonette-lekki",
    title: "Lekki Maisonette",
    description: "Newly opened 2bedroom Maisonette apartment Located at off freedom way babalola garden street",
    category: "Serviced Apartment",
    location: "Lekki Phase 1",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    squareFootage: 2200,
    nightlyRate: 210000,
    weekendPremium: 10,
    cleaningFee: 25000,
    securityDeposit: 120000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"],
    amenities: ["Gated and Secured Estate", "24-hour Electricity", "24-hour Safety & Security", "Guest Parking Space", "Smart TV & Netflix", "Superfast Internet", "standard gym house", "Standard Swimming Pool", "standard outdoor table tennis", "Chef on request", "Spacious Living Areas & Private Balcony", "High-Quality Bedding and Linens", "Washing Machine", "Bespoke Interior Decoration", "Netflix", "Prime video", "Elevator", "Ps5", "Cleaning services"],
    keywords: ["maisonette", "2br", "lekki", "freedom way", "babalola", "garden", "pool", "gym", "ps5", "elevator", "chef", "netflix", "prime video", "table tennis", "balcony", "gated", "secure"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 5,
    rating: 4.9,
    aiMatchPercent: 97,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4360,
    lng: 3.4650
  },
  {
    id: "victoria-penthouse",
    title: "Victoria Penthouse",
    description: "Luxury 3 bedroom penthouse with cinema",
    category: "Penthouse",
    location: "Victoria Island",
    bedrooms: 3,
    bathrooms: 3.5,
    maxGuests: 6,
    squareFootage: 3500,
    nightlyRate: 380000,
    weekendPremium: 20,
    cleaningFee: 30000,
    securityDeposit: 200000,
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80"],
    amenities: ["Gated and Secured Estate", "24/7 Power Supply", "Serene environment", "Smart Lock", "Very fast internet", "Netflix / YouTube / Dstv", "Snooker Board", "Swimming pool", "Gym", "En-suite room with Balcony", "Cinema", "Ocean/ Cite view", "Daily housekeeping", "Dedicated car park space", "Equipped kitchen", "Washing Machine", "Tastefully furnished"],
    keywords: ["penthouse", "3br", "victoria island", "cinema", "snooker", "pool", "gym", "ocean view", "balcony", "luxury", "premium", "housekeeping"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 22,
    rating: 5.0,
    aiMatchPercent: 99,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4290,
    lng: 3.4250
  },
  {
    id: "oniru-serviced-1br",
    title: "Oniru Serviced Apartment",
    description: "A fully furnished 1 bedroom serviced apartment",
    category: "Serviced Apartment",
    location: "Victoria Island",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    squareFootage: 1100,
    nightlyRate: 180000,
    weekendPremium: 10,
    cleaningFee: 10000,
    securityDeposit: 40000,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80"],
    amenities: ["24/7 Power supply", "24/7 Treated water supply", "24/7 High profile security", "Highspeed broadband internet", "Netflix", "Smart TV's", "DSIV", "Housekeeping"],
    keywords: ["1br", "oniru", "victoria island", "serviced", "furnished", "security", "netflix", "smart tv", "budget", "studio"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 15,
    rating: 4.6,
    aiMatchPercent: 92,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4310,
    lng: 3.4320
  },
  {
    id: "cozy-2br-admiralty",
    title: "Cozy Admiralty 2BR",
    description: "Cozy 2bedroom apartment Available Today admiralty lekki phase1",
    category: "Serviced Apartment",
    location: "Lekki Phase 1",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    squareFootage: 1600,
    nightlyRate: 190000,
    weekendPremium: 15,
    cleaningFee: 15000,
    securityDeposit: 70000,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80", "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80"],
    amenities: ["24/7 Electricity", "Smart TVs", "24/7 security", "Estate pool and gym", "Board games", "Fully equipped and fitted kitchen", "Dedicated fiber internet", "Washing machine", "Cooking spices", "Smart lock", "Fully Air-conditioned home", "Clean running water", "Elevators", "Yoga mat", "Work table and chair", "Pool toys"],
    keywords: ["2br", "admiralty", "lekki", "cozy", "pool", "gym", "board games", "yoga", "family", "kitchen", "elevator", "smart lock"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 28,
    rating: 4.8,
    aiMatchPercent: 94,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4370,
    lng: 3.4640
  },
  {
    id: "luxury-2br-admiralty",
    title: "Admiralty Luxury 2BR",
    description: "Luxury 2bedroom apartment admiralty lekki 1 available",
    category: "Luxury Villa",
    location: "Lekki Phase 1",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    squareFootage: 1900,
    nightlyRate: 240000,
    weekendPremium: 15,
    cleaningFee: 20000,
    securityDeposit: 100000,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80", "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80"],
    amenities: ["Gated and Secured Estate", "Superfast WiFi", "24/7 Power Supply", "24/7 Security", "Swimming pool", "Smart TVs", "En-suite rooms", "Housekeeping", "Chef on demand", "Dedicated car park", "Fully equipped kitchen", "Washing machine", "Balcony sit out", "Tastefully furnished"],
    keywords: ["2br", "admiralty", "lekki", "luxury", "pool", "chef", "balcony", "gated", "secure", "wifi", "housekeeping"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 19,
    rating: 4.9,
    aiMatchPercent: 96,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4380,
    lng: 3.4630
  },
  {
    id: "ikoyi-executive-3br",
    title: "Ikoyi Executive 3BR",
    description: "Spacious 3 bedroom executive apartment in the heart of Ikoyi with panoramic lagoon views and premium finishes throughout",
    category: "Luxury Villa",
    location: "Ikoyi",
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    squareFootage: 2800,
    nightlyRate: 320000,
    weekendPremium: 15,
    cleaningFee: 25000,
    securityDeposit: 150000,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"],
    amenities: ["24/7 Power", "Swimming Pool", "Gym", "High-Speed Wi-Fi", "Smart TVs", "Housekeeping", "Dedicated Parking", "Balcony"],
    keywords: ["3br", "ikoyi", "executive", "lagoon view", "panoramic", "pool", "gym", "balcony", "premium", "spacious"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 14,
    rating: 4.8,
    aiMatchPercent: 93,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4550,
    lng: 3.4380
  },
  {
    id: "vi-oceanview-2br",
    title: "VI Oceanview 2BR",
    description: "Modern 2 bedroom apartment with stunning ocean views in Victoria Island, fully furnished with luxury amenities",
    category: "Serviced Apartment",
    location: "Victoria Island",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    squareFootage: 1700,
    nightlyRate: 220000,
    weekendPremium: 10,
    cleaningFee: 15000,
    securityDeposit: 80000,
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"],
    amenities: ["Ocean View", "24/7 Power", "Smart TVs", "Netflix", "High-Speed Wi-Fi", "Gym", "Security", "Housekeeping"],
    keywords: ["2br", "victoria island", "ocean view", "modern", "furnished", "netflix", "gym", "security"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 21,
    rating: 4.7,
    aiMatchPercent: 90,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4270,
    lng: 3.4230
  },
  {
    id: "lekki-garden-1br",
    title: "Lekki Garden 1BR",
    description: "Cozy 1 bedroom apartment in a serene Lekki estate with garden views, perfect for business travelers and couples",
    category: "Serviced Apartment",
    location: "Lekki Phase 1",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    squareFootage: 1000,
    nightlyRate: 150000,
    weekendPremium: 10,
    cleaningFee: 10000,
    securityDeposit: 50000,
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["Garden View", "24/7 Power", "Security", "Wi-Fi", "Smart TV", "Housekeeping", "Pool Access", "Gym"],
    keywords: ["1br", "lekki", "garden", "cozy", "business", "couple", "serene", "estate", "pool", "gym", "budget"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 17,
    rating: 4.6,
    aiMatchPercent: 88,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4320,
    lng: 3.4700
  },
  {
    id: "oniru-premium-3br",
    title: "Oniru Premium 3BR",
    description: "Luxurious 3 bedroom apartment in Oniru with premium furnishings, cinema room, and access to exclusive estate facilities",
    category: "Penthouse",
    location: "Victoria Island",
    bedrooms: 3,
    bathrooms: 3.5,
    maxGuests: 6,
    squareFootage: 3200,
    nightlyRate: 350000,
    weekendPremium: 20,
    cleaningFee: 30000,
    securityDeposit: 180000,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"],
    amenities: ["Cinema Room", "24/7 Power", "Swimming Pool", "Gym", "Smart Lock", "High-Speed Wi-Fi", "Housekeeping", "Dedicated Parking"],
    keywords: ["3br", "oniru", "victoria island", "cinema", "premium", "luxury", "pool", "gym", "smart lock", "exclusive", "estate"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 11,
    rating: 4.9,
    aiMatchPercent: 95,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    lat: 6.4300,
    lng: 3.4310
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "chef-service",
    title: "Private Gourmet Chef",
    description: "Personalized culinary experiences featuring local West African gourmet fusion or custom continental diets.",
    price: 30000,
    category: "Dining",
    providerId: "emeka-anene",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000",
    rating: 4.9
  },
  {
    id: "chauffeur-service",
    title: "Executive Chauffeur",
    description: "Bulletproof executive SUV or private luxury sedan with a vetted professional security chauffeur.",
    price: 120000,
    category: "Transport",
    providerId: "emeka-anene",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000",
    rating: 4.8
  },
  {
    id: "yacht-charter",
    title: "Luxury Yacht Charter",
    description: "65ft private luxury yacht experience featuring custom 6-hour charters and sunset cruising.",
    price: 500000,
    category: "Experiences",
    providerId: "emeka-anene",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1000",
    rating: 5.0
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "booking-01",
    listingId: "bourdillon-penthouse",
    listingTitle: "The Bourdillon Penthouse",
    guestId: "alex-sterling",
    guestName: "Alexander Sterling",
    guestEmail: "alex@sterlingholdings.com",
    guestAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChO__jpr70PBuRfnq-BQBd5gWupLLFUTveVncrizosRGPnEKwyHQoENzgCg9lwfnKYOEM7t7cKhrxteYnQmMCPCT6fQiQhw0t5x_oyWaDcgpF6YVWQbFEqVsbRYkLo5jeNWRChx-mVO8ogBC_FOKOHv6-xLPrZeGqBTzy9SST378Rfx0ud7ubpuCc9pG_6KQSvtogIK9kbjtONB7EkpsMQcX3gIGzOMqtwgdxiG_aXaJN_AYuzaZ_bhvFIN5-cXDVzwd9AW4Sl1pM2",
    checkIn: "2026-06-25",
    checkOut: "2026-07-02",
    guestsCount: 4,
    status: "Confirmed" as any,
    totalAmount: 3150000,
    chefAdded: true,
    photographerAdded: false,
    jetskiAdded: true,
    services: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "booking-02",
    listingId: "lagoon-view-villa",
    listingTitle: "Lagoon View Villa",
    guestId: "sarah-jenkins",
    guestName: "Sarah Jenkins",
    guestEmail: "sjenkins@media-arts.co",
    guestAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9lTotMd2RIFjd-3xeK4mO_pmn_YYNyDArzN4tfbFqP4RQklnVe0rYjO7FozZUN0q1OWa3DeOu-ssQ3pyzcns_p3HivAPKLD29383WGDgK7lr1wXrwFiOhXyQL0XWXIpa6C-M3iqJWUVSZG7u5maEXPdRpMTZz4hyhjRB2ciQ2NIYsmPTdywDAsBFkZ7-a_KkFgu73NjCA6ligR5O66nIl54t-AJSB4ttEwiRBH9ARqWh0YB7Af1tO_9g0HQ3eJmKCryEixQ-8-PF",
    checkIn: "2026-07-10",
    checkOut: "2026-07-16",
    guestsCount: 6,
    status: "Pending" as any,
    totalAmount: 3900000,
    chefAdded: true,
    photographerAdded: true,
    jetskiAdded: false,
    services: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "booking-03",
    listingId: "eko-loft",
    listingTitle: "The Eko Loft Sanctuary",
    guestId: "chuka-obi",
    guestName: "Chuka Obi",
    guestEmail: "chuka@obi-studios.ng",
    guestAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9Lh8rkEuZ0WtuD5WIDKt8X-Rcw_hkbPJc4me77k4fCkgvj7bw8uS_oG_i5TwGhETMSGEO8280C-iff0nUzqzM2S4kHFg5mbfWBJzan8ih4yEEtAdcVGRBSr9E2D2cIGqu5JReEW10IA7NXk6m7U63tChmAPXFuSi8NBKZZRkEVk2H9wgx0RHOtyObOSAqG24z8-V2mImw29UWFWmSYElo66Yb3acIv983sY0rqYphNg18jA9VNHTqWG9_nxNvLH1FbtnxRmPijH",
    checkIn: "2026-06-22",
    checkOut: "2026-06-25",
    guestsCount: 2,
    status: "Confirmed" as any,
    totalAmount: 750000,
    chefAdded: false,
    photographerAdded: false,
    jetskiAdded: false,
    services: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-01",
    date: "2026-06-21",
    reference: "CL-TX8924",
    type: "Booking Revenue",
    amount: 1200000,
    status: "Processed",
    description: "Lagoon View Villa booking - Sarah Jenkins",
    userId: "emeka-anene",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "tx-02",
    date: "2026-06-20",
    reference: "CL-TX8921",
    type: "Payout",
    amount: -2500000,
    status: "Processed",
    description: "GTBank withdrawal to account ending in **3492",
    userId: "emeka-anene",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "tx-03",
    date: "2026-06-18",
    reference: "CL-TX8901",
    type: "Booking Revenue",
    amount: 3150000,
    status: "Processed",
    description: "The Bourdillon Penthouse booking - Alexander Sterling",
    userId: "emeka-anene",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "tx-04",
    date: "2026-06-15",
    reference: "CL-TX8875",
    type: "Booking Revenue",
    amount: 450000,
    status: "Processed",
    description: "The Eko Loft booking - Amina Alabi",
    userId: "emeka-anene",
    createdAt: "2024-01-01T00:00:00Z"
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-01",
    sender: "concierge",
    text: "Good morning, Alexander. I have verified your upcoming stay at The Bourdillon Penthouse in Ikoyi. Would you like me to pre-book key airport transfers or assign a private chef for your arrival evening?",
    timestamp: "8:30 AM"
  }
];

export interface BundleTier {
  duration: string;
  nights: number;
  price: number;
  components: { name: string; cost: number; notes: string }[];
}

export interface BundleActivity {
  name: string;
  description: string;
  icon: string;
  duration: string;
  included: boolean;
}

export interface ServiceBundle {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  tiers: BundleTier[];
  activities: BundleActivity[];
  highlights: string[];
}

export const SERVICE_BUNDLES: ServiceBundle[] = [
  {
    id: "business-bundle",
    title: "Business Bundle",
    tagline: "Corporate Executive",
    description: "Designed for the corporate leader who requires zero distractions and maximum efficiency.",
    icon: "briefcase",
    image: "https://images.unsplash.com/photo-1611955167808-29e026258bf8?w=800&q=80",
    highlights: [
      "24/7 Dedicated IT Support",
      "Executive SUV with Chauffeur",
      "Premium Workspace Setup",
      "Personal Concierge Assistant",
      "VIP Airport Fast-Track",
      "Executive Dining Included"
    ],
    activities: [
      { name: "Executive Workspace Setup", description: "Full office equipment with high-speed internet, monitor, and ergonomic setup", icon: "monitor", duration: "Day 1", included: true },
      { name: "Airport VIP Transfer", description: "Meet & greet service with fast-track immigration and luxury vehicle transfer", icon: "plane", duration: "Arrival", included: true },
      { name: "Business District Tours", description: "Guided tours of Lekki, VI, and Ikoyi business districts with networking introductions", icon: "building", duration: "Day 2", included: true },
      { name: "Executive Dining Experience", description: "Reservations at Lagos' top business dining venues with private rooms", icon: "utensils", duration: "Daily", included: true },
      { name: "IT Infrastructure Setup", description: "Dedicated technician for network, hardware, and software configuration", icon: "wifi", duration: "Day 1", included: true },
      { name: "Golf & Networking", description: "Access to Ikoyi Club and Eko Atlantic golf courses for business networking", icon: "golf", duration: "Flexible", included: true }
    ],
    tiers: [
      {
        duration: "3 Days",
        nights: 3,
        price: 1650000,
        components: [
          { name: "Apartment (3 nights)", cost: 360000, notes: "Standard 1-BR @ ₦120,000/night in Lekki Phase 1" },
          { name: "Airport transfer (round)", cost: 60000, notes: "LOS → Lekki @ ₦25,000–₦45,000 each way" },
          { name: "IT support (24/7, 3 days)", cost: 180000, notes: "Basic remote support package" },
          { name: "Workspace setup", cost: 150000, notes: "Desk, chair, monitor rental" },
          { name: "Land Cruiser Prado + driver", cost: 300000, notes: "SUV with driver @ ₦50,000–₦120,000/day" },
          { name: "Concierge services", cost: 150000, notes: "Daily errands & assistance" },
          { name: "Meals & incidentals", cost: 450000, notes: "₦150,000/day for executive dining" }
        ]
      },
      {
        duration: "7 Days",
        nights: 7,
        price: 6000000,
        components: [
          { name: "Apartment (7 nights)", cost: 980000, notes: "Premium 2-BR @ ₦140,000/night in Lekki" },
          { name: "Airport transfer (round)", cost: 70000, notes: "VIP vehicle + meet & greet" },
          { name: "IT support (24/7, 7 days)", cost: 490000, notes: "On-call technician + hardware backup" },
          { name: "Workspace setup", cost: 300000, notes: "Full office equipment + high-speed internet" },
          { name: "Land Cruiser Prado + driver", cost: 700000, notes: "Full-day SUV @ ₦100,000/day" },
          { name: "Concierge services", cost: 350000, notes: "24/7 personal assistant" },
          { name: "Meals & incidentals", cost: 1050000, notes: "₦150,000/day" },
          { name: "Misc buffer", cost: 2060000, notes: "Unforeseen expenses & premium services" }
        ]
      },
      {
        duration: "21 Days",
        nights: 21,
        price: 27000000,
        components: [
          { name: "Apartment (21 nights)", cost: 4200000, notes: "Luxury 3-BR in Victoria Island @ ₦200,000/night" },
          { name: "Airport transfer (round)", cost: 120000, notes: "VIP concierge + fast-track" },
          { name: "IT support (24/7, 21 days)", cost: 1500000, notes: "Dedicated IT specialist" },
          { name: "Workspace setup", cost: 800000, notes: "Premium executive office" },
          { name: "Land Cruiser Prado + driver", cost: 2100000, notes: "₦100,000/day" },
          { name: "Concierge services", cost: 1500000, notes: "Full-time personal assistant" },
          { name: "Meals & incidentals", cost: 3150000, notes: "₦150,000/day" },
          { name: "Misc & premium buffer", cost: 13630000, notes: "Executive perks & contingencies" }
        ]
      }
    ]
  },
  {
    id: "diaspora-bundle",
    title: "Diaspora Bundle",
    tagline: "Reconnect with Lagos",
    description: "Reconnect with Lagos, beautifully.",
    icon: "globe",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    highlights: [
      "Private Cultural Tour Guide",
      "Professional Photography Sessions",
      "Curated Food & Street Tours",
      "Historic Lagos Island Exploration",
      "Beach Day Setup & Activities",
      "SIM Card & Connectivity Ready"
    ],
    activities: [
      { name: "Lagos Heritage Walking Tour", description: "Explore historic Lagos Island, National Museum, and colonial architecture with expert guide", icon: "landmark", duration: "Day 1", included: true },
      { name: "Nike Art Gallery Visit", description: "Private guided tour of West Africa's largest art gallery with artist meet & greet", icon: "palette", duration: "Day 2", included: true },
      { name: "Lekki Conservation Centre", description: "Canopy walkway and nature reserve experience with wildlife spotting", icon: "tree", duration: "Day 2", included: true },
      { name: "Street Food Culinary Tour", description: "Taste authentic suya, akara, puff-puff, and local delicacies at hidden gems", icon: "utensils", duration: "Day 3", included: true },
      { name: "Professional Photo Session", description: "Document your Lagos journey with a professional photographer at iconic locations", icon: "camera", duration: "Day 3", included: true },
      { name: "Elegushi Beach Day", description: "Private beach setup with refreshments, water sports, and sunset experience", icon: "waves", duration: "Flexible", included: true },
      { name: "Kalakuta Museum & Shrine", description: "Visit Fela Kuti's former home and the New Afrika Shrine for live music", icon: "music", duration: "Day 4", included: true },
      { name: "Badagry Slave Route", description: "Historical tour of the first storey building and slave route relics", icon: "landmark", duration: "Full Day", included: true }
    ],
    tiers: [
      {
        duration: "3 Days",
        nights: 3,
        price: 1200000,
        components: [
          { name: "Apartment (3 nights)", cost: 420000, notes: "Cozy 2-BR in Lekki @ ₦140,000/night" },
          { name: "Airport transfer + SIM", cost: 80000, notes: "Transfer + SIM card ready on arrival" },
          { name: "Private tour guide (3 days)", cost: 150000, notes: "Local guide @ ₦50,000/day" },
          { name: "Attraction entry fees", cost: 20000, notes: "Nike Art Gallery, Lekki Conservation, etc." },
          { name: "Street food tour", cost: 50000, notes: "Curated food experiences" },
          { name: "Photographer (half-day)", cost: 200000, notes: "Professional documentation" },
          { name: "Transport (tour days)", cost: 180000, notes: "SUV with driver @ ₦60,000/day" },
          { name: "Meals", cost: 100000, notes: "₦15,000–₦40,000 for two" }
        ]
      },
      {
        duration: "7 Days",
        nights: 7,
        price: 4200000,
        components: [
          { name: "Apartment (7 nights)", cost: 1260000, notes: "2-BR in Lekki @ ₦180,000/night" },
          { name: "Airport transfer + SIM", cost: 90000, notes: "VIP pickup" },
          { name: "Private tour guide (7 days)", cost: 350000, notes: "Full-time guide" },
          { name: "Attraction & activity fees", cost: 100000, notes: "All cultural sites + workshops" },
          { name: "Street food & dining", cost: 200000, notes: "Multiple curated food tours" },
          { name: "Photographer (full 3 days)", cost: 500000, notes: "Full documentation package" },
          { name: "Transport (SUV, 7 days)", cost: 700000, notes: "₦100,000/day" },
          { name: "Meals", cost: 400000, notes: "" },
          { name: "Deep exploration logistics", cost: 300000, notes: "Historic Lagos Island + transport" },
          { name: "Beach day setup", cost: 300000, notes: "Equipment, refreshments, logistics" }
        ]
      },
      {
        duration: "21 Days",
        nights: 21,
        price: 17000000,
        components: [
          { name: "Apartment (21 nights)", cost: 4200000, notes: "Luxury 3-BR in Victoria Island" },
          { name: "Airport transfer + VIP SIM", cost: 150000, notes: "Concierge airport service" },
          { name: "Private tour guide (21 days)", cost: 1050000, notes: "Dedicated cultural expert" },
          { name: "All attraction fees", cost: 300000, notes: "Full access to all experiences" },
          { name: "Premium food tours", cost: 600000, notes: "High-end culinary experiences" },
          { name: "Photographer (full coverage)", cost: 1500000, notes: "Professional documentary photo + video" },
          { name: "Transport (SUV, 21 days)", cost: 2100000, notes: "₦100,000/day" },
          { name: "Meals (fine dining)", cost: 2100000, notes: "₦100,000/day" },
          { name: "Logistics & misc", cost: 4000000, notes: "Intercity travel, special access, contingencies" }
        ]
      }
    ]
  },
  {
    id: "tourist-bundle",
    title: "Tourist Bundle",
    tagline: "Hassle-Free Discovery",
    description: "Discover the best of Lagos, hassle-free.",
    icon: "map",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
    highlights: [
      "Curated Local Experiences",
      "Guided City Tours",
      "Transport with Driver",
      "24/7 Visitor Support",
      "All Attraction Entry Fees",
      "Daily Meal Allowance"
    ],
    activities: [
      { name: "Lagos City Highlights Tour", description: "Visit key landmarks including Lekki Bridge, Eko Atlantic, and Victoria Island waterfront", icon: "map", duration: "Day 1", included: true },
      { name: "National Museum Lagos", description: "Explore Nigerian history, art, and cultural artifacts with guided commentary", icon: "landmark", duration: "Day 2", included: true },
      { name: "Lekki Market Shopping", description: "Navigate the vibrant craft market for authentic souvenirs and handmade goods", icon: "shopping", duration: "Day 2", included: true },
      { name: "Freedom Park Concert", description: "Evening at the historic Freedom Park with live music and dining", icon: "music", duration: "Day 3", included: true },
      { name: "Tarkwa Bay Beach Trip", description: "Boat ride to the secluded beach with swimming and relaxation", icon: "waves", duration: "Flexible", included: true },
      { name: "Lagos Food Tour", description: "Sample jollof rice, egusi soup, and local delicacies at top restaurants", icon: "utensils", duration: "Day 3", included: true }
    ],
    tiers: [
      {
        duration: "3 Days",
        nights: 3,
        price: 750000,
        components: [
          { name: "Apartment (3 nights)", cost: 360000, notes: "Standard 1-BR @ ₦120,000/night" },
          { name: "Airport transfer (round)", cost: 60000, notes: "Standard car" },
          { name: "Curated local experiences", cost: 100000, notes: "1 guided tour day" },
          { name: "Transport (tour days)", cost: 120000, notes: "Camry with driver @ ₦40,000/day" },
          { name: "Attraction entry fees", cost: 15000, notes: "Key sites" },
          { name: "Meals", cost: 60000, notes: "₦20,000/day" },
          { name: "Visitor support", cost: 35000, notes: "24/7 assistance" }
        ]
      },
      {
        duration: "7 Days",
        nights: 7,
        price: 2400000,
        components: [
          { name: "Apartment (7 nights)", cost: 980000, notes: "2-BR @ ₦140,000/night" },
          { name: "Airport transfer (round)", cost: 70000, notes: "VIP vehicle" },
          { name: "Curated experiences", cost: 400000, notes: "Culture, food, sights (4 tours)" },
          { name: "Transport (SUV, 7 days)", cost: 420000, notes: "₦60,000/day" },
          { name: "Attraction fees", cost: 50000, notes: "All major sites" },
          { name: "Meals", cost: 280000, notes: "₦40,000/day for two" },
          { name: "Visitor support", cost: 200000, notes: "Full coverage" }
        ]
      },
      {
        duration: "21 Days",
        nights: 21,
        price: 9500000,
        components: [
          { name: "Apartment (21 nights)", cost: 2940000, notes: "2-BR @ ₦140,000/night" },
          { name: "Airport transfer (round)", cost: 120000, notes: "VIP concierge" },
          { name: "Curated experiences", cost: 1200000, notes: "Full itinerary (12+ tours)" },
          { name: "Transport (SUV, 21 days)", cost: 1260000, notes: "₦60,000/day" },
          { name: "Attraction & activity fees", cost: 150000, notes: "All sites + workshops" },
          { name: "Meals", cost: 1680000, notes: "₦80,000/day" },
          { name: "Visitor support", cost: 500000, notes: "Premium 24/7" },
          { name: "Misc", cost: 1650000, notes: "Special access, contingencies" }
        ]
      }
    ]
  },
  {
    id: "executive-elite",
    title: "Executive Elite",
    tagline: "Total Mobility",
    description: "Zero downtime. Total mobility.",
    icon: "crown",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    highlights: [
      "Private Jet Charter Flights",
      "Presidential Suite Accommodation",
      "C-Suite Command Center Office",
      "Close Protection Security Team",
      "Executive SUV Fleet",
      "Dedicated Admin & IT Team"
    ],
    activities: [
      { name: "Private Jet Charter", description: "Lagos-Abuja-Port Harcourt private jet flights with flexible scheduling", icon: "plane", duration: "As needed", included: true },
      { name: "Presidential Suite Check-in", description: "Victoria Island presidential suite with butler service and panoramic views", icon: "crown", duration: "Arrival", included: true },
      { name: "Executive Office Setup", description: "Full C-suite command center with video conferencing and secure communications", icon: "monitor", duration: "Day 1", included: true },
      { name: "Security Detail Assignment", description: "Close protection team with armored vehicles for all movements", icon: "shield", duration: "Full stay", included: true },
      { name: "VIP Business Meetings", description: "Arranged meetings with key Lagos business leaders and government officials", icon: "users", duration: "Scheduled", included: true },
      { name: "Fine Dining Experiences", description: "Exclusive reservations at Lagos' most prestigious restaurants with private rooms", icon: "utensils", duration: "Daily", included: true },
      { name: "Helicopter City Tour", description: "Aerial tour of Lagos skyline, Eko Atlantic, and Lekki peninsula", icon: "helicopter", duration: "Day 2", included: true },
      { name: "Yacht Charter Experience", description: "Private 80ft yacht with crew for entertainment and relaxation", icon: "anchor", duration: "Flexible", included: true }
    ],
    tiers: [
      {
        duration: "3 Days",
        nights: 3,
        price: 4500000,
        components: [
          { name: "Apartment (3 nights)", cost: 840000, notes: "Premium VI 3-BR @ ₦280,000/night" },
          { name: "Mobile office setup", cost: 1200000, notes: "Full equipment + installation" },
          { name: "24/7 IT & admin support", cost: 600000, notes: "3 days dedicated" },
          { name: "Airport VIP fast-track", cost: 150000, notes: "Concierge service" },
          { name: "Executive SUV + chauffeur", cost: 360000, notes: "₦120,000/day" },
          { name: "Private jet charter (1 leg)", cost: 1350000, notes: "Lagos–Abuja" }
        ]
      },
      {
        duration: "7 Days",
        nights: 7,
        price: 18500000,
        components: [
          { name: "Apartment (7 nights)", cost: 1960000, notes: "VI luxury @ ₦280,000/night" },
          { name: "Mobile office setup", cost: 2000000, notes: "Premium executive office" },
          { name: "24/7 IT & admin support", cost: 1400000, notes: "Full-time team" },
          { name: "Airport VIP fast-track", cost: 200000, notes: "Full concierge" },
          { name: "Executive SUV + chauffeur", cost: 840000, notes: "₦120,000/day" },
          { name: "Private jet charter (2-3 legs)", cost: 4000000, notes: "Multi-city mobility" },
          { name: "Meals & incidentals", cost: 2100000, notes: "₦300,000/day" },
          { name: "Logistics & misc", cost: 6000000, notes: "Ground transport, security, contingencies" }
        ]
      },
      {
        duration: "21 Days",
        nights: 21,
        price: 88000000,
        components: [
          { name: "Apartment (21 nights)", cost: 5880000, notes: "VI presidential suite" },
          { name: "Mobile office setup", cost: 5000000, notes: "Full C-suite command center" },
          { name: "24/7 IT & admin support", cost: 4200000, notes: "Dedicated team" },
          { name: "Airport VIP fast-track", cost: 500000, notes: "Multiple fast-track services" },
          { name: "Executive SUV fleet", cost: 2520000, notes: "Multiple vehicles" },
          { name: "Private jet charter flights", cost: 15000000, notes: "Extensive travel" },
          { name: "Meals & incidentals", cost: 6300000, notes: "₦300,000/day" },
          { name: "Security & logistics", cost: 15000000, notes: "Close protection, ground support" },
          { name: "Misc premium buffer", cost: 33600000, notes: "Unforeseen executive needs" }
        ]
      }
    ]
  },
  {
    id: "edu-care",
    title: "Edu-Care Package",
    tagline: "Families & Sabbaticals",
    description: "Relocation and educational support for the whole family.",
    icon: "graduation",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    highlights: [
      "School Placement Consultations",
      "Family Health Insurance Coverage",
      "Full Relocation & Cargo Support",
      "Family-Friendly Accommodation",
      "Daily Family Transport",
      "Educational Facility Tours"
    ],
    activities: [
      { name: "International School Tours", description: "Visit top international schools including Chrisland, Greensprings, and Meadow Hall", icon: "school", duration: "Day 1-2", included: true },
      { name: "Family Health Check-up", description: "Comprehensive health screening at Lagos' premier medical facilities", icon: "heart", duration: "Day 2", included: true },
      { name: "Neighborhood Exploration", description: "Tour family-friendly neighborhoods in Lekki, Ikoyi, and Banana Island", icon: "home", duration: "Day 3", included: true },
      { name: "Cultural Orientation", description: "Introduction to Lagos culture, safety, and daily life for new residents", icon: "book", duration: "Day 1", included: true },
      { name: "Shopping & Setup Assistance", description: "Help with grocery shopping, household setup, and local service connections", icon: "shopping", duration: "Day 3", included: true },
      { name: "Family Recreation Day", description: "Visit to Lekki Conservation Centre, beach, or family entertainment centers", icon: "smile", duration: "Flexible", included: true }
    ],
    tiers: [
      {
        duration: "3 Days",
        nights: 3,
        price: 1200000,
        components: [
          { name: "Apartment (3 nights)", cost: 600000, notes: "Family 3-BR @ ₦200,000/night" },
          { name: "Airport transfer (round)", cost: 80000, notes: "Large vehicle" },
          { name: "School placement consult", cost: 200000, notes: "Initial assessment" },
          { name: "Emergency health insurance", cost: 200000, notes: "Short-term coverage" },
          { name: "Cargo handling consult", cost: 120000, notes: "Planning session" }
        ]
      },
      {
        duration: "7 Days",
        nights: 7,
        price: 4200000,
        components: [
          { name: "Apartment (7 nights)", cost: 1400000, notes: "Family 3-BR @ ₦200,000/night" },
          { name: "Airport transfer (round)", cost: 120000, notes: "Van + driver" },
          { name: "School placement consults", cost: 600000, notes: "Multiple school visits" },
          { name: "Emergency health insurance", cost: 500000, notes: "7-day family coverage" },
          { name: "Cargo handling", cost: 800000, notes: "Shipment coordination" },
          { name: "Transport (family SUV)", cost: 420000, notes: "₦60,000/day" },
          { name: "Meals", cost: 360000, notes: "Family of 4 @ ₦15,000/meal" }
        ]
      },
      {
        duration: "21 Days",
        nights: 21,
        price: 18000000,
        components: [
          { name: "Apartment (21 nights)", cost: 5880000, notes: "Large family home" },
          { name: "Airport transfer (round)", cost: 200000, notes: "Premium van service" },
          { name: "School placement (full)", cost: 3000000, notes: "Comprehensive matching" },
          { name: "Emergency health insurance", cost: 1500000, notes: "Full family coverage" },
          { name: "Cargo & relocation support", cost: 2000000, notes: "Full relocation support" },
          { name: "Transport (SUV, 21 days)", cost: 1260000, notes: "₦60,000/day" },
          { name: "Meals", cost: 2100000, notes: "Family dining" },
          { name: "Misc & contingencies", cost: 2060000, notes: "" }
        ]
      }
    ]
  },
  {
    id: "lavish-love",
    title: "Lavish Love",
    tagline: "Romance & Milestones",
    description: "Milestone moments, perfected.",
    icon: "heart",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    highlights: [
      "Full Event Planning Service",
      "Private Yacht Cruise",
      "Professional Photo & Video",
      "Private Chef & Mixologist",
      "Luxury Decor & Styling",
      "Fine Dining Experiences"
    ],
    activities: [
      { name: "Romantic Apartment Styling", description: "Complete apartment transformation with roses, candles, and luxury decor", icon: "heart", duration: "Day 1", included: true },
      { name: "Private Yacht Sunset Cruise", description: "Half-day luxury yacht charter with champagne, canapés, and sunset views", icon: "anchor", duration: "Day 2", included: true },
      { name: "Professional Photography Session", description: "Couple's photoshoot at iconic Lagos locations with edited photos delivered", icon: "camera", duration: "Day 3", included: true },
      { name: "Private Chef Dinner", description: "Multi-course gourmet dinner prepared in your apartment by a private chef", icon: "utensils", duration: "Day 3", included: true },
      { name: "Spa & Wellness Day", description: "Couples spa treatment with massages, facials, and relaxation", icon: "sparkles", duration: "Day 4", included: true },
      { name: "Rooftop Cocktail Experience", description: "Private mixologist crafting custom cocktails at a luxury rooftop venue", icon: "glass", duration: "Day 5", included: true },
      { name: "Proposal/Elopement Planning", description: "Full event coordination for proposals, anniversaries, or milestone celebrations", icon: "ring", duration: "As needed", included: true },
      { name: "Horse Carriage Ride", description: "Romantic horse carriage ride through Victoria Island waterfront", icon: "heart", duration: "Flexible", included: true }
    ],
    tiers: [
      {
        duration: "3 Days",
        nights: 3,
        price: 2800000,
        components: [
          { name: "Apartment (3 nights)", cost: 600000, notes: "Romantic 2-BR @ ₦200,000/night" },
          { name: "Event planner consultation", cost: 300000, notes: "Initial planning" },
          { name: "Private chef (3 days)", cost: 150000, notes: "" },
          { name: "Photographer (1 session)", cost: 250000, notes: "" },
          { name: "Transport (SUV, 3 days)", cost: 180000, notes: "₦60,000/day" },
          { name: "Romantic dinners", cost: 300000, notes: "Fine dining" },
          { name: "Decor & styling", cost: 300000, notes: "Apartment transformation" },
          { name: "Misc", cost: 720000, notes: "" }
        ]
      },
      {
        duration: "7 Days",
        nights: 7,
        price: 9500000,
        components: [
          { name: "Apartment (7 nights)", cost: 1400000, notes: "Luxury 3-BR @ ₦200,000/night" },
          { name: "Full event planner", cost: 1000000, notes: "End-to-end proposal/elopement" },
          { name: "Private chef (7 days)", cost: 350000, notes: "" },
          { name: "Private yacht cruise", cost: 1500000, notes: "Half-day luxury charter" },
          { name: "Photographer (full)", cost: 500000, notes: "Full coverage" },
          { name: "Mixologist (3 events)", cost: 300000, notes: "" },
          { name: "Transport (SUV, 7 days)", cost: 420000, notes: "₦60,000/day" },
          { name: "Fine dining & catering", cost: 1000000, notes: "" },
          { name: "Decor & styling", cost: 800000, notes: "" },
          { name: "Misc", cost: 2230000, notes: "" }
        ]
      },
      {
        duration: "21 Days",
        nights: 21,
        price: 42000000,
        components: [
          { name: "Apartment (21 nights)", cost: 5880000, notes: "Presidential suite" },
          { name: "Full event planner + team", cost: 3000000, notes: "Complete wedding planning" },
          { name: "Private chef (21 days)", cost: 1050000, notes: "" },
          { name: "Private yacht (multiple)", cost: 5000000, notes: "Multiple cruises" },
          { name: "Photo + videographer", cost: 2000000, notes: "Full documentation" },
          { name: "Mixologist (full-time)", cost: 1000000, notes: "" },
          { name: "Transport (SUV fleet)", cost: 1680000, notes: "Multiple vehicles" },
          { name: "Catering & fine dining", cost: 5000000, notes: "" },
          { name: "Decor, flowers, styling", cost: 3000000, notes: "" },
          { name: "Misc & contingencies", cost: 13900000, notes: "" }
        ]
      }
    ]
  },
  {
    id: "pulse-zen",
    title: "Pulse & Zen",
    tagline: "Wellness & Nightlife",
    description: "Sophisticated escapism.",
    icon: "sparkles",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    highlights: [
      "In-Room Spa Treatments",
      "Resort Day Passes",
      "VIP Club Tables",
      "Private After-Party Lounges",
      "Personal Wellness Coach",
      "Wellness Meal Planning"
    ],
    activities: [
      { name: "In-Room Spa Treatment", description: "Premium massage, facial, and body treatment in the comfort of your apartment", icon: "sparkles", duration: "Day 1", included: true },
      { name: "Resort Day Pass", description: "Full-day access to Lagos' premier beach resorts with pool and amenities", icon: "waves", duration: "Day 2", included: true },
      { name: "VIP Club Night", description: "Reserved VIP table at Lagos' top Afrobeats club with bottle service", icon: "music", duration: "Night 2", included: true },
      { name: "Wellness Consultation", description: "Personal wellness assessment and customized health program design", icon: "heart", duration: "Day 3", included: true },
      { name: "Yoga & Meditation Session", description: "Private sunrise yoga on the beach or in your apartment with certified instructor", icon: "smile", duration: "Day 4", included: true },
      { name: "Private After-Party Lounge", description: "Exclusive access to private lounges with DJ and premium drinks", icon: "glass", duration: "Night 3", included: true },
      { name: "Detox & Nutrition Plan", description: "Personalized meal planning with wellness-focused cuisine delivery", icon: "utensils", duration: "Full stay", included: true },
      { name: "Sunset Beach Meditation", description: "Guided meditation session at Elegushi Beach during golden hour", icon: "sun", duration: "Flexible", included: true }
    ],
    tiers: [
      {
        duration: "3 Days",
        nights: 3,
        price: 1500000,
        components: [
          { name: "Apartment (3 nights)", cost: 420000, notes: "@ ₦140,000/night" },
          { name: "In-room spa treatment", cost: 150000, notes: "1 premium session" },
          { name: "Resort day pass", cost: 100000, notes: "" },
          { name: "Club VIP table (1 night)", cost: 500000, notes: "Starting rate" },
          { name: "Transport (3 days)", cost: 180000, notes: "₦60,000/day" },
          { name: "Meals", cost: 150000, notes: "" }
        ]
      },
      {
        duration: "7 Days",
        nights: 7,
        price: 5200000,
        components: [
          { name: "Apartment (7 nights)", cost: 980000, notes: "@ ₦140,000/night" },
          { name: "Spa treatments (3)", cost: 450000, notes: "" },
          { name: "Resort day passes (2)", cost: 200000, notes: "" },
          { name: "Club VIP table (2 nights)", cost: 1200000, notes: "Premium Afrobeats club" },
          { name: "Private after-party lounge", cost: 500000, notes: "" },
          { name: "Transport (SUV, 7 days)", cost: 420000, notes: "" },
          { name: "Meals & wellness food", cost: 700000, notes: "" },
          { name: "Wellness consultations", cost: 250000, notes: "" },
          { name: "Misc", cost: 500000, notes: "" }
        ]
      },
      {
        duration: "21 Days",
        nights: 21,
        price: 24000000,
        components: [
          { name: "Apartment (21 nights)", cost: 4200000, notes: "Wellness sanctuary" },
          { name: "Spa treatments (regular)", cost: 2000000, notes: "Full wellness program" },
          { name: "Resort day passes (weekly)", cost: 600000, notes: "" },
          { name: "Club VIP tables (6 nights)", cost: 4000000, notes: "Elite nightlife" },
          { name: "Private after-party lounges", cost: 2000000, notes: "" },
          { name: "Transport (SUV, 21 days)", cost: 1260000, notes: "" },
          { name: "Wellness meals & nutrition", cost: 3000000, notes: "" },
          { name: "Personal wellness coach", cost: 2000000, notes: "" },
          { name: "Misc & contingencies", cost: 4940000, notes: "" }
        ]
      }
    ]
  }
];

export interface VIPService {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  rating: number;
  location: string;
  image: string;
  highlights: string[];
  provider: string;
}

export const VIP_SERVICES: VIPService[] = [
  // Spa & Wellness
  { id: 'spa-01', title: 'Serenity Spa Ikoyi', description: 'Award-winning day spa offering deep tissue massage, aromatherapy, and holistic body treatments in a tranquil setting.', category: 'Spa & Wellness', price: 45000, duration: '2 hours', rating: 4.9, location: 'Ikoyi', image: '/assets/images/vertical/IMG-20260621-WA0043.jpg', highlights: ['Deep tissue massage', 'Aromatherapy', 'Sauna access'], provider: 'Serenity Spa Ltd' },
  { id: 'spa-02', title: 'The Wellness Hub VI', description: 'State-of-the-art fitness center with personal trainers, yoga classes, and rooftop infinity pool.', category: 'Spa & Wellness', price: 35000, duration: '3 hours', rating: 4.7, location: 'Victoria Island', image: '/assets/images/vertical/IMG-20260621-WA0044.jpg', highlights: ['Personal trainer', 'Yoga classes', 'Infinity pool'], provider: 'Wellness Hub NG' },
  { id: 'spa-03', title: 'Zen Yoga Studio', description: 'Tranquil yoga and meditation studio offering daily classes from Vinyasa to sound healing sessions.', category: 'Spa & Wellness', price: 25000, duration: '1.5 hours', rating: 4.8, location: 'Lekki Phase 1', image: '/assets/images/vertical/IMG-20260621-WA0045.jpg', highlights: ['Daily classes', 'Meditation', 'Sound healing'], provider: 'Zen Studios' },

  // Barber & Beauty
  { id: 'barber-01', title: 'Executive Cuts Barbershop', description: 'Premium barbershop offering classic cuts, hot towel shaves, and grooming services for the modern gentleman.', category: 'Barber & Beauty', price: 15000, duration: '1 hour', rating: 4.8, location: 'Victoria Island', image: '/assets/images/vertical/IMG-20260621-WA0038.jpg', highlights: ['Classic cuts', 'Hot towel shave', 'Beard grooming'], provider: 'Executive Cuts Ltd' },
  { id: 'barber-02', title: 'Glow Beauty Lounge', description: 'Premium beauty services — facials, manicures, hair styling, and bridal packages by top stylists.', category: 'Barber & Beauty', price: 40000, duration: '2 hours', rating: 4.6, location: 'Ikoyi', image: '/assets/images/vertical/IMG-20260621-WA0039.jpg', highlights: ['Facials', 'Bridal packages', 'Hair styling'], provider: 'Glow Beauty Ltd' },
  { id: 'barber-03', title: 'The Style Studio', description: 'Full-service salon offering hair treatments, coloring, braiding, and styling for all hair types.', category: 'Barber & Beauty', price: 30000, duration: '2 hours', rating: 4.7, location: 'Lekki Phase 1', image: '/assets/images/vertical/IMG-20260621-WA0041.jpg', highlights: ['Hair treatments', 'Coloring', 'Braiding'], provider: 'Style Studio NG' },

  // Shopping Malls
  { id: 'shop-01', title: 'Palm Shopping Mall', description: 'Lekki\'s premier shopping destination with 150+ stores, cinema, bowling alley, and international brands.', category: 'Shopping Malls', price: 0, duration: '3-5 hours', rating: 4.5, location: 'Lekki Phase 1', image: '/assets/images/vertical/IMG-20260621-WA0002.jpg', highlights: ['150+ stores', 'Cinema', 'Bowling alley'], provider: 'Palm Mall Ltd' },
  { id: 'shop-02', title: 'Alara Lagos', description: 'Curated luxury concept store featuring African and international designer fashion, art, and lifestyle.', category: 'Shopping Malls', price: 0, duration: '2-3 hours', rating: 4.8, location: 'Victoria Island', image: '/assets/images/vertical/IMG-20260621-WA0003.jpg', highlights: ['Luxury fashion', 'African designers', 'Art gallery'], provider: 'Alara Lagos' },
  { id: 'shop-03', title: 'The Palms Shopping Mall', description: 'One of Lagos\'s largest malls with over 100 retail stores, restaurants, and entertainment options.', category: 'Shopping Malls', price: 0, duration: '3-4 hours', rating: 4.4, location: 'Lekki', image: '/assets/images/vertical/IMG-20260621-WA0004.jpg', highlights: ['100+ stores', 'Restaurants', 'Entertainment'], provider: 'The Palms Ltd' },

  // Sport Centers & Gyms
  { id: 'gym-01', title: 'Muscle Republic Gym', description: 'Premium fitness center with state-of-the-art equipment, personal trainers, and group classes.', category: 'Sport Centers & Gyms', price: 25000, duration: '2 hours', rating: 4.7, location: 'Victoria Island', image: '/assets/images/vertical/IMG-20260621-WA0005.jpg', highlights: ['Modern equipment', 'Personal trainers', 'Group classes'], provider: 'Muscle Republic' },
  { id: 'gym-02', title: 'FitZone Sports Center', description: 'Multi-sport facility offering basketball, tennis, swimming, and fitness training.', category: 'Sport Centers & Gyms', price: 30000, duration: '3 hours', rating: 4.6, location: 'Ikoyi', image: '/assets/images/vertical/IMG-20260621-WA0006.jpg', highlights: ['Basketball court', 'Tennis courts', 'Swimming pool'], provider: 'FitZone Ltd' },
  { id: 'gym-03', title: 'CrossFit Lagos', description: 'High-intensity functional fitness gym with certified coaches and community-driven workouts.', category: 'Sport Centers & Gyms', price: 35000, duration: '1.5 hours', rating: 4.8, location: 'Lekki Phase 1', image: '/assets/images/vertical/IMG-20260621-WA0007.jpg', highlights: ['CrossFit classes', 'Certified coaches', 'Community'], provider: 'CrossFit Lagos' },

  // Service Providers
  { id: 'service-01', title: 'Laundry Mate Express', description: 'Professional laundry and dry cleaning service with pickup and delivery within 24 hours.', category: 'Service Providers', price: 12000, duration: '24 hours', rating: 4.7, location: 'All Lagos', image: '/assets/images/vertical/IMG-20260621-WA0017.jpg', highlights: ['Pickup & delivery', '24-hour service', 'Dry cleaning'], provider: 'Laundry Mate Ltd' },
  { id: 'service-02', title: 'QuickFix Home Services', description: 'On-demand home repair and maintenance services — plumbing, electrical, AC repair, and more.', category: 'Service Providers', price: 20000, duration: '2-4 hours', rating: 4.5, location: 'All Lagos', image: '/assets/images/vertical/IMG-20260621-WA0019.jpg', highlights: ['Plumbing', 'Electrical', 'AC repair'], provider: 'QuickFix Services' },
  { id: 'service-03', title: 'Chef at Home', description: 'Private chef service bringing restaurant-quality meals to your doorstep with custom menus.', category: 'Service Providers', price: 50000, duration: '3 hours', rating: 4.9, location: 'All Lagos', image: '/assets/images/vertical/IMG-20260621-WA0020.jpg', highlights: ['Custom menus', 'Restaurant quality', 'Professional chefs'], provider: 'Chef at Home NG' },
  { id: 'service-04', title: 'Mobile Car Wash Premium', description: 'Luxury mobile car wash and detailing service at your location with eco-friendly products.', category: 'Service Providers', price: 18000, duration: '2 hours', rating: 4.6, location: 'All Lagos', image: '/assets/images/vertical/IMG-20260621-WA0021.jpg', highlights: ['Mobile service', 'Eco-friendly', 'Full detailing'], provider: 'Mobile Wash Ltd' },
];

export const CONCIERGE_FAQ_TRIGGERS = [
  {
    keywords: ["chef", "dinner", "food", "cook", "dining"],
    response: "Certainly! Cozy Lagos boasts five-star in-house chefs specialized in local West African gourmet fusion and custom continental diets. I can schedule a chef session for your stay duration (₦30,000 per day plus cost of ingredients) or for an exclusive single-night dinner. Which would you prefer?"
  },
  {
    keywords: ["driver", "car", "transfer", "chauffeur", "airport", "transport"],
    response: "Absolutely. I can secure a bulletproof executive SUV or private luxury sedan with an vetted professional security chauffeur for your time in Lagos. Airport pickup transfers are typically ₦120,000, or you can retain full daily service starting at ₦250,000 / day. Shall I lock this down for your dates?"
  },
  {
    keywords: ["yacht", "boat", "cruise", "island", "party"],
    response: "Our 65ft private luxury yacht experience is the premier lagoon journey in West Africa! It offers custom 6-hour charters setting sail from Victoria Island, complete with a private chef, champagne reception, and custom sunset cruising options. It is highly limited, so let me know if you would like me to put a pending request for your stay!"
  },
  {
    keywords: ["checkout", "late", "extend", "time"],
    response: "Understood, Alexander. Standard checkout is 11:00 AM, but I can coordinate with Sarah, your host, to secure an elegant late checkout up to 3:00 PM for you (pending incoming guest clean cycles). Let me ask her right away to obtain key clearance."
  },
  {
    keywords: ["power", "electricity", "safety", "secure"],
    response: "Safety and continuity are guaranteed. Every elite portal under Cozy Lagos maintains dual heavy industrial generators plus heavy battery inverter/solar grid backups ensuring full 24/7 power, robust water treatment plants, and armed external neighborhood perimeter patrols."
  }
];
