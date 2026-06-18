---
name: Botanical Wellness System
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#434843'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#737973'
  outline-variant: '#c3c8c1'
  surface-tint: '#4d6453'
  primary: '#061b0e'
  on-primary: '#ffffff'
  primary-container: '#1b3022'
  on-primary-container: '#819986'
  inverse-primary: '#b4cdb8'
  secondary: '#94492c'
  on-secondary: '#ffffff'
  secondary-container: '#fe9d7a'
  on-secondary-container: '#773318'
  tertiary: '#0c1a09'
  on-tertiary: '#ffffff'
  tertiary-container: '#202f1c'
  on-tertiary-container: '#86987e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e9d4'
  primary-fixed-dim: '#b4cdb8'
  on-primary-fixed: '#0b2013'
  on-primary-fixed-variant: '#364c3c'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59b'
  on-secondary-fixed: '#380d00'
  on-secondary-fixed-variant: '#763217'
  tertiary-fixed: '#d5e8cb'
  tertiary-fixed-dim: '#b9ccb0'
  on-tertiary-fixed: '#101f0d'
  on-tertiary-fixed-variant: '#3b4b36'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

This design system is built for a holistic healthcare environment where ancient wisdom meets modern clinical precision. The brand personality is **authoritative yet nurturing**, evoking an emotional response of tranquility, trust, and organic growth.

The design style is a blend of **Modern Minimalism** and **Tactile Organicism**. It prioritizes heavy white space ("breathable" layouts) to reduce cognitive load for patients, while using high-quality typography and subtle depth to establish medical credibility. Every interaction should feel intentional and grounded, avoiding frantic animations or jarring color shifts.

## Colors

The palette is derived from the natural elements used in Ayurvedic and Naturopathic medicine.

- **Primary (Forest Green):** Used for primary navigation, headings, and high-level medical authority. It provides the grounding force of the UI.
- **Secondary (Terracotta):** Reserved for primary calls to action, wellness highlights, and interactive accents. It provides warmth and human connection.
- **Tertiary (Sage):** Used for success states, background containers, and decorative elements that require a soft touch.
- **Neutral (Cream & Bone):** The foundation of the UI. Pure white is avoided to reduce eye strain; instead, off-white "Paper" tones are used to create a sophisticated, editorial feel.

## Typography

The typography strategy employs a "Traditional/Modern" dichotomy.

**Source Serif 4** (Headings) provides the weight of a medical textbook and the elegance of a premium apothecary. It should be used for all page titles, section headers, and significant pull-quotes.

**Hanken Grotesk** (Body & Labels) ensures high legibility for patient instructions, product descriptions, and dashboard data. Its geometric yet soft curves mirror the organic nature of the brand while maintaining a clean, systematic feel.

For mobile, display sizes scale down aggressively to ensure the serif's high-contrast strokes remain legible and don't overwhelm the smaller viewport.

## Layout & Spacing

The layout follows a **Fixed-Width Centered** model for desktop to maintain an editorial "magazine" feel, while transitioning to a fluid 4-column grid for mobile.

- **The Breathable Margin:** All main content containers should utilize generous `xl` padding at the top and bottom to create a sense of calm.
- **Grid:** Use a 12-column grid for the "Practices Dashboard." Cards should span 3 columns (4 per row) on desktop to feel like a high-end catalog.
- **Vertical Rhythm:** Use the `base` (8px) unit for all incremental spacing. Components like list items use `sm`, while distinct sections use `lg`.

## Elevation & Depth

This design system avoids harsh dropshadows. Depth is conveyed through **Tonal Layering** and **Soft Ambient Shadows**.

- **Surface Levels:** The base background is `neutral`. Content cards sit on a `background_paper` surface with a 1px border of `tertiary` at 20% opacity.
- **Shadows:** Use a single "Soft Glow" shadow style for interactive elements (cards, buttons): `0px 4px 20px rgba(27, 48, 34, 0.06)`. This subtle tinting of the shadow with the Primary Forest Green color creates a more organic, integrated depth than neutral gray.
- **Modal Depth:** Modals use a backdrop blur (12px) to maintain the "breathable" quality even when focused on a task.

## Shapes

The shape language is consistently **Rounded**. 

Avoid sharp corners to maintain the "soft" and "nurturing" brand promise. 
- **Standard UI (Buttons, Inputs):** 0.5rem (8px) corner radius.
- **Feature Cards (Dashboard items):** 1rem (16px) corner radius to emphasize their tactile, approachable nature.
- **Images:** Should always feature a soft radius; never leave raw sharp edges on photography of plants or people.

## Components

### Buttons & Interaction
- **Primary Button:** Solid Forest Green with Bone text. Soft 8px radius. Hover state should subtly shift to a slightly lighter tint of green.
- **Secondary Button:** Terracotta ghost button (border only) or solid for high-conversion items like "Book Consultation."

### Practice Dashboard Cards
- Designed like a high-end catalog. High-quality botanical photography at the top (4:5 aspect ratio), followed by a Source Serif 4 title and a Hanken Grotesk description.
- Use a subtle Terracotta tag for category labels (e.g., "Herbalism," "Nutrition").

### Input Fields
- Use a "Floating Label" style with a 1px Sage border. The background should be slightly more "Bone" than the page background to indicate interactivity.

### Chips & Tags
- Used for identifying "Doshas" or medical tags. Pill-shaped with a Tertiary Sage background and Forest Green text.

### High-End Detail
- **Dividers:** Use a custom "Leaf" glyph or a very thin 0.5px line in Sage to separate sections, rather than heavy borders.