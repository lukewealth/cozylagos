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
    image: "/assets/images/vertical/IMG-20260621-WA0040.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0173.jpg", "/assets/images/vertical/IMG-20260621-WA0040.jpg"],
    amenities: ["24/7 Power", "Infinity Pool", "Private Chef", "Concierge", "High-Speed Wi-Fi", "Yacht Access", "Wine Cellar"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0002.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0002.jpg", "/assets/images/vertical/IMG-20260621-WA0002.jpg"],
    amenities: ["24/7 Power Supply", "Treated Water Supply", "High-Profile Security", "Unlimited Internet", "DSTV & Netflix", "Housekeeping Service", "Swimming Pool", "Fully Equipped Gym"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0021.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0021.jpg", "/assets/images/vertical/IMG-20260621-WA0021.jpg"],
    amenities: ["Swimming Pool", "Smartlock Door", "Complimentary Breakfast", "Fully Equipped Gym", "24/7 Power", "Housekeeping"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0003.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0003.jpg", "/assets/images/vertical/IMG-20260621-WA0003.jpg"],
    amenities: ["Swimming Pool", "Luxury Living"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0004.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0004.jpg", "/assets/images/vertical/IMG-20260621-WA0004.jpg"],
    amenities: ["Gated and Secured Estate", "24-hour Electricity", "24-hour Safety & Security", "Guest Parking Space", "Smart TV & Netflix", "Superfast Internet", "standard gym house", "Standard Swimming Pool", "standard outdoor table tennis", "Chef on request", "Spacious Living Areas & Private Balcony", "High-Quality Bedding and Linens", "Washing Machine", "Bespoke Interior Decoration", "Netflix", "Prime video", "Elevator", "Ps5", "Cleaning services"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0005.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0005.jpg", "/assets/images/vertical/IMG-20260621-WA0005.jpg"],
    amenities: ["Gated and Secured Estate", "24/7 Power Supply", "Serene environment", "Smart Lock", "Very fast internet", "Netflix / YouTube / Dstv", "Snooker Board", "Swimming pool", "Gym", "En-suite room with Balcony", "Cinema", "Ocean/ Cite view", "Daily housekeeping", "Dedicated car park space", "Equipped kitchen", "Washing Machine", "Tastefully furnished"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0006.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0006.jpg", "/assets/images/vertical/IMG-20260621-WA0006.jpg"],
    amenities: ["24/7 Power supply", "24/7 Treated water supply", "24/7 High profile security", "Highspeed broadband internet", "Netflix", "Smart TV's", "DSIV", "Housekeeping"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0019.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0019.jpg", "/assets/images/vertical/IMG-20260621-WA0019.jpg"],
    amenities: ["24/7 Electricity", "Smart TVs", "24/7 security", "Estate pool and gym", "Board games", "Fully equipped and fitted kitchen", "Dedicated fiber internet", "Washing machine", "Cooking spices", "Smart lock", "Fully Air-conditioned home", "Clean running water", "Elevators", "Yoga mat", "Work table and chair", "Pool toys"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0020.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0020.jpg", "/assets/images/vertical/IMG-20260621-WA0020.jpg"],
    amenities: ["Gated and Secured Estate", "Superfast WiFi", "24/7 Power Supply", "24/7 Security", "Swimming pool", "Smart TVs", "En-suite rooms", "Housekeeping", "Chef on demand", "Dedicated car park", "Fully equipped kitchen", "Washing machine", "Balcony sit out", "Tastefully furnished"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0043.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0043.jpg", "/assets/images/vertical/IMG-20260621-WA0043.jpg"],
    amenities: ["24/7 Power", "Swimming Pool", "Gym", "High-Speed Wi-Fi", "Smart TVs", "Housekeeping", "Dedicated Parking", "Balcony"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0044.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0044.jpg", "/assets/images/vertical/IMG-20260621-WA0044.jpg"],
    amenities: ["Ocean View", "24/7 Power", "Smart TVs", "Netflix", "High-Speed Wi-Fi", "Gym", "Security", "Housekeeping"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0045.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0045.jpg", "/assets/images/vertical/IMG-20260621-WA0045.jpg"],
    amenities: ["Garden View", "24/7 Power", "Security", "Wi-Fi", "Smart TV", "Housekeeping", "Pool Access", "Gym"],
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
    image: "/assets/images/vertical/IMG-20260621-WA0038.jpg",
    images: ["/assets/images/horizontal/IMG-20260621-WA0188.jpg", "/assets/images/vertical/IMG-20260621-WA0038.jpg"],
    amenities: ["Cinema Room", "24/7 Power", "Swimming Pool", "Gym", "Smart Lock", "High-Speed Wi-Fi", "Housekeeping", "Dedicated Parking"],
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

export interface ServiceBundle {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  tiers: BundleTier[];
}

export const SERVICE_BUNDLES: ServiceBundle[] = [
  {
    id: "business-bundle",
    title: "Business Bundle",
    tagline: "Corporate Executive",
    description: "Designed for the corporate leader who requires zero distractions and maximum efficiency.",
    icon: "briefcase",
    image: "/assets/images/horizontal/IMG-20260621-WA0164.jpg",
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
    image: "/assets/images/horizontal/IMG-20260621-WA0173.jpg",
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
    image: "/assets/images/vertical/IMG-20260621-WA0041.jpg",
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
    image: "/assets/images/vertical/IMG-20260621-WA0038.jpg",
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
    image: "/assets/images/vertical/IMG-20260621-WA0043.jpg",
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
    image: "/assets/images/vertical/IMG-20260621-WA0044.jpg",
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
    image: "/assets/images/vertical/IMG-20260621-WA0045.jpg",
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
