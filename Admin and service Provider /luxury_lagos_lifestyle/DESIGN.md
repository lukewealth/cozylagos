---
name: Luxury Lagos Lifestyle
colors:
  surface: '#faf9f8'
  surface-dim: '#dadad9'
  surface-bright: '#faf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f2'
  surface-container: '#eeeeed'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e1'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4d4635'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f0f0'
  outline: '#7f7663'
  outline-variant: '#d0c5af'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#e9c349'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#625e56'
  on-tertiary: '#ffffff'
  tertiary-container: '#b8b2a9'
  on-tertiary-container: '#48453e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e8e2d8'
  tertiary-fixed-dim: '#ccc6bc'
  on-tertiary-fixed: '#1e1b15'
  on-tertiary-fixed-variant: '#4a463f'
  background: '#faf9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e3e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 80px
  gutter: 32px
  stack-sm: 16px
  stack-md: 32px
  stack-lg: 64px
  section-gap: 120px
---

## Brand & Style
The design system embodies the "Luxury Lagos Lifestyle"—a fusion of high-octane sophistication and warm West African hospitality. The brand personality is elite yet welcoming, professional yet soulful. It targets high-net-worth individuals and international travelers seeking a curated, "Apple-level" digital experience that mirrors the premium nature of their physical accommodations.

The visual style is a blend of **Minimalism** and **Glassmorphism**. It utilizes heavy whitespace to create "breathing room" for high-end photography, while employing translucent, frosted-glass layers to represent the shimmering coastlines and architectural modernity of Lagos. Every interaction must feel intentional, smooth, and expensive.

## Colors
The palette is rooted in timeless luxury. 
- **Warm White (#FDFCFB):** Used as the primary canvas to evoke a sense of purity and spaciousness.
- **Charcoal (#1A1A1A):** Provides authoritative contrast for typography and iconography.
- **Gold Accent (#D4AF37):** Used sparingly for highlights, call-to-actions, and premium status indicators.
- **Champagne (#F4EDE3):** Serves as a subtle background for container elements and sectional dividers.

**Glassmorphism Tokens:**
Layering should utilize `glass_white` with a background blur of 20px and a 1px solid `glass_border` to create a sense of physical depth and "Apple-style" material translucency.

## Typography
The typography strategy pairings high-contrast editorial serifs with functional, modern sans-serifs.
- **Headlines:** Use **Playfair Display**. It provides a literary, luxury fashion feel. Large headlines should use tighter letter-spacing for a "bespoke" look.
- **Body & Interface:** Use **Manrope**. Its geometric yet friendly proportions provide excellent legibility for property details and concierge chat interfaces.
- **Hierarchy:** Use `label-caps` for utility information like "AVAILABLE NOW" or "AI CONCIERGE" to distinguish metadata from editorial content.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop (12 columns, 1440px max-width) to maintain a controlled, gallery-like experience. 

**Rhythm:**
- Use generous vertical spacing (`section-gap`) to ensure the UI never feels crowded.
- **Mobile:** Transition to a fluid 4-column grid with 20px margins.
- **AI Concierge:** Floating elements should respect a safe-area margin of 32px from the screen edge.
- **Luxury Accommodation Cards:** Maintain a 3:4 or 1:1 aspect ratio for property images to emphasize architectural scale.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Ambient Shadows** rather than traditional stacking.
- **Level 1 (Base):** Warm white background.
- **Level 2 (Cards):** Translucent champagne/white surfaces with a 40px blur.
- **Level 3 (Modals/Concierge):** Elevated with a highly-diffused shadow: `0px 20px 50px rgba(26, 26, 26, 0.08)`.
- **Level 4 (Primary Actions):** Gold elements should appear "pressed" into the surface or slightly raised with a subtle inner glow to mimic physical gold leaf.

## Shapes
The shape language is defined by large, sweeping curves that feel organic and premium.
- **Main Cards:** Fixed at `24px` to create a soft, high-end frame for property photography.
- **Buttons:** Use a full pill-shape (`100px`) for primary actions (e.g., "Book Experience") to differentiate them from structural UI elements.
- **AI Interface:** Chat bubbles should use a 16px radius, with a slightly sharper corner (4px) on the anchor side to denote directionality.

## Components
- **Buttons:** Primary buttons are Solid Gold (#D4AF37) with Charcoal text. Secondary buttons are "Ghost" style with a 1px Charcoal border.
- **Glass Cards:** Used for property highlights. Features a subtle white-to-transparent gradient and a 1px border.
- **AI Concierge Bubbles:** Soft champagne (#F4EDE3) for the AI, and pure white for the user. Text should be Manrope 16px.
- **Experience Chips:** Small, pill-shaped markers with `label-caps` text used to categorize lifestyle perks (e.g., "PRIVATE CHEF", "YACHT ACCESS").
- **Luxury Inputs:** Fields should have no background, only a bottom border (1px Charcoal @ 20% opacity) that animates to Gold on focus.
- **Lists:** Property amenities should use custom gold iconography rather than standard bullet points to maintain the bespoke aesthetic.