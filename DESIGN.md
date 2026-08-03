---
name: Kenneth Jørgensen Portfolio
description: An arctic editorial portfolio where design, development, and live aurora data meet.
colors:
  polar-white: "#f2f0e9"
  signal-black: "#050706"
  aurora-mint: "#9df5bf"
  aurora-violet: "#9f8cff"
  project-green: "#78c69a"
  project-violet: "#b6a6ee"
  project-sand: "#e2cf9d"
  project-blue: "#8bb8dc"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(4rem, 8.8vw, 8.25rem)"
    fontWeight: 700
    lineHeight: 0.78
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Syne, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    letterSpacing: "0.08em"
spacing:
  page-gutter: "clamp(1.25rem, 4.5vw, 2.75rem)"
  section: "clamp(3.75rem, 11vw, 10rem)"
---

# Design System: Kenneth Jørgensen Portfolio

## Overview

**Creative North Star: "Northern Signal Studio"**

The interface feels like an independent arctic creative practice documented with the precision of a field station. Oversized editorial type, strict edges, live data, and photographic work sit over a moving aurora atmosphere. It borrows the confidence and pacing of contemporary Japanese studio sites without reproducing their identity.

**Key Characteristics:**

- Oversized, tightly composed display type
- Live aurora as environmental material and data signal
- Restrained labels and navigation in instrument-like mono type
- Project imagery presented at exhibition scale
- Dark, flat surfaces with rare aurora-color interventions

## Colors

Polar white and signal black carry the interface; aurora mint is reserved for live state, active emphasis, and a small number of signature moments.

### Primary

- **Aurora Mint** (#9df5bf): Live signal, availability, active project title, and focus.

### Secondary

- **Aurora Violet** (#9f8cff): A supporting aurora hue for atmospheric rendering, not routine UI chrome.

### Neutral

- **Signal Black** (#050706): Main page ground.
- **Polar White** (#f2f0e9): Primary type and high-contrast linework.

**The Live Color Rule.** Aurora color implies energy, activity, or a moment of emphasis; it is not scattered decoratively.

## Typography

**Display Font:** Syne
**Body Font:** Syne
**Label/Mono Font:** IBM Plex Mono

Syne supplies Kenneth's broad, engineered identity and project voice, while IBM Plex Mono handles coordinates, indices, metadata, and controls. Hierarchy comes from scale, weight, placement, and quiet space rather than introducing another display family.

### Hierarchy

- **Identity display** (Syne 700, fluid up to 8.25rem, 0.78): Hero identity and brand-led statements.
- **Headline** (Syne 400, fluid 2.75–5.5rem, 0.94–0.96): Project names and supporting section titles.
- **Body** (400, 16–18px, 1.4–1.55): Descriptive and project copy.
- **Label** (400, 0.62–0.75rem, tracked uppercase): Coordinates, status, navigation, and metadata.

Fluid display sizes follow a restrained role ramp. The hero is the only bold maximum-scale role; project typography gains presence through placement, uppercase rhythm, and surrounding quiet space rather than additional weight. Mobile displays reduce to roughly 2.8–4.8rem while body and label sizes remain tightly controlled.

## Layout

Content sits within a 1440px maximum field with fluid page gutters. Large type and imagery alternate alignment across the project list. Fine rules establish sections without card containers; project separators alternate in length and alignment rather than repeating as full-width table rows. At 768px, compositions collapse to one column, project imagery becomes portrait-oriented, and secondary metadata is reduced before essential content.

## Elevation & Depth

The system is flat by default. Depth comes from the WebGL aurora, photographic layering, blend modes, and softly offset signal glows—not floating cards or repeated shadows.

## Shapes

Most surfaces and imagery use hard editorial edges. Circles are reserved for live status dots, portrait clipping, and range handles. Fine one-pixel rules are the main structural boundary.

## Components

### Navigation

Fixed and minimal, with Kenneth's name at left and live KP plus a single Menu control at right. The menu opens as a full-viewport, hard-edged typographic field with indexed navigation and tiny location/contact metadata; it never becomes a floating or blurred container.

### Identity Hero

The first viewport names Kenneth directly at maximum scale, placing the 67°N coordinate inside the display composition. Small environmental readings—Bodø, local time, KP, aurora condition, and availability—sit at the perimeter while the existing WebGL aurora supplies the visual identity behind them.

### Project Rows

Projects form a sparse indexed type list. On pointer hover or keyboard focus, one animated media crop opens from its center and follows with damped inertia; touch and reduced-motion layouts keep the media visible in-flow.

### Capability Bands

The section opens with a tiny centered field label, an extended void, and a single aurora beacon before the About link and rule appear. Disciplines and fields then move in two slow, opposing continuous rows. They pause on hover, remain readable at all times, and become horizontally inspectable static lists under reduced motion.

### Contact Close

A full-viewport closing frame uses centered location context, a two-line 12rem invitation, and an underlined email address. Availability and external profiles sit below on paired fine rules. A narrow utility footer follows so this invitation remains the visual endpoint.

### Aurora Lens

A lightweight circular cursor lens trails the pointer with atmospheric damping. It grows and names the action over links and project rows, while an irregular inner orbit and restrained aurora tint connect it to the WebGL identity. Native cursor behavior remains unchanged on touch and reduced-motion devices.

### Aurora Forecast

The forecast joins real KP data, manual adjustment, location, and the atmospheric WebGL response. Data labels use IBM Plex Mono and remain readable without motion.

### Aurora States

The WebGL identity interpolates between section states: restrained in the hero, quieter around project imagery, calm through explanatory content, and stronger at the contact close. Project focus may temporarily tint the light toward a project-specific hue; transitions remain damped rather than switching instantly.

## Do's and Don'ts

### Do:

- **Do** let project imagery and oversized type own the composition.
- **Do** use aurora color to indicate a live or active moment.
- **Do** preserve generous quiet space between dense editorial passages.
- **Do** keep coordinates, KP data, and utility copy precise and compact.

### Don't:

- **Don't** add generic rounded cards, icon tiles, or dashboard chrome.
- **Don't** apply aurora gradients to text.
- **Don't** fabricate testimonials, client metrics, or project outcomes.
- **Don't** let atmospheric effects reduce contrast or obscure navigation.
