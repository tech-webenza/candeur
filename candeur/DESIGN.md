---
name: Candeur Kukatpally Pre-launch
description: A nature-led editorial identity for a form-first performance landing page
colors:
  forest: "#203c30"
  deep: "#142b22"
  paper: "#f5f4ed"
  sage: "#e4e9dc"
  ink: "#23382d"
  muted: "#586453"
  line: "#bcc5b2"
  red: "#943f30"
typography:
  display:
    fontFamily: "Kellissa, Georgia, serif"
    fontSize: "clamp(48px, 5.45vw, 82px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Kellissa, Georgia, serif"
    fontSize: "clamp(44px, 4.9vw, 76px)"
    fontWeight: 400
    lineHeight: 1.06
  body:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  control:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  square: "0px"
spacing:
  section: "100px"
  mobile-section: "70px"
  mobile-gutter: "24px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "#ffffff"
    rounded: "{rounded.square}"
    padding: "15px 24px"
    height: "54px"
  input:
    backgroundColor: "#fffef9"
    textColor: "{colors.forest}"
    rounded: "{rounded.square}"
    padding: "0 12px"
    height: "48px"
---
# Design System: Candeur Kukatpally Pre-launch

## Overview

**Creative North Star: “Opening Light”**

A calm, premium botanical identity with editorial type, natural photography and generous breathing space. Functional clarity and a prominent enquiry form coexist with the nature-led story.

**Key Characteristics:**

- Kellissa headlines with clear Archivo controls.
- Deep forest, warm paper and restrained Candeur red.
- Photographic material texture rather than architectural renderings.
- Purposeful motion with static reduced-motion alternatives.

## Colors

Forest and paper carry the page. Sage separates the neighbourhood chapter. Muted green supports secondary text.

**The Rare Red Rule.** Red identifies the primary action and compact brand signals.

## Typography

Kellissa is self-hosted from the supplied font file (requested as Kellisa); Archivo regular and semibold are self-hosted. Headlines use tight but legible tracking. The mobile hero uses a 42px headline, with 16px inputs to prevent mobile browser auto-zoom.

## Layout

Desktop uses a two-column hero with a stable ivory enquiry panel and a short scroll-driven copy transition beside it. Below 900px the hero becomes a natural single-column flow, with the form immediately after the proposition and price. Major sections have 100px vertical padding on desktop and 70px on mobile. Mobile gutters are 24px.

## Elevation & Depth

The page is flat by default; photography and tonal fields create depth. The lead panel has a soft downward shadow. The mobile CTA has a restrained upward shadow.

## Shapes

Square editorial panels, understated borders, underlined tabs and crisp fields. Dashed boundaries indicate genuine missing assets, not fabricated plans.

## Components

### Enquiry form

Always visible upfront. Name and mobile number precede a demo verification step. Fields stay disabled until client hydration, preventing accidental native form submission. The demo never sends SMS or stores leads.

### Tabs and selectors

Arrow-key, Home and End navigation in tablists. Selected states are visible; content changes use brief image and text transitions. Residence sizes expose the supplied configuration details.

### Neighbourhood

Category and destination controls update an indicative distance card and an opt-in Google map. Missing road distances are explicitly unverified. External directions use the supplied project origin.

### Motion

Lenis and ScrollTrigger share one ticker. A 56-frame film follows scroll; desktop hero copy transitions while the form remains stationary. Native touch scroll is retained. Reduced-motion mode uses the first frame and visible unanimated content.

### Mobile action

Returns to the inline form. Hidden while the form is in view to avoid repetitive actions and pricing.

## Do's and Don'ts

- Do preserve the nature-led palette and spacious serif hierarchy.
- Do label generated lifestyle photographs as illustrative.
- Do keep the lead form immediately discoverable.
- Don't fabricate masterplans, floor plans, distances or registration details.
- Don't reveal the project name or signature walkway without approval.
- Don't reintroduce EOI pricing, “only 3 BHK” or payment-free claims.
