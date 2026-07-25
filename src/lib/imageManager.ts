const IMAGE_CACHE = new Map<string, string>();
const PRELOAD_QUEUE: string[] = [];

export interface ImageAsset {
  name: string;
  path: string;
  webpPath?: string;
  category: string;
  width?: number;
  height?: number;
}

const EXPLORE_LAGOS_IMAGE_MAP: Record<string, string> = {
  'tarkwa bay beach': '/assets/images/horizontal/IMG-20260621-WA0002.jpg',
  'elegushi royal beach': '/assets/images/horizontal/IMG-20260621-WA0003.jpg',
  'landmark beach': '/assets/images/horizontal/IMG-20260621-WA0004.jpg',
  'lekki conservation centre': '/assets/images/vertical/IMG-20260621-WA0002.jpg',
  'lufasi nature park': '/assets/images/vertical/IMG-20260621-WA0003.jpg',
  'national museum lagos': '/assets/images/horizontal/IMG-20260621-WA0005.jpg',
  'kalakuta republic museum': '/assets/images/horizontal/IMG-20260621-WA0006.jpg',
  'nike art gallery': '/assets/images/vertical/IMG-20260621-WA0004.jpg',
  'freedom park': '/assets/images/horizontal/IMG-20260621-WA0007.jpg',
  'yemisi shyllon museum': '/assets/images/vertical/IMG-20260621-WA0005.jpg',
  'rsvp restaurant': '/assets/images/horizontal/IMG-20260621-WA0008.jpg',
  'cilantro lagos': '/assets/images/horizontal/IMG-20260621-WA0009.jpg',
  'izanagi restaurant': '/assets/images/horizontal/IMG-20260621-WA0010.jpg',
  'quilox nightclub': '/assets/images/vertical/IMG-20260621-WA0006.jpg',
  'cubana bar': '/assets/images/horizontal/IMG-20260621-WA0011.jpg',
  'new afrika shrine': '/assets/images/vertical/IMG-20260621-WA0007.jpg',
  'alara lagos': '/assets/images/horizontal/IMG-20260621-WA0012.jpg',
  'ikeja city mall': '/assets/images/horizontal/IMG-20260621-WA0013.jpg',
  'balogun market': '/assets/images/vertical/IMG-20260621-WA0008.jpg',
  'lekki arts & crafts market': '/assets/images/vertical/IMG-20260621-WA0009.jpg',
  'nigerian designers': '/assets/images/horizontal/IMG-20260621-WA0014.jpg',
  'lagos island heritage walk': '/assets/images/horizontal/IMG-20260621-WA0015.jpg',
  'lekki lagoon sunset cruise': '/assets/images/horizontal/IMG-20260621-WA0016.jpg',
  'private yacht experience': '/assets/images/horizontal/IMG-20260621-WA0017.jpg',
  'lagos food tour': '/assets/images/vertical/IMG-20260621-WA0010.jpg',
  'corporate lagos experience': '/assets/images/horizontal/CozyLagos.jpeg',
};

const VIP_SERVICE_IMAGE_MAP: Record<string, string> = {
  'spa': '/assets/images/vertical/IMG-20260621-WA0011.jpg',
  'wellness': '/assets/images/vertical/IMG-20260621-WA0012.jpg',
  'barber': '/assets/images/vertical/IMG-20260621-WA0013.jpg',
  'beauty': '/assets/images/vertical/IMG-20260621-WA0014.jpg',
  'shopping': '/assets/images/horizontal/IMG-20260621-WA0018.jpg',
  'sports': '/assets/images/vertical/IMG-20260621-WA0015.jpg',
  'gym': '/assets/images/vertical/IMG-20260621-WA0016.jpg',
  'fitness': '/assets/images/vertical/IMG-20260621-WA0017.jpg',
  'laundry': '/assets/images/horizontal/IMG-20260621-WA0019.jpg',
  'chef': '/assets/images/horizontal/IMG-20260621-WA0020.jpg',
  'photography': '/assets/images/vertical/IMG-20260621-WA0018.jpg',
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

  return fallbackUrl || FALLBACK_IMAGE;
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
  const priorityImages = [
    EXPLORE_LAGOS_IMAGE_MAP['tarkwa bay beach'],
    EXPLORE_LAGOS_IMAGE_MAP['nike art gallery'],
    EXPLORE_LAGOS_IMAGE_MAP['rsvp restaurant'],
    EXPLORE_LAGOS_IMAGE_MAP['alara lagos'],
    EXPLORE_LAGOS_IMAGE_MAP['private yacht experience'],
    '/assets/bundles/bundles-hero-background.jpeg',
  ].filter(Boolean);

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => preloadImages(priorityImages));
  } else {
    setTimeout(() => preloadImages(priorityImages), 100);
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

export { EXPLORE_LAGOS_IMAGE_MAP, VIP_SERVICE_IMAGE_MAP, FALLBACK_IMAGE };
