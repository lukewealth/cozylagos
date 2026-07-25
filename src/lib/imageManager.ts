const IMAGE_CACHE = new Map<string, string>();

export interface ImageAsset {
  name: string;
  path: string;
  category: string;
}

const EXPLORE_LAGOS_IMAGE_MAP: Record<string, string> = {
  'elegushi royal beach': '/assets/images/explore/elegushi-royal-beach.avif',
  'national museum lagos': '/assets/images/explore/national-museum-lagos.jpg',
  'kalakuta republic museum': '/assets/images/explore/kalakuta-republic-museum.jpg',
  'nike art gallery': '/assets/images/explore/nike-art-gallery.jpg',
  'rsvp restaurant': '/assets/images/explore/rsvp-restaurant.jpg',
  'cilantro lagos': '/assets/images/explore/cilantro-lagos.png',
  'izanagi restaurant': '/assets/images/explore/izanagi-restaurant.webp',
  'alara lagos': '/assets/images/explore/alara-lagos.webp',
  'ikeja city mall': '/assets/images/explore/ikeja-city-mall.jpg',
  'balogun market': '/assets/images/explore/balogun-market.jpg',
  'lagos island heritage walk': '/assets/images/explore/lagos-island-heritage-walk.jpg',
  'lekki lagoon sunset cruise': '/assets/images/explore/lekki-lagoon-sunset-cruise.avif',
  'private yacht experience': 'https://images.pexels.com/photos/37405043/pexels-photo-37405043.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const EXPLORE_LAGOS_SECONDARY_MAP: Record<string, string[]> = {
  'elegushi royal beach': ['/assets/images/secondary/elegushi-beach-2.webp'],
  'national museum lagos': ['/assets/images/secondary/national-museum-2.jpg', '/assets/images/secondary/national-museum-3.jpg'],
  'kalakuta republic museum': ['/assets/images/secondary/kalakuta-museum-2.avif', '/assets/images/secondary/kalakuta-museum-3.jpeg'],
  'nike art gallery': ['/assets/images/secondary/nike-art-2.jpg'],
  'rsvp restaurant': ['/assets/images/secondary/rsvp-restaurant-2.jpg'],
  'cilantro lagos': ['/assets/images/secondary/cilantro-lagos-2.jpg', '/assets/images/secondary/cilantro-lagos-3.jpg'],
  'alara lagos': ['/assets/images/secondary/alara-lagos-2.webp', '/assets/images/secondary/alara-lagos-3.jpeg'],
  'balogun market': ['/assets/images/secondary/balogun-market-2.jpeg', '/assets/images/secondary/balogun-market-3.jpg'],
  'lagos island heritage walk': ['/assets/images/secondary/heritage-walk-2.jpeg'],
  'lekki lagoon sunset cruise': ['/assets/images/secondary/lekki-cruise-2.jpg'],
};

const EXPLORE_LAGOS_FALLBACKS: Record<string, string> = {
  'tarkwa bay beach': '/assets/images/horizontal/IMG-20260621-WA0002.jpg',
  'landmark beach': '/assets/images/horizontal/IMG-20260621-WA0004.jpg',
  'lekki conservation centre': '/assets/images/vertical/IMG-20260621-WA0002.jpg',
  'lufasi nature park': '/assets/images/vertical/IMG-20260621-WA0003.jpg',
  'freedom park': '/assets/images/horizontal/IMG-20260621-WA0007.jpg',
  'yemisi shyllon museum': '/assets/images/vertical/IMG-20260621-WA0005.jpg',
  'quilox nightclub': '/assets/images/vertical/IMG-20260621-WA0006.jpg',
  'cubana bar': '/assets/images/horizontal/IMG-20260621-WA0011.jpg',
  'new afrika shrine': '/assets/images/vertical/IMG-20260621-WA0007.jpg',
  'lekki arts & crafts market': '/assets/images/vertical/IMG-20260621-WA0009.jpg',
  'nigerian designers': '/assets/images/horizontal/IMG-20260621-WA0014.jpg',
  'private yacht experience': '/assets/images/horizontal/IMG-20260621-WA0017.jpg',
  'lagos food tour': '/assets/images/vertical/IMG-20260621-WA0010.jpg',
  'corporate lagos experience': '/assets/images/horizontal/CozyLagos.jpeg',
};

const VIP_SERVICE_IMAGE_MAP: Record<string, string> = {
  'spa': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
  'wellness': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
  'barber': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80',
  'beauty': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  'shopping': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'sports': 'https://images.unsplash.com/photo-1535139262971-c51845709a48?w=800&q=80',
  'gym': 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
  'fitness': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  'laundry': 'https://images.unsplash.com/photo-1545173168-9f1947eebb8f?w=800&q=80',
  'chef': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
  'photography': 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80',
  'transport': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
  'yacht': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
  'marine': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
  'events': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
  'nightlife': 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
  'property': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
  'luxury': 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
};

const FALLBACK_IMAGE = '/assets/images/horizontal/CozyLagos.jpeg';

export function resolveExploreImage(title: string, fallbackUrl?: string): string {
  const key = title.toLowerCase().trim();
  
  if (EXPLORE_LAGOS_IMAGE_MAP[key]) {
    return EXPLORE_LAGOS_IMAGE_MAP[key];
  }

  for (const [mapKey, mapPath] of Object.entries(EXPLORE_LAGOS_IMAGE_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return mapPath;
    }
  }

  if (EXPLORE_LAGOS_FALLBACKS[key]) {
    return EXPLORE_LAGOS_FALLBACKS[key];
  }

  for (const [mapKey, mapPath] of Object.entries(EXPLORE_LAGOS_FALLBACKS)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return mapPath;
    }
  }

  return fallbackUrl || FALLBACK_IMAGE;
}

export function resolveExploreImages(title: string): string[] {
  const key = title.toLowerCase().trim();
  const primary = resolveExploreImage(title);
  const secondary = EXPLORE_LAGOS_SECONDARY_MAP[key] || [];
  return [primary, ...secondary];
}

export function resolveServiceImage(category: string, title?: string, fallbackUrl?: string): string {
  const key = (title || category).toLowerCase().trim();

  for (const [mapKey, mapPath] of Object.entries(VIP_SERVICE_IMAGE_MAP)) {
    if (key.includes(mapKey)) {
      return mapPath;
    }
  }

  if (VIP_SERVICE_IMAGE_MAP[category.toLowerCase()]) {
    return VIP_SERVICE_IMAGE_MAP[category.toLowerCase()];
  }

  return fallbackUrl || FALLBACK_IMAGE;
}

export function resolveAssetImage(name: string, category: string, fallbackUrl?: string): string {
  const key = name.toLowerCase().trim();

  for (const [mapKey, mapPath] of Object.entries(VIP_SERVICE_IMAGE_MAP)) {
    if (key.includes(mapKey) || category.toLowerCase().includes(mapKey)) {
      return mapPath;
    }
  }

  return fallbackUrl || FALLBACK_IMAGE;
}

export function getWebPSrc(src: string): string {
  if (src.startsWith('http') || src.startsWith('data:')) return src;
  return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (IMAGE_CACHE.has(src)) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => {
      IMAGE_CACHE.set(src, src);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

export function preloadExploreImages(): void {
  const allImages = [
    ...Object.values(EXPLORE_LAGOS_IMAGE_MAP),
    ...Object.values(EXPLORE_LAGOS_SECONDARY_MAP).flat(),
  ].slice(0, 20);
  
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => preloadImages(allImages));
  } else {
    setTimeout(() => preloadImages(allImages), 100);
  }
}

export function preloadServiceImages(): void {
  const priorityImages = Object.values(VIP_SERVICE_IMAGE_MAP).slice(0, 6);
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => preloadImages(priorityImages));
  } else {
    setTimeout(() => preloadImages(priorityImages), 200);
  }
}

export function getImageCacheSize(): number {
  return IMAGE_CACHE.size;
}

export function clearImageCache(): void {
  IMAGE_CACHE.clear();
}

export { EXPLORE_LAGOS_IMAGE_MAP, EXPLORE_LAGOS_SECONDARY_MAP, VIP_SERVICE_IMAGE_MAP, FALLBACK_IMAGE };
