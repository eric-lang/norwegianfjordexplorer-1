# Norwegian Fjord Explorer

Astro website built from `Norwegian-fjor-explorer-Final.fig`. The page includes the hero, experiences, boat, routes, stops, sustainability, captain introduction, gallery, documentary, charters, deck plans, and contact sections. See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub and hosting build settings.

## Open the local site

Double-click **start-dev.cmd**, or run `./start-dev.cmd` from this folder in PowerShell. Keep that window open while working. Visit **http://localhost:4321**. Press Ctrl+C in that window to stop the server.

The launcher uses the Node.js runtime already available on this device through Codex, with a fallback to a normal Node.js installation. It does not change your system settings.

## Commands

With Node.js and pnpm available in your terminal:

```sh
pnpm install --store-dir .pnpm-store
pnpm dev
pnpm check
pnpm build
pnpm preview
```

For this device, the bundled package manager is available at:

```powershell
& "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd" build
```

Use the same command with `dev`, `check`, or `preview` as needed. Production output goes into `dist/`. No environment variables or external services are required for the hero.

## Project files

- `src/components/Hero.astro`: hero, navigation, mobile menu and temporary section dialogs.
- `src/components/Experiences.astro`: four accessible category tabs and six cards per tab.
- `src/data/experiences.ts`: shared photographs, draft category copy and reference prices.
- `src/components/ScrollReveal.astro`: progressive scroll reveals with reduced-motion support.
- `src/components/BookingLink.astro`: reusable pill and arrow booking control.
- `src/layouts/Layout.astro`: page metadata and shared document layout.
- `src/styles/global.css`: shared colors, fonts and accessibility utilities.
- `public/images/`: original logo, optimized hero photo and heading outlines.
- `design-inspection/`: complete decoded Figma reference, inventories and previews.

## Design and behavior notes

The desktop composition follows the 1440 × 1020 hero and experience grid in Figma. Mobile layout is adapted because no mobile artboard was supplied. Display headings use the original PP Pangaia glyph outlines as SVGs, accompanied by semantic headings for accessibility; the source archive does not contain font installation files. Body typography falls back to Helvetica/Arial until Satoshi font files are supplied.

Book Now and experience cards currently call the onboard number extracted from the design, **+47 94791130**. The Experiences navigation and hero destination links scroll to the experience section and select the appropriate tab. Vessel links to the boat section. About and Blog still display temporary section dialogs. No booking provider has been connected.

Each category reuses six extracted photographs, with draft copy tailored to Tromsø, Lofoten & Vesterålen, Special Cruises and Charter. Displayed prices are reference values carried from the supplied design, not verified live quotes. Charter cards show “Request a quote.” The Boat section has four linked tabs with individual photographs and descriptions. Clicking or keyboard selection changes tabs; when the desktop stage fits in the viewport, wheel scrolling moves forward/down or backward/up through the tabs and releases at either end. Trackpad gestures are grouped to prevent skipping tabs. Image and copy transitions use directional clip-path reveals, with motion disabled for reduced-motion preferences. On mobile, stacked cards use click and keyboard tabs while ordinary page scrolling remains available. The first description and bistro image come from the source design; other tab descriptions are draft copy and reuse relevant source photographs.

Red CTAs turn cream with navy text and arrows on hover or keyboard focus; cream CTAs turn red with cream text and arrows. Card backgrounds turn pale cream with dark blue text. Images begin slightly enlarged and zoom out on hover while a soft dark overlay and caption fade in. Tabs use navy and beige states. Navigation has staggered entrances, animated hover details and a compact animated mobile menu. The hero enters in staggered stages, section elements reveal as they enter the viewport, and returning to a tab replays the card entrance. All motion respects reduced-motion preferences, and the default content remains visible with JavaScript disabled.

The original `.fig` and extracted reference files remain in the folder. They are outside `public/` and are not included in the production website.

## Verified setup

Astro 7.3.8, TypeScript 6.0.3 and pnpm 11.25.0, using the existing Node.js 24.19.0 runtime. The Astro checker reports zero errors or warnings, and the production build completes successfully. Browser checks cover image loading, semantic headings, CTA hover colors, four working tabs, keyboard tab selection, image zoom, card hover colors, hero destination links, reduced motion, no-JavaScript content and horizontal overflow at 320, 390, 768, 1280 and 1440 px. Desktop and mobile screenshots are saved in `.cache/verification/`.



The boat's Service Offerings label and tab/image stage stick together with the Service Offerings wrapper's top border flush against the viewport top, with an extended sticky runway (55svh, bounded to 240–640px). Sticky positioning is disabled on mobile; short desktop previews use a compact layout. Wheel tab selection starts only once the Service Offerings border reaches the top.



Routes follows the boat section with the selectable HTML heading, extracted transparent vector route map, navy information card and shared booking CTA. White mask backdrops are omitted from the map to reveal its original white destination labels and route lines against the red card background. The map is illustrative source artwork; Book Now continues to call the onboard number. The layout stacks on mobile and uses the existing progressive reveals and reduced-motion support.


Narvik opens by default in the interactive route map. Its marker is anchored at SVG point (505.9516, 389.1234) in the 696×724 viewBox, derived from Figma vector 1:457 and its ancestor transforms. A cream pop-up sits above the marker, clamps horizontally inside the map on resize, and provides a brief destination description and official Visit Narvik link. It closes via its close button, Escape, marker toggle or an outside click. Keyboard dismissal restores marker focus. The map has 18 plotted stops and a shared western Lofoten anchor, with 24 researched destination stories in src/data/route-stops.ts. A stop selector makes dense points and the six grouped western locations accessible on mobile. One pop-up is open at a time; nearby links connect related coastal stories. Northern points place their pop-ups below the marker to keep them near the map.

The Narvik marker has a subtle 2.6-second pulse (10% growth and 1px lift). Its pop-up scales open from the marker in 320ms, then shrinks to zero on dismissal in 220ms. Closing content becomes inert immediately, and interrupted close animations can reopen safely. Reduced-motion settings disable the pulse and scale animations.


Stops follows Routes with five source photographs and selectable HTML headings. Each card compresses its image and caption while a dark detail panel slides from the left into the right-hand space, containing cream text blocks. One panel opens at a time, with close-button and Escape controls and focus restoration. The main dock copy and coordinates come from Figma; other panels use draft copy informed by https://www.visittromso.no/polar-history and https://www.visittromso.no/arctic-cathedral. The captain panel invites users to discuss a visit with the crew. Reduced-motion settings remove animation. The route location selector has an additional 1rem of right padding. Browser verification is in scripts/verify-stops.cjs.
