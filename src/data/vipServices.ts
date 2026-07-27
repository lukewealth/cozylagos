export interface VIPService {
  id: string;
  title: string;
  description: string;
  category: 'spa' | 'barber' | 'shopping' | 'sports' | 'gym' | 'laundry' | 'concierge' | 'transport' | 'chef' | 'security' | 'photography' | 'wellness';
  price: number;
  priceUnit: 'per_session' | 'per_hour' | 'per_day' | 'per_item' | 'flat';
  location: string;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  amenities: string[];
  providerName: string;
  verified: boolean;
  available: boolean;
  duration?: string;
}

export interface VIPServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  services: VIPService[];
}

export const VIP_SERVICES: VIPServiceCategory[] = [
  {
    id: 'spa-wellness',
    title: 'Spa & Wellness',
    description: 'Premium spa treatments and wellness experiences',
    icon: 'sparkles',
    gradient: 'from-teal-500 via-emerald-400 to-green-400',
    services: [
      {
        id: 'spa-001',
        title: 'Deep Tissue Massage',
        description: 'Full body deep tissue massage by certified therapist. Relieves tension and promotes relaxation.',
        category: 'spa',
        price: 45000,
        priceUnit: 'per_session',
        location: 'Ikoyi',
        rating: 4.9,
        reviewsCount: 128,
        image: 'https://images.pexels.com/photos/36497917/pexels-photo-36497917.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/36497917/pexels-photo-36497917.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3757943/pexels-photo-3757943.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Hot Stones', 'Aromatherapy', 'Private Room', 'Complimentary Tea'],
        providerName: 'Serenity Spa Ikoyi',
        verified: true,
        available: true,
        duration: '90 mins'
      },
      {
        id: 'spa-002',
        title: 'Royal Hammam Experience',
        description: 'Traditional Moroccan hammam with black soap scrub, ghassoul clay mask, and aromatic steam.',
        category: 'spa',
        price: 85000,
        priceUnit: 'per_session',
        location: 'Victoria Island',
        rating: 4.8,
        reviewsCount: 76,
        image: 'https://images.pexels.com/photos/36436448/pexels-photo-36436448.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/36436448/pexels-photo-36436448.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3757944/pexels-photo-3757944.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3757945/pexels-photo-3757945.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Steam Room', 'Body Scrub', 'Clay Mask', 'Relaxation Lounge'],
        providerName: 'The Wellness Hub',
        verified: true,
        available: true,
        duration: '120 mins'
      },
      {
        id: 'spa-003',
        title: 'Couples Spa Package',
        description: 'Romantic spa experience for two with champagne, chocolate-covered strawberries, and side-by-side massages.',
        category: 'spa',
        price: 150000,
        priceUnit: 'per_session',
        location: 'Lekki Phase 1',
        rating: 4.9,
        reviewsCount: 54,
        image: 'https://images.pexels.com/photos/36467274/pexels-photo-36467274.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/36467274/pexels-photo-36467274.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3757946/pexels-photo-3757946.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3757947/pexels-photo-3757947.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Couples Suite', 'Champagne', 'Strawberries', 'Rose Petals'],
        providerName: 'Glow Beauty Lounge',
        verified: true,
        available: true,
        duration: '150 mins'
      }
    ]
  },
  {
    id: 'barber-grooming',
    title: 'Barber & Grooming',
    description: 'Premium grooming services for the distinguished gentleman',
    icon: 'scissors',
    gradient: 'from-amber-700 via-yellow-600 to-orange-500',
    services: [
      {
        id: 'barber-001',
        title: 'Executive Haircut & Styling',
        description: 'Precision haircut with hot towel shave, beard trim, and styling by master barber.',
        category: 'barber',
        price: 15000,
        priceUnit: 'per_session',
        location: 'Ikoyi',
        rating: 4.8,
        reviewsCount: 210,
        image: 'https://images.pexels.com/photos/30699431/pexels-photo-30699431.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/30699431/pexels-photo-30699431.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043904/pexels-photo-1043904.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Hot Towel', 'Beard Trim', 'Styling', 'Complimentary Drink'],
        providerName: 'The Gentlemen\'s Quarter',
        verified: true,
        available: true,
        duration: '60 mins'
      },
      {
        id: 'barber-002',
        title: 'Royal Grooming Package',
        description: 'Complete grooming experience: haircut, facial, manicure, pedicure, and shoulder massage.',
        category: 'barber',
        price: 45000,
        priceUnit: 'per_session',
        location: 'Victoria Island',
        rating: 4.9,
        reviewsCount: 89,
        image: 'https://images.pexels.com/photos/33418521/pexels-photo-33418521.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/33418521/pexels-photo-33418521.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043904/pexels-photo-1043904.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043905/pexels-photo-1043905.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Facial', 'Manicure', 'Pedicure', 'Shoulder Massage'],
        providerName: 'Luxe Barbershop VI',
        verified: true,
        available: true,
        duration: '180 mins'
      },
      {
        id: 'barber-003',
        title: 'In-Room Barber Service',
        description: 'Professional barber comes to your residence. Full setup with sterilized equipment.',
        category: 'barber',
        price: 25000,
        priceUnit: 'per_session',
        location: 'All Lagos',
        rating: 4.7,
        reviewsCount: 156,
        image: 'https://images.pexels.com/photos/36960650/pexels-photo-36960650.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/36960650/pexels-photo-36960650.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043906/pexels-photo-1043906.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043907/pexels-photo-1043907.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Mobile Service', 'Sterilized Equipment', 'Flexible Scheduling'],
        providerName: 'Mobile Grooming Co.',
        verified: true,
        available: true,
        duration: '45 mins'
      }
    ]
  },
  {
    id: 'shopping-malls',
    title: 'Shopping & Retail',
    description: 'Curated shopping experiences at Lagos finest retail destinations',
    icon: 'shopping-bag',
    gradient: 'from-pink-600 via-rose-500 to-red-400',
    services: [
      {
        id: 'shop-001',
        title: 'Personal Shopper Experience',
        description: 'Dedicated personal shopper for 4 hours at Palm Shopping Mall. Style consultation included.',
        category: 'shopping',
        price: 75000,
        priceUnit: 'per_session',
        location: 'Lekki Phase 1',
        rating: 4.7,
        reviewsCount: 67,
        image: 'https://images.pexels.com/photos/36790085/pexels-photo-36790085.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/36790085/pexels-photo-36790085.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/264508/pexels-photo-264508.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Style Consultation', 'Priority Access', 'VIP Lounge', 'Complimentary Parking'],
        providerName: 'Palm Mall Concierge',
        verified: true,
        available: true,
        duration: '4 hours'
      },
      {
        id: 'shop-002',
        title: 'Luxury Fashion Tour',
        description: 'Guided tour of Alara, Ikoyi Fashion District, and bespoke tailoring ateliers.',
        category: 'shopping',
        price: 120000,
        priceUnit: 'per_session',
        location: 'VI & Ikoyi',
        rating: 4.8,
        reviewsCount: 43,
        image: 'https://images.pexels.com/photos/36445251/pexels-photo-36445251.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/36445251/pexels-photo-36445251.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/264509/pexels-photo-264509.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/264510/pexels-photo-264510.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Private Transport', 'Designer Access', 'Fitting Sessions', 'Lunch Included'],
        providerName: 'Lagos Style Tours',
        verified: true,
        available: true,
        duration: '6 hours'
      },
      {
        id: 'shop-003',
        title: 'Artisan Market Guide',
        description: 'Expert guide through Lekki Artisan Market. Learn to negotiate and discover hidden gems.',
        category: 'shopping',
        price: 25000,
        priceUnit: 'per_session',
        location: 'Lekki Phase 1',
        rating: 4.6,
        reviewsCount: 98,
        image: 'https://images.pexels.com/photos/16114746/pexels-photo-16114746.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/16114746/pexels-photo-16114746.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/264511/pexels-photo-264511.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/264512/pexels-photo-264512.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Expert Guide', 'Negotiation Tips', 'Cultural Insights'],
        providerName: 'Lekki Market Tours',
        verified: true,
        available: true,
        duration: '3 hours'
      }
    ]
  },
  {
    id: 'sports-centers',
    title: 'Sports & Recreation',
    description: 'Premium sports facilities and recreational activities',
    icon: 'trophy',
    gradient: 'from-blue-600 via-cyan-500 to-teal-400',
    services: [
      {
        id: 'sport-001',
        title: 'Tennis Court Reservation',
        description: 'Premium tennis court with equipment rental and optional coaching session.',
        category: 'sports',
        price: 35000,
        priceUnit: 'per_hour',
        location: 'Ikoyi',
        rating: 4.7,
        reviewsCount: 112,
        image: 'https://images.pexels.com/photos/34043569/pexels-photo-34043569.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/34043569/pexels-photo-34043569.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043908/pexels-photo-1043908.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043909/pexels-photo-1043909.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Court Reservation', 'Equipment Rental', 'Coaching Available', 'Showers'],
        providerName: 'Ikoyi Club',
        verified: true,
        available: true,
        duration: '1 hour'
      },
      {
        id: 'sport-002',
        title: 'Golf Session with Caddy',
        description: '18-hole golf at Eko Atlantic with professional caddy and club rental.',
        category: 'sports',
        price: 150000,
        priceUnit: 'per_session',
        location: 'Victoria Island',
        rating: 4.9,
        reviewsCount: 34,
        image: 'https://images.pexels.com/photos/38277835/pexels-photo-38277835.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/38277835/pexels-photo-38277835.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043910/pexels-photo-1043910.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043911/pexels-photo-1043911.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['18 Holes', 'Professional Caddy', 'Club Rental', 'Cart Included'],
        providerName: 'Eko Atlantic Golf',
        verified: true,
        available: true,
        duration: '4 hours'
      },
      {
        id: 'sport-003',
        title: 'Swimming Pool Access',
        description: 'Olympic-sized pool access with towel service and locker room.',
        category: 'sports',
        price: 15000,
        priceUnit: 'per_session',
        location: 'Lekki Phase 1',
        rating: 4.5,
        reviewsCount: 187,
        image: 'https://images.pexels.com/photos/14346826/pexels-photo-14346826.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/14346826/pexels-photo-14346826.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043912/pexels-photo-1043912.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043913/pexels-photo-1043913.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Olympic Pool', 'Towel Service', 'Locker Room', 'Lifeguard'],
        providerName: 'Lekki Sports Club',
        verified: true,
        available: true,
        duration: 'Unlimited'
      }
    ]
  },
  {
    id: 'gyms-fitness',
    title: 'Gyms & Fitness',
    description: 'State-of-the-art fitness centers with personal training',
    icon: 'dumbbell',
    gradient: 'from-red-600 via-rose-500 to-pink-500',
    services: [
      {
        id: 'gym-001',
        title: 'Personal Training Session',
        description: 'One-on-one session with certified personal trainer. Custom workout plan included.',
        category: 'gym',
        price: 35000,
        priceUnit: 'per_session',
        location: 'Victoria Island',
        rating: 4.8,
        reviewsCount: 145,
        image: 'https://images.pexels.com/photos/33832205/pexels-photo-33832205.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/33832205/pexels-photo-33832205.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043914/pexels-photo-1043914.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043915/pexels-photo-1043915.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Personal Trainer', 'Custom Plan', 'Equipment Access', 'Nutrition Tips'],
        providerName: 'The Fitness Hub VI',
        verified: true,
        available: true,
        duration: '60 mins'
      },
      {
        id: 'gym-002',
        title: 'Yoga & Meditation Class',
        description: 'Private yoga session with certified instructor. All levels welcome.',
        category: 'gym',
        price: 25000,
        priceUnit: 'per_session',
        location: 'Lekki Phase 1',
        rating: 4.9,
        reviewsCount: 98,
        image: 'https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043916/pexels-photo-1043916.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043917/pexels-photo-1043917.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Private Session', 'All Levels', 'Mats Provided', 'Meditation'],
        providerName: 'Zen Yoga Studio',
        verified: true,
        available: true,
        duration: '75 mins'
      },
      {
        id: 'gym-003',
        title: 'CrossFit WOD Session',
        description: 'High-intensity functional training with certified CrossFit coach.',
        category: 'gym',
        price: 20000,
        priceUnit: 'per_session',
        location: 'Ikoyi',
        rating: 4.7,
        reviewsCount: 76,
        image: 'https://images.pexels.com/photos/37137276/pexels-photo-37137276.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/37137276/pexels-photo-37137276.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043918/pexels-photo-1043918.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043919/pexels-photo-1043919.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Certified Coach', 'Group or Private', 'Equipment Provided', 'Showers'],
        providerName: 'CrossFit Lagos',
        verified: true,
        available: true,
        duration: '60 mins'
      }
    ]
  },
  {
    id: 'laundry-services',
    title: 'Laundry & Valet',
    description: 'Premium laundry and dry cleaning services',
    icon: 'shirt',
    gradient: 'from-indigo-600 via-blue-500 to-cyan-400',
    services: [
      {
        id: 'laundry-001',
        title: 'Express Laundry Service',
        description: 'Same-day laundry service. Pickup and delivery included. Up to 10kg.',
        category: 'laundry',
        price: 15000,
        priceUnit: 'per_session',
        location: 'All Lagos',
        rating: 4.6,
        reviewsCount: 234,
        image: 'https://images.pexels.com/photos/15451731/pexels-photo-15451731.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/15451731/pexels-photo-15451731.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/15827356/pexels-photo-15827356.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/16105578/pexels-photo-16105578.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Same-Day Service', 'Pickup & Delivery', 'Up to 10kg', 'Eco-Friendly'],
        providerName: 'Lagos Laundry Mate',
        verified: true,
        available: true,
        duration: 'Same Day'
      },
      {
        id: 'laundry-002',
        title: 'Premium Dry Cleaning',
        description: 'Professional dry cleaning for suits, dresses, and delicate fabrics. 48-hour turnaround.',
        category: 'laundry',
        price: 8000,
        priceUnit: 'per_item',
        location: 'All Lagos',
        rating: 4.8,
        reviewsCount: 167,
        image: 'https://images.pexels.com/photos/15827357/pexels-photo-15827357.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/15827357/pexels-photo-15827357.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/16105579/pexels-photo-16105579.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/15451732/pexels-photo-15451732.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Professional Cleaning', '48-Hour Turnaround', 'Pickup & Delivery', 'Garment Care'],
        providerName: 'Elite Dry Cleaners',
        verified: true,
        available: true,
        duration: '48 hours'
      },
      {
        id: 'laundry-003',
        title: 'In-Room Ironing Service',
        description: 'Professional ironing service at your residence. Steam press and garment steaming.',
        category: 'laundry',
        price: 10000,
        priceUnit: 'per_session',
        location: 'All Lagos',
        rating: 4.5,
        reviewsCount: 89,
        image: 'https://images.pexels.com/photos/16105580/pexels-photo-16105580.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/16105580/pexels-photo-16105580.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/15451733/pexels-photo-15451733.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/15827358/pexels-photo-15827358.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Mobile Service', 'Steam Press', 'Garment Steaming', 'Quick Turnaround'],
        providerName: 'Mobile Valet Service',
        verified: true,
        available: true,
        duration: '1-2 hours'
      }
    ]
  },
  {
    id: 'private-chef',
    title: 'Private Chef Services',
    description: 'World-class chefs for private dining experiences',
    icon: 'chef-hat',
    gradient: 'from-orange-600 via-red-500 to-rose-500',
    services: [
      {
        id: 'chef-001',
        title: 'Private Dinner Chef',
        description: 'Professional chef prepares a 5-course dinner at your residence. Ingredients included.',
        category: 'chef',
        price: 250000,
        priceUnit: 'per_session',
        location: 'All Lagos',
        rating: 4.9,
        reviewsCount: 67,
        image: 'https://images.pexels.com/photos/31095002/pexels-photo-31095002.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/31095002/pexels-photo-31095002.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043926/pexels-photo-1043926.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043927/pexels-photo-1043927.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['5-Course Meal', 'Ingredients Included', 'Wine Pairing', 'Clean-Up'],
        providerName: 'Chef Emeka\'s Kitchen',
        verified: true,
        available: true,
        duration: '4 hours'
      },
      {
        id: 'chef-002',
        title: 'Nigerian Cuisine Experience',
        description: 'Authentic Nigerian cuisine prepared by master chef. Jollof, Egusi, Pounded Yam & more.',
        category: 'chef',
        price: 180000,
        priceUnit: 'per_session',
        location: 'All Lagos',
        rating: 4.8,
        reviewsCount: 123,
        image: 'https://images.pexels.com/photos/13915043/pexels-photo-13915043.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/13915043/pexels-photo-13915043.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043928/pexels-photo-1043928.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043929/pexels-photo-1043929.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Traditional Cuisine', 'Family Style', 'Desserts Included', 'Cultural Experience'],
        providerName: 'Mama Put Premium',
        verified: true,
        available: true,
        duration: '3 hours'
      },
      {
        id: 'chef-003',
        title: 'Breakfast & Brunch Service',
        description: 'Gourmet breakfast or brunch prepared fresh at your residence. Continental or local.',
        category: 'chef',
        price: 85000,
        priceUnit: 'per_session',
        location: 'All Lagos',
        rating: 4.7,
        reviewsCount: 89,
        image: 'https://images.pexels.com/photos/37624176/pexels-photo-37624176.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/37624176/pexels-photo-37624176.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043930/pexels-photo-1043930.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043929/pexels-photo-1043929.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Fresh Preparation', 'Continental or Local', 'Up to 6 Guests', 'Coffee & Tea'],
        providerName: 'Morning Glory Chef',
        verified: true,
        available: true,
        duration: '2 hours'
      }
    ]
  },
  {
    id: 'photography',
    title: 'Photography & Video',
    description: 'Professional photography and videography services',
    icon: 'camera',
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    services: [
      {
        id: 'photo-001',
        title: 'Professional Photoshoot',
        description: '2-hour photoshoot with professional photographer. 50 edited digital images.',
        category: 'photography',
        price: 150000,
        priceUnit: 'per_session',
        location: 'All Lagos',
        rating: 4.9,
        reviewsCount: 145,
        image: 'https://images.pexels.com/photos/31951217/pexels-photo-31951217.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/31951217/pexels-photo-31951217.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043934/pexels-photo-1043934.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043933/pexels-photo-1043933.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['Professional Photographer', '50 Edited Images', 'Location Scouting', 'Digital Delivery'],
        providerName: 'Lagos Lens Studio',
        verified: true,
        available: true,
        duration: '2 hours'
      },
      {
        id: 'photo-002',
        title: 'Event Videography',
        description: 'Full event coverage with 4K video. Edited highlight reel and full footage.',
        category: 'photography',
        price: 350000,
        priceUnit: 'per_session',
        location: 'All Lagos',
        rating: 4.8,
        reviewsCount: 56,
        image: 'https://images.pexels.com/photos/16114743/pexels-photo-16114743.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/16114743/pexels-photo-16114743.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043934/pexels-photo-1043934.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043933/pexels-photo-1043933.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['4K Video', 'Highlight Reel', 'Full Footage', 'Drone Shots'],
        providerName: 'Cinematic Lagos',
        verified: true,
        available: true,
        duration: 'Full Day'
      },
      {
        id: 'photo-003',
        title: 'Content Creation Package',
        description: 'Social media content creation. 20 photos + 5 reels for Instagram/TikTok.',
        category: 'photography',
        price: 120000,
        priceUnit: 'per_session',
        location: 'All Lagos',
        rating: 4.7,
        reviewsCount: 78,
        image: 'https://images.pexels.com/photos/30402282/pexels-photo-30402282.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/30402282/pexels-photo-30402282.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043930/pexels-photo-1043930.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1043937/pexels-photo-1043937.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        amenities: ['20 Photos', '5 Reels', 'Social Media Ready', 'Quick Turnaround'],
        providerName: 'Content House Lagos',
        verified: true,
        available: true,
        duration: '3 hours'
      }
    ]
  },
  {
    id: 'grooming-salon',
    title: 'Grooming & Salon',
    description: 'Premium grooming and salon services',
    icon: 'scissors',
    gradient: 'from-pink-500 via-rose-400 to-red-400',
    services: [
      {
        id: 'groom-001',
        title: 'Groomed By Elereka - Premium Hair Styling',
        description: 'Professional hair styling and grooming services by Elereka in Ikoyi. Specializing in traditional and contemporary Nigerian hairstyles.',
        category: 'barber',
        price: 35000,
        priceUnit: 'per_session',
        location: 'Ikoyi',
        rating: 4.9,
        reviewsCount: 156,
        image: '/assets/images/explore/Groomed-By-Elereka-Ikoyi-3.jpg',
        images: [
          '/assets/images/explore/Groomed-By-Elereka-Ikoyi-3.jpg',
          '/assets/images/explore/Groomed-By-Elereka-Ikoyi-13.jpg'
        ],
        amenities: ['Hair Styling', 'Braiding', 'Treatment', 'Consultation'],
        providerName: 'Groomed By Elereka',
        verified: true,
        available: true,
        duration: '2-3 hours'
      }
    ]
  },
  {
    id: 'golf-experiences',
    title: 'Golf & Country Clubs',
    description: 'Exclusive golf experiences at Lagos finest country clubs',
    icon: 'trophy',
    gradient: 'from-green-500 via-emerald-400 to-teal-400',
    services: [
      {
        id: 'golf-001',
        title: 'Lakowe Lakes Golf & Country Estate',
        description: 'Championship 18-hole golf course with lake views. Premium facilities including pro shop, restaurant, and luxury clubhouse.',
        category: 'sports',
        price: 85000,
        priceUnit: 'per_session',
        location: 'Lakowe, Ibeju-Lekki',
        rating: 4.8,
        reviewsCount: 89,
        image: '/assets/images/explore/Lakowe Lakes Golf & Country Estate .jpg',
        images: [
          '/assets/images/explore/Lakowe Lakes Golf & Country Estate .jpg',
          '/assets/images/explore/Lakowe Lakes Hotel, Golf and Country Estate by NEWMARK, Lagos.jpg',
          '/assets/images/explore/Golf Lake.jpg'
        ],
        amenities: ['18-Hole Course', 'Pro Shop', 'Restaurant', 'Clubhouse', 'Caddy Service'],
        providerName: 'Lakowe Lakes Golf & Country Estate',
        verified: true,
        available: true,
        duration: 'Full Day'
      },
      {
        id: 'golf-002',
        title: 'Lagos Acres Golf & Country Club',
        description: 'Exclusive golf club with championship course, practice facilities, and premium amenities. Perfect for serious golfers.',
        category: 'sports',
        price: 95000,
        priceUnit: 'per_session',
        location: 'Sangotedo, Lekki',
        rating: 4.9,
        reviewsCount: 67,
        image: '/assets/images/explore/Lagos Acres Golf & Country Club - GOLF Course Finder .png',
        images: [
          '/assets/images/explore/Lagos Acres Golf & Country Club - GOLF Course Finder .png'
        ],
        amenities: ['Championship Course', 'Practice Range', 'Pro Shop', 'Restaurant', 'Coaching'],
        providerName: 'Lagos Acres Golf & Country Club',
        verified: true,
        available: true,
        duration: 'Full Day'
      },
      {
        id: 'golf-003',
        title: 'Lawoke Golf Club',
        description: 'Intimate golf experience with scenic views and personalized service. Ideal for both beginners and experienced players.',
        category: 'sports',
        price: 65000,
        priceUnit: 'per_session',
        location: 'Lawoke, Ibeju-Lekki',
        rating: 4.7,
        reviewsCount: 45,
        image: '/assets/images/explore/Lawoke Gol.jpeg',
        images: [
          '/assets/images/explore/Lawoke Gol.jpeg'
        ],
        amenities: ['9-Hole Course', 'Practice Area', 'Club Rental', 'Refreshments'],
        providerName: 'Lawoke Golf Club',
        verified: true,
        available: true,
        duration: '4-6 hours'
      }
    ]
  }
];

export const getAllVIPServices = (): VIPService[] => {
  return VIP_SERVICES.flatMap(cat => cat.services);
};

export const getVIPServiceById = (id: string): VIPService | undefined => {
  return getAllVIPServices().find(s => s.id === id);
};

export const getVIPServicesByCategory = (category: VIPService['category']): VIPService[] => {
  return getAllVIPServices().filter(s => s.category === category);
};
