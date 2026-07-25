export interface MediaEntry {
  url: string;
  alt: string;
  keywords: string[];
  source: 'unsplash' | 'pexels' | 'eko_atlantic' | 'discover_lagos' | 'cozylagos';
  photographer?: string;
  license: string;
  licenseUrl?: string;
  copyrightOwner: string;
  location: string;
  confidence: number;
}

const U = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;
const P = (id: string, w = 800) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const unsplashEntry = (
  id: string,
  alt: string,
  keywords: string[],
  location: string,
  confidence: number,
  photographer?: string,
  w = 800
): MediaEntry => ({
  url: U(id, w),
  alt,
  keywords,
  source: 'unsplash',
  photographer,
  license: 'CC BY 2.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  copyrightOwner: photographer || 'Unsplash Contributor',
  location,
  confidence,
});

const pexelsEntry = (
  id: string,
  alt: string,
  keywords: string[],
  location: string,
  confidence: number,
  photographer?: string,
  w = 800
): MediaEntry => ({
  url: P(id, w),
  alt,
  keywords,
  source: 'pexels',
  photographer,
  license: 'Pexels Free Use',
  licenseUrl: 'https://www.pexels.com/license/',
  copyrightOwner: photographer || 'Pexels Contributor',
  location,
  confidence,
});

export const mediaRegistry: Record<string, MediaEntry> = {

  // ─── PROPERTIES (Luxury Apartments, Villas, Penthouse) ───
  'prop-ekpo-1br': unsplashEntry(
    '1613490493576-7fde63acd811',
    'Luxury 1-bedroom serviced apartment with pool in Lekki, Lagos',
    ['lekki', 'apartment', 'pool', 'luxury', 'lagos', 'serviced'],
    'Lekki Phase 1, Lagos', 0.85
  ),
  'prop-ekpo-1br-alt': unsplashEntry(
    '1512917774080-9991f1c4c750',
    'Modern luxury villa exterior with landscaping in Lagos',
    ['villa', 'exterior', 'luxury', 'lagos', 'modern'],
    'Lekki, Lagos', 0.80
  ),
  'prop-studio-lekki': unsplashEntry(
    '1522708323590-d24dbb6b0267',
    'Contemporary studio apartment interior with pool view in Lekki',
    ['studio', 'lekki', 'interior', 'pool', 'modern', 'lagos'],
    'Lekki Phase 1, Lagos', 0.85
  ),
  'prop-studio-lekki-alt': unsplashEntry(
    '1502672260266-1c1ef2d93688',
    'Luxury apartment living room with natural light',
    ['apartment', 'living room', 'interior', 'luxury'],
    'Lagos', 0.80
  ),
  'prop-whitestone-2br': unsplashEntry(
    '1600596542815-ffad4c1539a9',
    'Luxury 2-bedroom residence with swimming pool in Lekki',
    ['2br', 'lekki', 'pool', 'luxury', 'residence', 'lagos'],
    'Lekki Phase 1, Lagos', 0.85
  ),
  'prop-whitestone-2br-alt': unsplashEntry(
    '1600607687939-ce8a6c25118c',
    'Elegant luxury home interior with modern design',
    ['interior', 'luxury', 'modern', 'home'],
    'Lagos', 0.80
  ),
  'prop-maisonette-lekki': unsplashEntry(
    '1600585154340-be6161a56a0c',
    'Luxury maisonette apartment exterior in Lekki estate',
    ['maisonette', 'lekki', 'estate', 'luxury', 'exterior'],
    'Lekki Phase 1, Lagos', 0.85
  ),
  'prop-maisonette-lekki-alt': unsplashEntry(
    '1600566753190-17f0baa2a6c3',
    'Modern luxury house with evening lighting',
    ['house', 'exterior', 'luxury', 'evening'],
    'Lagos', 0.80
  ),
  'prop-victoria-penthouse': unsplashEntry(
    '1600566753086-00f18fb6b3ea',
    'Luxury penthouse interior with ocean view in Victoria Island',
    ['penthouse', 'victoria island', 'ocean view', 'luxury', 'interior'],
    'Victoria Island, Lagos', 0.85
  ),
  'prop-oniru-1br': unsplashEntry(
    '1560448204-e02f11c3d0e2',
    'Modern 1-bedroom serviced apartment in Oniru, Lagos',
    ['1br', 'oniru', 'serviced', 'apartment', 'modern'],
    'Oniru, Victoria Island, Lagos', 0.80
  ),
  'prop-oniru-1br-alt': unsplashEntry(
    '1560185007-cde436f6a4d0',
    'Contemporary apartment bedroom with luxury finishes',
    ['bedroom', 'apartment', 'luxury', 'modern'],
    'Lagos', 0.75
  ),
  'prop-cozy-admiralty-2br': unsplashEntry(
    '1600585154526-990dced4db0d',
    'Cozy 2-bedroom apartment on Admiralty Way, Lekki',
    ['2br', 'admiralty', 'lekki', 'cozy', 'apartment'],
    'Admiralty Way, Lekki Phase 1, Lagos', 0.85
  ),
  'prop-cozy-admiralty-alt': unsplashEntry(
    '1600573472592-401b489a3cdc',
    'Modern apartment interior with open floor plan',
    ['apartment', 'interior', 'modern', 'open plan'],
    'Lekki, Lagos', 0.80
  ),
  'prop-luxury-admiralty-2br': unsplashEntry(
    '1600047509807-ba8f99d2cdde',
    'Luxury 2-bedroom apartment with premium finishes in Lekki',
    ['2br', 'lekki', 'luxury', 'premium', 'apartment'],
    'Admiralty Way, Lekki Phase 1, Lagos', 0.85
  ),
  'prop-luxury-admiralty-alt': unsplashEntry(
    '1600566752355-35792bedcfea',
    'Luxury apartment bathroom with modern fixtures',
    ['bathroom', 'luxury', 'modern', 'apartment'],
    'Lekki, Lagos', 0.75
  ),
  'prop-ikoyi-executive-3br': unsplashEntry(
    '1600210492486-724fe5c67fb0',
    'Executive 3-bedroom apartment with lagoon views in Ikoyi',
    ['3br', 'ikoyi', 'executive', 'lagoon view', 'luxury'],
    'Ikoyi, Lagos', 0.85
  ),

  // ─── SERVICES - CHEF ───
  'services-chef-private': unsplashEntry(
    '1556910103-1c02745aae4d',
    'Professional private chef preparing gourmet meal in Lagos kitchen',
    ['chef', 'private chef', 'cooking', 'gourmet', 'lagos', 'nigerian'],
    'Lagos, Nigeria', 0.90
  ),
  'services-chef-kitchen': unsplashEntry(
    '1577219491135-ce391730fb2c',
    'Chef working in professional kitchen preparing African cuisine',
    ['chef', 'kitchen', 'professional', 'cooking', 'african cuisine'],
    'Lagos, Nigeria', 0.85
  ),

  // ─── SERVICES - TRANSPORT / CHAUFFEUR ───
  'services-chauffeur': unsplashEntry(
    '1533473359331-0135ef1b58bf',
    'Executive chauffeur driving luxury sedan in Lagos',
    ['chauffeur', 'luxury car', 'executive', 'transport', 'lagos'],
    'Lagos, Nigeria', 0.90
  ),

  // ─── SERVICES - YACHT / MARINE ───
  'services-yacht': unsplashEntry(
    '1567899378494-47b22a2ae96a',
    'Luxury yacht on Lagos lagoon at sunset',
    ['yacht', 'luxury', 'lagoon', 'sunset', 'marine', 'lagos'],
    'Lagos Lagoon, Nigeria', 0.95
  ),

  // ─── SERVICES - SPA & WELLNESS ───
  'services-spa': unsplashEntry(
    '1600334129128-685c5582fd35',
    'Premium spa treatment room with ambient lighting',
    ['spa', 'treatment', 'wellness', 'massage', 'luxury'],
    'Lagos, Nigeria', 0.80
  ),
  'services-spa-wellness': unsplashEntry(
    '1544161515-4ab6ce6db874',
    'Wellness spa treatment with hot stones and aromatherapy',
    ['spa', 'wellness', 'hot stones', 'aromatherapy', 'massage'],
    'Lagos, Nigeria', 0.85
  ),
  'services-spa-treatment': unsplashEntry(
    '1547471080-7cc2caa01a7e',
    'Relaxing spa treatment session at luxury resort',
    ['spa', 'treatment', 'relaxation', 'resort'],
    'Lagos, Nigeria', 0.80
  ),

  // ─── SERVICES - BARBER & GROOMING ───
  'services-barber': unsplashEntry(
    '1599351431202-1e0f0137899a',
    'Professional barber providing premium grooming service',
    ['barber', 'grooming', 'haircut', 'premium', 'men'],
    'Lagos, Nigeria', 0.85
  ),

  // ─── SERVICES - SHOPPING & FASHION ───
  'services-shopping': unsplashEntry(
    '1558618666-fcd25c85cd64',
    'African fashion and textiles at Lagos market',
    ['fashion', 'shopping', 'african', 'textiles', 'market', 'lagos'],
    'Lagos, Nigeria', 0.85
  ),
  'services-shopping-alt': unsplashEntry(
    '1441984904996-e0b6ba687e04',
    'Modern retail shopping experience',
    ['shopping', 'retail', 'fashion', 'store'],
    'Lagos, Nigeria', 0.70
  ),
  'services-shopping-fashion': unsplashEntry(
    '1581578731548-c64695cc6952',
    'Fashion shopping and retail experience',
    ['fashion', 'shopping', 'retail', 'style'],
    'Lagos, Nigeria', 0.75
  ),

  // ─── SERVICES - SPORTS & FITNESS ───
  'services-sports': unsplashEntry(
    '1554068865-24cecd4e34b8',
    'Sports and recreation facility in Lagos',
    ['sports', 'recreation', 'facility', 'lagos'],
    'Lagos, Nigeria', 0.75
  ),
  'services-gym': unsplashEntry(
    '1534438327276-14e5300c3a48',
    'Modern gym interior with fitness equipment',
    ['gym', 'fitness', 'equipment', 'modern', 'interior'],
    'Lagos, Nigeria', 0.80
  ),
  'services-fitness': unsplashEntry(
    '1571902943202-507ec2618e8f',
    'Personal fitness training session at Lagos gym',
    ['fitness', 'training', 'gym', 'personal trainer'],
    'Lagos, Nigeria', 0.80
  ),
  'services-fitness-alt': unsplashEntry(
    '1571019614242-c5c5dee9f50b',
    'Group fitness class at modern gym',
    ['fitness', 'group class', 'gym', 'workout'],
    'Lagos, Nigeria', 0.75
  ),

  // ─── SERVICES - PHOTOGRAPHY ───
  'services-photography': unsplashEntry(
    '1554048612-b6a482bc67e5',
    'Professional photography session in Lagos',
    ['photography', 'professional', 'camera', 'photoshoot', 'lagos'],
    'Lagos, Nigeria', 0.85
  ),

  // ─── SERVICES - LAUNDRY ───
  'services-laundry': unsplashEntry(
    '1545173168-9f1947eebb8f',
    'Professional laundry and valet service',
    ['laundry', 'valet', 'professional', 'cleaning'],
    'Lagos, Nigeria', 0.70
  ),

  // ─── SERVICES - BEAUTY ───
  'services-beauty': unsplashEntry(
    '1522337360788-8b13dee7a37e',
    'Beauty and styling session at Lagos salon',
    ['beauty', 'salon', 'styling', 'hair', 'lagos'],
    'Lagos, Nigeria', 0.75
  ),

  // ─── EVENTS & NIGHTLIFE ───
  'events-concert': unsplashEntry(
    '1459749411175-04bf5292ceea',
    'Live concert event with crowd and stage lighting',
    ['concert', 'live music', 'event', 'crowd', 'stage'],
    'Lagos, Nigeria', 0.80
  ),
  'events-festival': unsplashEntry(
    '1533174072545-7a4b6ad7a6c3',
    'Music festival celebration with crowd and lights',
    ['festival', 'music', 'celebration', 'crowd', 'lights'],
    'Lagos, Nigeria', 0.80
  ),
  'events-jazz': unsplashEntry(
    '1514320291840-2e0a9bf2a9ae',
    'Live jazz music performance at intimate venue',
    ['jazz', 'live music', 'performance', 'intimate', 'venue'],
    'Victoria Island, Lagos', 0.85
  ),

  // ─── BUSINESS & CONFERENCES ───
  'business-skyscraper': unsplashEntry(
    '1486406146926-c627a92ad1ab',
    'Modern business skyscraper representing Lagos commercial district',
    ['business', 'skyscraper', 'commercial', 'lagos', 'corporate'],
    'Victoria Island, Lagos', 0.85
  ),
  'business-coworking-1': unsplashEntry(
    '1497366216548-37526070297c',
    'Modern coworking office space with clean design',
    ['coworking', 'office', 'modern', 'workspace'],
    'Lagos, Nigeria', 0.70
  ),
  'business-transport': unsplashEntry(
    '1549317661-bd32c8ce0db2',
    'Executive transportation for business meetings',
    ['executive', 'transport', 'business', 'meeting'],
    'Lagos, Nigeria', 0.70
  ),
  'business-concierge': unsplashEntry(
    '1556761175-5973dc0f32e7',
    'Business concierge service in professional setting',
    ['concierge', 'business', 'professional', 'service'],
    'Lagos, Nigeria', 0.70
  ),
  'business-meeting': unsplashEntry(
    '1497366811353-6870744d04b2',
    'Professional meeting space with modern amenities',
    ['meeting', 'conference', 'professional', 'office'],
    'Lagos, Nigeria', 0.70
  ),
  'business-team': unsplashEntry(
    '1522071820081-009f0129c71c',
    'Team collaboration in modern office environment',
    ['team', 'collaboration', 'office', 'modern'],
    'Lagos, Nigeria', 0.70
  ),

  // ─── HERO BANNERS & HOTEL ───
  'hero-hotel': unsplashEntry(
    '1566073771259-6a8506099945',
    'Luxury hotel resort with pool and tropical landscaping',
    ['hotel', 'resort', 'luxury', 'pool', 'tropical', 'lagos'],
    'Lagos, Nigeria', 0.90
  ),
  'hero-hotel-pool': unsplashEntry(
    '1494438639946-1ebd1d20bf85',
    'Luxury hotel pool area with lounge chairs',
    ['hotel', 'pool', 'luxury', 'lounge', 'resort'],
    'Lagos, Nigeria', 0.85
  ),

  // ─── LUXURY INTERIORS & RESORTS ───
  'luxury-interior': unsplashEntry(
    '1506905925346-21bda4d32df4',
    'Luxury interior design with premium furnishings',
    ['luxury', 'interior', 'premium', 'furnishing'],
    'Lagos, Nigeria', 0.80
  ),
  'luxury-resort': unsplashEntry(
    '1596394516093-501ba68a0ba6',
    'Luxury resort accommodation with premium amenities',
    ['resort', 'luxury', 'accommodation', 'premium'],
    'Lagos, Nigeria', 0.85
  ),
  'luxury-bedroom': unsplashEntry(
    '1609920658906-8223bd289001',
    'Luxury bedroom suite with elegant decor',
    ['bedroom', 'luxury', 'suite', 'elegant'],
    'Lagos, Nigeria', 0.85
  ),
  'luxury-apartment-interior': unsplashEntry(
    '1540555700478-4be289fbecef',
    'Modern luxury apartment interior with contemporary design',
    ['apartment', 'interior', 'modern', 'luxury', 'contemporary'],
    'Lagos, Nigeria', 0.80
  ),

  // ─── BEACH & COASTAL ───
  'beach-tropical': unsplashEntry(
    '1590523741831-ab7e8b8f9c7f',
    'Tropical beach scene with palm trees and clear water',
    ['beach', 'tropical', 'palm trees', 'coastal', 'lagos'],
    'Elegushi Beach, Lagos', 0.90
  ),
  'beach-coastal': unsplashEntry(
    '1549060279-7e168fcee0c2',
    'Beautiful coastal beach with golden sand',
    ['beach', 'coastal', 'sand', 'ocean', 'lagos'],
    'Lagos coastline', 0.85
  ),

  // ─── POOL & LUXURY LIFESTYLE ───
  'pool-luxury': unsplashEntry(
    '1535139262971-c51845709a48',
    'Luxury swimming pool with modern surroundings',
    ['pool', 'luxury', 'swimming', 'modern'],
    'Lagos, Nigeria', 0.85
  ),

  // ─── FOOD & DINING ───
  'food-dining': unsplashEntry(
    '1555939594-58d7cb561ad1',
    'Gourmet food plating at fine dining restaurant',
    ['food', 'dining', 'gourmet', 'restaurant', 'fine dining'],
    'Lagos, Nigeria', 0.85
  ),
  'food-plating': unsplashEntry(
    '1585409677983-0f6c41ca9c3b',
    'Artfully plated gourmet dish by professional chef',
    ['food', 'plating', 'gourmet', 'chef', 'culinary'],
    'Lagos, Nigeria', 0.85
  ),

  // ─── TECH & CONFERENCES ───
  'tech-conference': unsplashEntry(
    '1540575467063-178a50c2df87',
    'Technology conference with audience and presentation',
    ['tech', 'conference', 'presentation', 'audience', 'innovation'],
    'Lagos, Nigeria', 0.80
  ),

  // ─── AFRICAN LUXURY ───
  'african-luxury': unsplashEntry(
    '1574362848149-11496d93a7c7',
    'African-inspired luxury interior with cultural elements',
    ['african', 'luxury', 'interior', 'cultural', 'design'],
    'Lagos, Nigeria', 0.85
  ),

  // ─── LAGOS CITYSCAPE ───
  'lagos-cityscape': unsplashEntry(
    '1516026672322-bc52d61a55d5',
    'Lagos cityscape showing urban skyline and development',
    ['lagos', 'cityscape', 'skyline', 'urban', 'nigeria'],
    'Lagos, Nigeria', 0.95
  ),

  // ─── YACHT EXPERIENCE VIEW IMAGES ───
  'yacht-exp-1': unsplashEntry(
    '1540962351504-03099e0a754b',
    'Luxury yacht experience on Lagos waterways',
    ['yacht', 'luxury', 'waterway', 'lagos', 'cruise'],
    'Lagos Lagoon', 0.85
  ),
  'yacht-exp-2': unsplashEntry(
    '1582719478250-c89cae4dc85b',
    'Premium hotel suite with luxury amenities',
    ['hotel', 'suite', 'luxury', 'premium'],
    'Lagos, Nigeria', 0.80
  ),

  // ─── SMART RECOMMENDATIONS ───
  'recommend-hotel': unsplashEntry(
    '1494438639946-1ebd1d20bf85',
    'Recommended luxury hotel stay in Lagos',
    ['hotel', 'luxury', 'recommendation', 'lagos'],
    'Lagos, Nigeria', 0.85
  ),

  // ─── STAFF / AVATAR DEFAULT ───
  'avatar-default': unsplashEntry(
    '1507003211169-0a1dd7228f2d',
    'Default avatar portrait',
    ['avatar', 'portrait', 'default'],
    'Lagos, Nigeria', 0.50
  ),

  // ─── PEKELS VIP SERVICES (Spa & Wellness) ───
  'pexels-spa-deep-tissue': pexelsEntry(
    '36497917',
    'Deep tissue massage therapy session at Serenity Spa Ikoyi',
    ['spa', 'massage', 'deep tissue', 'ikoyi', 'lagos'],
    'Ikoyi, Lagos', 0.85
  ),
  'pexels-spa-hammam': pexelsEntry(
    '36436448',
    'Royal hammam spa experience with traditional treatments',
    ['hammam', 'spa', 'traditional', 'wellness'],
    'Victoria Island, Lagos', 0.85
  ),
  'pexels-spa-couples': pexelsEntry(
    '36467274',
    'Couples spa package with romantic ambiance',
    ['couples', 'spa', 'romantic', 'package'],
    'Lekki Phase 1, Lagos', 0.85
  ),

  // ─── PEKELS VIP SERVICES (Barber & Grooming) ───
  'pexels-barber-executive': pexelsEntry(
    '30699431',
    'Executive haircut and styling at premium barbershop',
    ['barber', 'haircut', 'executive', 'styling'],
    'Ikoyi, Lagos', 0.85
  ),
  'pexels-barber-royal': pexelsEntry(
    '33418521',
    'Royal grooming package with facial and manicure',
    ['grooming', 'royal', 'facial', 'manicure'],
    'Victoria Island, Lagos', 0.85
  ),
  'pexels-barber-mobile': pexelsEntry(
    '36960650',
    'In-room mobile barber service with professional setup',
    ['barber', 'mobile', 'in-room', 'professional'],
    'All Lagos', 0.85
  ),

  // ─── PEKELS VIP SERVICES (Shopping) ───
  'pexels-shopping-personal': pexelsEntry(
    '36790085',
    'Personal shopper experience at Lagos mall',
    ['shopping', 'personal shopper', 'mall', 'luxury'],
    'Lekki Phase 1, Lagos', 0.80
  ),
  'pexels-shopping-fashion': pexelsEntry(
    '36445251',
    'Luxury fashion tour through Lagos designer stores',
    ['fashion', 'luxury', 'designer', 'tour'],
    'Victoria Island & Ikoyi, Lagos', 0.80
  ),
  'pexels-shopping-artisan': pexelsEntry(
    '16114746',
    'Artisan market guide through Lekki Market',
    ['market', 'artisan', 'lekki', 'cultural'],
    'Lekki Phase 1, Lagos', 0.80
  ),

  // ─── PEKELS VIP SERVICES (Sports) ───
  'pexels-sports-tennis': pexelsEntry(
    '34043569',
    'Tennis court reservation at Ikoyi Club',
    ['tennis', 'court', 'ikoyi club', 'sports'],
    'Ikoyi, Lagos', 0.85
  ),
  'pexels-sports-golf': pexelsEntry(
    '38277835',
    'Golf session at Eko Atlantic with professional caddy',
    ['golf', 'eko atlantic', 'caddy', 'luxury sport'],
    'Victoria Island, Lagos', 0.85
  ),
  'pexels-sports-swimming': pexelsEntry(
    '14346826',
    'Olympic swimming pool access at Lekki Sports Club',
    ['swimming', 'pool', 'olympic', 'sports club'],
    'Lekki Phase 1, Lagos', 0.80
  ),

  // ─── PEKELS VIP SERVICES (Gym & Fitness) ───
  'pexels-gym-personal': pexelsEntry(
    '33832205',
    'Personal training session at The Fitness Hub VI',
    ['gym', 'personal training', 'fitness', 'vi'],
    'Victoria Island, Lagos', 0.85
  ),
  'pexels-gym-yoga': pexelsEntry(
    '3768593',
    'Private yoga and meditation class at Zen Yoga Studio',
    ['yoga', 'meditation', 'private', 'zen'],
    'Lekki Phase 1, Lagos', 0.85
  ),
  'pexels-gym-crossfit': pexelsEntry(
    '37137276',
    'CrossFit WOD session with certified coach',
    ['crossfit', 'wod', 'coach', 'fitness'],
    'Ikoyi, Lagos', 0.85
  ),

  // ─── PEKELS VIP SERVICES (Laundry) ───
  'pexels-laundry-express': pexelsEntry(
    '15451731',
    'Express laundry service with pickup and delivery',
    ['laundry', 'express', 'pickup', 'delivery'],
    'All Lagos', 0.75
  ),
  'pexels-laundry-dry-cleaning': pexelsEntry(
    '15827357',
    'Premium dry cleaning for suits and delicate fabrics',
    ['dry cleaning', 'premium', 'suits', 'fabric care'],
    'All Lagos', 0.75
  ),
  'pexels-laundry-ironing': pexelsEntry(
    '16105580',
    'Professional in-room ironing and garment steaming',
    ['ironing', 'steaming', 'mobile', 'garment care'],
    'All Lagos', 0.75
  ),

  // ─── PEKELS VIP SERVICES (Chef) ───
  'pexels-chef-dinner': pexelsEntry(
    '31095002',
    'Private dinner chef preparing 5-course meal',
    ['chef', 'private dinner', '5-course', 'gourmet'],
    'All Lagos', 0.85
  ),
  'pexels-chef-nigerian': pexelsEntry(
    '13915043',
    'Authentic Nigerian cuisine prepared by master chef',
    ['nigerian cuisine', 'jollof', 'egusi', 'traditional'],
    'All Lagos', 0.90
  ),
  'pexels-chef-breakfast': pexelsEntry(
    '37624176',
    'Gourmet breakfast and brunch service',
    ['breakfast', 'brunch', 'gourmet', 'continental'],
    'All Lagos', 0.80
  ),

  // ─── PEKELS VIP SERVICES (Photography) ───
  'pexels-photo-shoot': pexelsEntry(
    '31951217',
    'Professional photoshoot with edited digital images',
    ['photoshoot', 'professional', 'digital', 'edited'],
    'All Lagos', 0.85
  ),
  'pexels-photo-video': pexelsEntry(
    '16114743',
    'Event videography with 4K coverage',
    ['videography', '4k', 'event', 'drone'],
    'All Lagos', 0.85
  ),
  'pexels-photo-content': pexelsEntry(
    '30402282',
    'Social media content creation package',
    ['content', 'social media', 'instagram', 'reels'],
    'All Lagos', 0.80
  ),

  // ─── EKO ATLANTIC OFFICIAL IMAGES ───
  'eko-atlantic-hero': {
    url: 'https://www.ekoatlantic.com/images/wp/hero.webp',
    alt: 'Aerial view of Eko Atlantic city development in Lagos',
    keywords: ['eko atlantic', 'aerial', 'city', 'development', 'lagos', 'skyline'],
    source: 'eko_atlantic',
    license: 'All Rights Reserved',
    copyrightOwner: 'Eko Atlantic City Limited',
    location: 'Eko Atlantic, Victoria Island, Lagos',
    confidence: 1.0,
  },
  'eko-atlantic-aerial': {
    url: 'https://www.ekoatlantic.com/images/wp/aerial1.webp',
    alt: 'Aerial photograph of Eko Atlantic reclaimed city',
    keywords: ['eko atlantic', 'aerial', 'reclaimed land', 'ocean', 'lagos'],
    source: 'eko_atlantic',
    license: 'All Rights Reserved',
    copyrightOwner: 'Eko Atlantic City Limited',
    location: 'Eko Atlantic, Victoria Island, Lagos',
    confidence: 1.0,
  },
  'eko-atlantic-residential': {
    url: 'https://www.ekoatlantic.com/images/wp/resPan.webp',
    alt: 'Residential panorama of Eko Atlantic waterfront',
    keywords: ['eko atlantic', 'residential', 'waterfront', 'panorama', 'luxury'],
    source: 'eko_atlantic',
    license: 'All Rights Reserved',
    copyrightOwner: 'Eko Atlantic City Limited',
    location: 'Eko Atlantic, Victoria Island, Lagos',
    confidence: 1.0,
  },
  'eko-atlantic-commercial': {
    url: 'https://www.ekoatlantic.com/images/wp/prodCommercial.webp',
    alt: 'Commercial district of Eko Atlantic business hub',
    keywords: ['eko atlantic', 'commercial', 'business', 'district', 'corporate'],
    source: 'eko_atlantic',
    license: 'All Rights Reserved',
    copyrightOwner: 'Eko Atlantic City Limited',
    location: 'Eko Atlantic, Victoria Island, Lagos',
    confidence: 1.0,
  },
};

export function getMediaByKey(key: string): MediaEntry | undefined {
  return mediaRegistry[key];
}

export function getMediaByCategory(category: string): MediaEntry[] {
  return Object.values(mediaRegistry).filter(entry =>
    entry.keywords.some(k => k.includes(category.toLowerCase()))
  );
}

export function searchMedia(query: string): MediaEntry[] {
  const lower = query.toLowerCase();
  return Object.values(mediaRegistry).filter(entry =>
    entry.alt.toLowerCase().includes(lower) ||
    entry.keywords.some(k => k.includes(lower)) ||
    entry.location.toLowerCase().includes(lower)
  );
}

export function getAttributionText(entry: MediaEntry): string {
  const parts: string[] = [];
  if (entry.photographer) parts.push(`Photo by ${entry.photographer}`);
  if (entry.source === 'unsplash') parts.push('on Unsplash');
  if (entry.source === 'pexels') parts.push('on Pexels');
  if (entry.source === 'eko_atlantic') parts.push('© Eko Atlantic City Limited');
  return parts.join(' ') || `© ${entry.copyrightOwner}`;
}

export { U as unsplashUrl, P as pexelsUrl };
