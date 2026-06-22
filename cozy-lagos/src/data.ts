import { Listing, Booking, Transaction, ChatMessage } from "./types";

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: "bourdillon-penthouse",
    title: "The Bourdillon Penthouse",
    description: "A breathtaking, futuristic duplex penthouse in the absolute heart of Ikoyi, Lagos. Features extensive double-height glass facades that offer pure 180-degree panoramic sweeps of the Victoria Island skyline and the glittering lagoon below at sunset. Outfitted with tailor-made leather sofas, a private wellness gym setup, custom brass and marble fixtures, and full motorized curtain integration for absolute light-level control.",
    category: "Penthouse",
    location: "Ikoyi",
    bedrooms: 4,
    bathrooms: 4.5,
    maxGuests: 8,
    nightlyRate: 450000,
    weekendPremium: 15,
    cleaningFee: 25000,
    securityDeposit: 150000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCli9xKwNM01h_LS2ci3K6e5WmRJ3sSNtgZWv2hP5EfXIM9-bt6ANNqiAcYwrC1om0CPU2BGiTol4cr9QyK70ZVe4T2GKl183txsrANwtrlFD8MLA7ZCOvxvBDe6gefIZqDD54QAStibNCPBlosY6D_tdt-qxJguTfDTBxeJXuTnDqcJoH-3wMY-lXD6qTM_Z4Lr2z3ECb-KDNAecokieCqymRG2vEfXdAUpFph62NxOCj3p5DcWe9BgbkIlMcpw7mKwAAUHBddKh1O",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCli9xKwNM01h_LS2ci3K6e5WmRJ3sSNtgZWv2hP5EfXIM9-bt6ANNqiAcYwrC1om0CPU2BGiTol4cr9QyK70ZVe4T2GKl183txsrANwtrlFD8MLA7ZCOvxvBDe6gefIZqDD54QAStibNCPBlosY6D_tdt-qxJguTfDTBxeJXuTnDqcJoH-3wMY-lXD6qTM_Z4Lr2z3ECb-KDNAecokieCqymRG2vEfXdAUpFph62NxOCj3p5DcWe9BgbkIlMcpw7mKwAAUHBddKh1O",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2GGWFNwuBO2JM2bYf-QFEBP5nlp9knwLAIEbuxzj4ld_7CfhmUboRV3Ih7CVn_cIyrr_4X1CctHurZYPJbDxPLcuNMAlgZ8E7GyLfuIZd0L6TiIH6JL4qxE0S6LH3dMbrqgFBA03tV_nv4ZYAyrn6SxvsPQIXQbaDeHNvc4U7p0dKE_MVLgA3pA2eXUVxVCT1kqKk61Iy5V8EtXhKI2oGFsLpYuJKl_0DR9wGJZd3pAuZVlzm1NLpNPC1R-jcDjf_0MBaI235ER6"
    ],
    amenities: ["24/7 Power", "Infinity Pool", "Private Chef", "Concierge", "High-Speed Wi-Fi", "Private Gym"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 32,
    rating: 4.9,
    aiMatchPercent: 98
  },
  {
    id: "lagoon-view-villa",
    title: "Lagoon View Villa",
    description: "Set directly on the private shoreline of Banana Island, this striking architectural achievement merges concrete facades with a tropical courtyard. Complete with an infinity lap pool that spills into the serene lagoon waters, a carded wool textile audio-shield acoustic system in the lounge room, a separate wine cellar, gourmet outdoor al fresco dining pavilion, and direct private deep-water dock access supporting yacht drop-offs.",
    category: "Luxury Villa",
    location: "Banana Island",
    bedrooms: 5,
    bathrooms: 6.0,
    maxGuests: 10,
    nightlyRate: 650000,
    weekendPremium: 15,
    cleaningFee: 35000,
    securityDeposit: 250000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6zhFqIAth02rl8RLgo1AL8t4tKcs3xKf_jgxfbPcHNKqxRbZlhqPp0-bf8uwC-srgxFqYyFQTo9DkruyQZCd6KwohNkAUKKFl6N9RaF4mldR7c-UibrxiUylmPLGrk5TKq4iPgb3b_vPCBhn92R_v44qWXCv92xY3BoQ66qQsRDAQCt66Nef4IfzChQBG-OTg_caLRx30vAym1R96pkaI0fysoFDiejNCCADFc9yF4aK9pMsqvh0N5n5vtssAKzhpeR2xQq2Zch9N",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6zhFqIAth02rl8RLgo1AL8t4tKcs3xKf_jgxfbPcHNKqxRbZlhqPp0-bf8uwC-srgxFqYyFQTo9DkruyQZCd6KwohNkAUKKFl6N9RaF4mldR7c-UibrxiUylmPLGrk5TKq4iPgb3b_vPCBhn92R_v44qWXCv92xY3BoQ66qQsRDAQCt66Nef4IfzChQBG-OTg_caLRx30vAym1R96pkaI0fysoFDiejNCCADFc9yF4aK9pMsqvh0N5n5vtssAKzhpeR2xQq2Zch9N",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCl531HUrzoxd5qsppge9MY1u4gFm4U5WzK8BUtWenT_MzMJgZK4Jdzh1JqPUmQ4MjSsW9NarG4tljrVBo3SZXa1Df3Qz4ibpQPwIKjKFkTdiLySFUdJV47Y1kplw11rAEJRmr9VcMQuJJevGWAmy0Eegs-wBaKc8bxh5jbk5qPK1E9BW6n1JinVG8K3v9yrl4Sv12ZFrWbXkcFUZrVW0yWIE_1bqY6lTWf-QF3ArfSp-fe2UdCUNCunF8wMvKna4i4sJUpfkztgYOf"
    ],
    amenities: ["24/7 Power", "Infinity Pool", "Private Chef", "Concierge", "High-Speed Wi-Fi", "Yacht Access", "Wine Cellar"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 18,
    rating: 4.8,
    aiMatchPercent: 94
  },
  {
    id: "eko-loft",
    title: "The Eko Loft Sanctuary",
    description: "An exceptional, industrially inspired loft featuring towering double-height concrete ceilings and immense black frame ironmongery windows. Placed securely within upscale Victoria Island. Styled in close co-creation with local master carvers and modern African abstract painters. Offers a highly peaceful, safety-engineered sound insulation setup making the buzz of the metropolis vanish entirely.",
    category: "Executive Studio",
    location: "Victoria Island",
    bedrooms: 2,
    bathrooms: 2.0,
    maxGuests: 4,
    nightlyRate: 250000,
    weekendPremium: 10,
    cleaningFee: 15000,
    securityDeposit: 80000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi_cQDOnAzgGcO6_cbASiqCtiJmVs6EL4CDMSQ-3ixfZgB9SGSEAr0ei_YaH9e9AEYhtY7qFlDJn9oRuNkVyMhi6_G4y7v5Zat7F4TrJtlLG9aLvPeKmA-fI962i4cTCw5cVQEfahfe7AyrTQerw1ir4hne3OWPURHNTk2XDCG1XE--IvYMDUiRVC6Tg0NMgGCmiwNNjdfTNqLXpCdq4zjwNcZDPPq5u2IRrgwI55aafFKzPeefuI0PWumocNHp4LFCDcScC2Z8RFf",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDi_cQDOnAzgGcO6_cbASiqCtiJmVs6EL4CDMSQ-3ixfZgB9SGSEAr0ei_YaH9e9AEYhtY7qFlDJn9oRuNkVyMhi6_G4y7v5Zat7F4TrJtlLG9aLvPeKmA-fI962i4cTCw5cVQEfahfe7AyrTQerw1ir4hne3OWPURHNTk2XDCG1XE--IvYMDUiRVC6Tg0NMgGCmiwNNjdfTNqLXpCdq4zjwNcZDPPq5u2IRrgwI55aafFKzPeefuI0PWumocNHp4LFCDcScC2Z8RFf",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAeMFOGa4JpdRK7_5LVZqpuKg-VIcEg6j-VvO7nv3XHUh-zq8M_mvYIsH1PCyUsEAJ5jF_cyGl0rFDYNUEuGiMZPyAuCEmEY09WpITALZ4eUxf-Xl7XTaN0kmgacm92FzHK2AYI5UiyNVHr7wGQhAiOrOSFyHKkG-PzlAJoHN7QMjMiQisnWqbtyPmCdBUSZrhsiWoWjbnlz4LUzIreLn7tnXcPhqwZBbvXh6vJxhyJ4BmOic-g8Q8nCWnJkP5_WRPKqkaflu599Dq"
    ],
    amenities: ["24/7 Power", "High-Speed Wi-Fi", "Concierge", "Safety-pact Lock system", "Acoustic Shielding"],
    ownerId: "emeka-anene",
    isActive: true,
    reviewsCount: 45,
    rating: 4.7,
    aiMatchPercent: 91
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "booking-01",
    listingId: "bourdillon-penthouse",
    listingTitle: "The Bourdillon Penthouse",
    guestName: "Alexander Sterling",
    guestEmail: "alex@sterlingholdings.com",
    guestAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDx15JuvuMcDijKEA4B_8Byjpib6fMI0fFxbYNjGPlhYAmDWvMdQMnX_byTMGQod-bhOYO4sugMfBPzJcWxb18Bmql8ORNoXufqWmoeBxtHTbACjeGG_PLhXiHkFL2osEeAHCx3O-SMpXLi_x1k6m7U63tChmAPXFuSi8NBKZZRkEVk2H9wgx0RHOtyObOSAqG24z8-V2mImw29UWFWmSYElo66Yb3acIv983sY8rqYphNg18jA9VNHTqWG9_nxNvLH1FbtnxRmPijH",
    checkIn: "2026-06-25",
    checkOut: "2026-07-02",
    guestsCount: 4,
    status: "Confirmed",
    totalAmount: 3150000,
    chefAdded: true,
    photographerAdded: false,
    jetskiAdded: true
  },
  {
    id: "booking-02",
    listingId: "lagoon-view-villa",
    listingTitle: "Lagoon View Villa",
    guestName: "Sarah Jenkins",
    guestEmail: "sjenkins@media-arts.co",
    guestAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9lTotMd2RIFjd-3xeK4mO_pmn_YYNyDArzN4tfbFqP4RQklnVe0rYjO7FozZUN0q1OWa3DeOu-ssQ3pyzcns_p3HivAPKLD29383WGDgK7lr1wXrwFiOhXyQL0XWXIpa6C-M3iqJWUVSZG7u5maEXPdRpMTZz4hyhjRB2ciQ2NIYsmPTdywDAsBFkZ7-a_KkFgu73NjCA6ligR5O66nIl54t-AJSB4ttjEwiRBH9ARqWh0YB7Af1tO_9g0HQ3eJmKCryEixQ-8-PF",
    checkIn: "2026-07-10",
    checkOut: "2026-07-16",
    guestsCount: 6,
    status: "Pending",
    totalAmount: 3900000,
    chefAdded: true,
    photographerAdded: true
  },
  {
    id: "booking-03",
    listingId: "eko-loft",
    listingTitle: "The Eko Loft Sanctuary",
    guestName: "Chuka Obi",
    guestEmail: "chuka@obi-studios.ng",
    guestAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9Lh8rkEuZ0WtuwD5WIDKt8X-Rcw_hkbPJc4me77k4fCkgvj7bw8uS_oG_i5TwGhETMSGEO8280C-iff0nUzjqzM2S4kHFg5mbfWBJzan8ih4yEEtAdcVG3RBSr9E2D2cIGqu5JReEW10IA7NXk63IzHsmjKVrqjjVOlp8L8uCHSQF6kvoikGM4EOodrcn2VvxVlXT3MdMLy4uqFdnqsmxEB_PvwDpzjr1euEh0V68xjDrRvmA70yqiRTMfrAJUIC9aGARCX0VHZCK",
    checkIn: "2026-06-22",
    checkOut: "2026-06-25",
    guestsCount: 2,
    status: "Confirmed",
    totalAmount: 750000,
    chefAdded: false
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
    description: "Lagoon View Villa booking - Sarah Jenkins"
  },
  {
    id: "tx-02",
    date: "2026-06-20",
    reference: "CL-TX8921",
    type: "Payout",
    amount: -2500000,
    status: "Processed",
    description: "GTBank withdrawal to account ending in **3492"
  },
  {
    id: "tx-03",
    date: "2026-06-18",
    reference: "CL-TX8901",
    type: "Booking Revenue",
    amount: 3150000,
    status: "Processed",
    description: "The Bourdillon Penthouse booking - Alexander Sterling"
  },
  {
    id: "tx-04",
    date: "2026-06-15",
    reference: "CL-TX8875",
    type: "Booking Revenue",
    amount: 450000,
    status: "Processed",
    description: "The Eko Loft booking - Amina Alabi"
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
