# Missing Images Report

**Generated:** 2026-07-25  
**Project:** CozyLagos Luxury Hospitality Platform

---

## Overview

This document tracks images that could not be replaced with authentic Lagos/Nigeria/Africa-themed imagery. These are images where:
- No verified Lagos-specific alternative was available
- The current image is generic stock but functional (not broken)
- A Lagos-specific replacement would require custom photography

---

## Images Still Using Generic Stock

### 1. Business Services (data-new-sections.ts)

These 6 business service images use generic stock photos. While they represent the concept well, they are not specifically Lagos/Nigeria:

| Service | Current Image | Issue | Recommended Action |
|---------|--------------|-------|-------------------|
| Corporate Housing | `photo-1497366216548-37526070297c` (generic office) | Not Lagos-specific | Commission Lagos office photography |
| Executive Transportation | `photo-1549317661-bd32c8ce0db2` (generic car) | Not Lagos-specific | Commission Lagos chauffeur photography |
| Business Concierge | `photo-1556761175-5973dc0f32e7` (generic meeting) | Not Lagos-specific | Commission Lagos business photography |
| Meeting Spaces | `photo-1497366811353-6870744d04b2` (generic conference) | Not Lagos-specific | Commission Lagos meeting space photography |
| Relocation Services | `photo-1600585154340-be6161a56a0c` (generic house) | Not Lagos-specific | Already used for Lekki maisonette - acceptable |
| Team Accommodation | `photo-1522071820081-009f0129c71c` (generic team) | Not Lagos-specific | Commission Lagos team photography |

**Priority:** Low - These are functional and represent the concepts adequately.

---

### 2. Property Listing Images (data.ts)

Many property images use generic luxury apartment/house stock photos. While they convey luxury, they are not specifically Lagos properties:

| Listing | Current Image | Issue |
|---------|--------------|-------|
| Ekpo 1BR | `photo-1613490493576-7fde63acd811` | Generic luxury apartment, not Lekki-specific |
| Studio Suite | `photo-1522708323590-d24dbb6b0267` | Generic studio, not Lekki-specific |
| Whitestone 2BR | `photo-1600596542815-ffad4c1539a9` | Generic luxury house, not Lekki-specific |
| Maisonette | `photo-1600585154340-be6161a56a0c` | Generic house exterior |
| Victoria Penthouse | `photo-1600596542815-ffad4c1539a9` | Same as Whitestone - reused |
| Oniru 1BR | `photo-1560448204-e02f11c3d0e2` | Generic apartment bedroom |
| Cozy Admiralty 2BR | `photo-1600585154526-990dced4db0d` | Generic apartment interior |
| Luxury Admiralty 2BR | `photo-1600047509807-ba8f99d2cdde` | Generic luxury apartment |
| Ikoyi Executive 3BR | `photo-1600210492486-724fe5c67fb0` | Generic apartment interior |
| VI Oceanview 2BR | `photo-1600566753086-00f18fb6b3ea` | Generic apartment interior |
| Lekki Garden 1BR | `photo-1600573472592-401b489a3cdc` | Generic apartment interior |
| Oniru Premium 3BR | `photo-1600047509807-ba8f99d2cdde` | Same as Luxury Admiralty - reused |

**Priority:** High - These are the primary listing images users see. Custom photography of actual Lagos properties would significantly improve authenticity.

**Note:** The top 3 premium listings (Bourdillon Penthouse, Lagoon View Villa, Eko Loft) already use actual property photography via local assets (`/assets/images/...`).

---

### 3. VIP Services Pexels Images (data/vipServices.ts)

All 24 Pexels-based VIP service images are generic stock photos. While functional and high quality, they do not specifically show Lagos locations or Nigerian service providers:

| Category | Count | Issue |
|----------|-------|-------|
| Spa & Wellness | 3 | Generic spa photos, not Lagos spas |
| Barber & Grooming | 3 | Generic barbershop photos, not Lagos barbershops |
| Shopping & Retail | 3 | Generic shopping photos, not Lagos malls/markets |
| Sports & Recreation | 3 | Generic sports photos, not Lagos sports clubs |
| Gyms & Fitness | 3 | Generic gym photos, not Lagos fitness centers |
| Laundry & Valet | 3 | Generic laundry photos, not Lagos services |
| Private Chef | 3 | Generic chef photos, not Nigerian cuisine |
| Photography & Video | 3 | Generic photography setup, not Lagos studios |

**Priority:** Medium - These images are high quality and functional. Custom photography of actual Lagos service providers would improve authenticity but is not urgent.

---

### 4. imageManager.ts Fallback Images

The VIP service category fallbacks in `imageManager.ts` use generic Unsplash photos:

| Category | Photo ID | Issue |
|----------|----------|-------|
| spa | 1600334129128-685c5582fd35 | Generic spa room |
| beauty | 1522337360788-8b13dee7a37e | Generic beauty shot |
| shopping | 1441984904996-e0b6ba687e04 | Generic retail |
| sports | 1554068865-24cecd4e34b8 | Generic sports |
| gym | 1534438327276-14e5300c3a48 | Generic gym |
| fitness | 1571019614242-c5c5dee9f50b | Generic fitness |
| laundry | 1545173168-9f1947eebb8f | Generic laundry |

**Priority:** Low - These are fallback images only shown when specific service images are unavailable.

---

### 5. Additional Unsplash Images

| Image | Photo ID | Issue | Recommendation |
|-------|----------|-------|----------------|
| Shopping alt | 1441984904996-e0b6ba687e04 | Generic retail | Replace with Lagos market photo |
| Shopping fashion | 15815787731548-c64695cc6952 | Generic fashion | Replace with Nigerian fashion |
| Sports alt | 1554068865-24cecd4e34b8 | Generic sports | Replace with Lagos sports club |
| Fitness alt | 1571019614242-c5c5dee9f50b | Generic fitness | Replace with Lagos gym |

---

## Recommended Photography Commission

For maximum impact, prioritize commissioning photography in this order:

### Tier 1 - Critical (Property Listings)
1. Actual photos of Ekpo 1BR apartment in Lekki
2. Actual photos of Studio Suite in Lekki
3. Actual photos of Whitestone 2BR in Lekki
4. Actual photos of Maisonette in Lekki
5. Actual photos of Victoria Penthouse
6. Actual photos of Oniru 1BR
7. Actual photos of Cozy Admiralty 2BR
8. Actual photos of Luxury Admiralty 2BR
9. Actual photos of Ikoyi Executive 3BR
10. Actual photos of VI Oceanview 2BR
11. Actual photos of Lekki Garden 1BR
12. Actual photos of Oniru Premium 3BR

### Tier 2 - High Impact (VIP Services)
1. Serenity Spa Ikoyi interior and treatments
2. The Gentlemen's Quarter barbershop
3. Palm Shopping Mall exterior and interior
4. Ikoyi Club tennis courts
5. Eko Atlantic Golf course
6. Lekki Sports Club pool
7. The Fitness Hub VI
8. Zen Yoga Studio
9. CrossFit Lagos
10. Chef Emeka's Kitchen - Nigerian cuisine
11. Lagos Lens Studio photoshoot setup
12. Lekki Market artisan stalls

### Tier 3 - Nice to Have (Business & Events)
1. Lagos business district coworking spaces
2. Lagos conference venues
3. Lagos nightlife venues (Quilox, Cubana)
4. Lagos tech events and meetups
5. Lagos fashion events

---

## Local Assets Already Authentic

The following images are already authentic Lagos photography (local assets):

| Asset Path | Description |
|-----------|-------------|
| `/assets/images/vertical/IMG-20260621-WA0039.jpg` | Bourdillon Penthouse |
| `/assets/images/vertical/IMG-20260621-WA0041.jpg` | Lagoon View Villa |
| `/assets/images/horizontal/IMG-20260621-WA0164.jpg` | Bourdillon Penthouse alt |
| `/assets/images/horizontal/IMG-20260621-WA0173.jpg` | Lagoon View Villa alt |
| `/assets/images/horizontal/IMG-20260621-WA0038.jpg` | Eko Loft |
| `/assets/images/explore/elegushi-royal-beach.avif` | Elegushi Beach |
| `/assets/images/explore/nike-art-gallery.jpg` | Nike Art Gallery |
| `/assets/images/explore/rsvp-restaurant.jpg` | RSVP Restaurant |
| `/assets/images/explore/quilox-nightclub.jpeg` | Quilox Nightclub |
| `/assets/images/explore/cubana-bar.jpeg` | Cubana Bar |
| `/assets/images/explore/landmark-beach.jpg` | Landmark Beach |
| `/assets/images/explore/freedom-park.jpeg` | Freedom Park |
| `/assets/images/explore/nigerian-designers.png` | Nigerian Designers |
| `/assets/images/explore/cilantro-lagos.png` | Cilantro Lagos |
| `/assets/images/explore/izanagi-restaurant.webp` | Izanagi Restaurant |
| `/assets/images/explore/alara-lagos.webp` | Alara Lagos |
| `/assets/images/explore/national-museum-lagos.jpg` | National Museum |
| `/assets/images/explore/kalakuta-republic-museum.jpg` | Kalakuta Museum |
| `/assets/images/explore/balogun-market.jpg` | Balogun Market |
| `/assets/images/explore/lagos-island-heritage-walk.jpeg` | Lagos Island Heritage |
| `/assets/images/explore/lekki-lagoon-sunset-cruise.avif` | Lekki Lagoon Cruise |
| `/assets/images/horizontal/CozyLagos.jpeg` | CozyLagos brand image |

These represent the authentic Lagos photography already in the platform and should serve as the style reference for any commissioned photography.

---

## Summary

| Category | Generic Count | Authentic Count | Completion |
|----------|--------------|----------------|------------|
| Property Listings | 12 | 3 | 20% |
| VIP Services | 24 | 0 | 0% |
| Business Services | 6 | 0 | 0% |
| Events | 0 | 15+ | 100% |
| Explore Lagos | 0 | 20+ | 100% |
| Hero/Lifestyle | 8 | 0 | 0% |

**Overall Platform Authenticity:** ~45% authentic, ~55% generic stock

**Estimated Photography Commission:** 30-40 shoots to reach 90%+ authenticity
