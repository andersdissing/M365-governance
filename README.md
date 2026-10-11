# Handoff: Governance for Microsoft 365 — landing page

## Overview
A single-page marketing site for a Microsoft 365 governance product covering **shared links** and **guest access**. The page explains the problem (access outlives its reason), the approach (ask the person who shared, in Teams, and record the answer), shows the product (screenshots in a grouped carousel), and ends with a mailto contact. A 41-second animated "conversation" video explains how it works.

There is **no top navigation** by design. One page, no subpages.

## About the design files
The files in `design/` are **design references built in HTML** — they show the intended look, copy and behaviour. They run on a design-preview runtime (`support.js`, `*.dc.html`), which is **not** meant to be shipped.

The task is to **rebuild this as a plain static site** (HTML + CSS + a small amount of vanilla JS) suitable for GitHub Pages. No framework is required; if you prefer one, a static-site generator (Astro, Eleventy) is fine as long as the output is static.

`Governance Landing.html` is a self-contained snapshot of the design (opens offline in any browser) — use it to compare your build against.

## Fidelity
**High-fidelity.** Colours, type, spacing, copy and interactions are final. Recreate pixel-close.

## Hosting — new GitHub repo, static page
1. Create a new repo, `M365-governance` (live at https://andersdissing.github.io/M365-governance/) (public, or private with Pages enabled on your plan).
2. Build to a static folder with this structure:
   ```
   /index.html
   /styles.css
   /main.js            (carousel + video autoplay)
   /assets/            (screenshots, logo, og-image)
   /video/how-it-works.mp4   (see "Video" below)
   ```
3. Enable **Settings → Pages → Deploy from branch → main / (root)**. Or add a GitHub Actions workflow (`actions/deploy-pages`) if there is a build step.
4. Optional custom domain: add a `CNAME` file and the DNS record; tick "Enforce HTTPS".
5. Add `<title>`, meta description, Open Graph tags and a favicon (the 5d logo mark at 32 px and 180 px).
6. Every push to `main` redeploys within ~1 minute.

## Page structure (top → bottom)
All sections: content max-width 1296px, centred; horizontal padding `clamp(20px, 5vw, 72px)`; vertical padding `clamp(72px, 9vw, 120px)`. Two-column rows use `flex-wrap` with flex-basis ~420–460px so they stack under ~900px.

1. **Hero** (indigo field, `#top`)
   - Background indigo-900 + blueprint grid lines (white 7% vertical / 5% horizontal, every 108px).
   - Left (flex 7): logo lockup (white) → eyebrow "SHARING AND GUEST ACCESS · MICROSOFT 365" → H1 "Every share in your tenant was a decision somebody made." (Barlow Condensed 600, clamp(54px, 6.8vw, 96px), lh 0.96, ls −0.02em, white) → subline "Now somebody is asked whether it still holds." (teal-light, Barlow Condensed 600, clamp(26px, 2.6vw, 36px)) → body paragraph (19px/1.6, indigo-50). **No buttons.**
   - Right (flex 5): a Teams-style question card (white, radius 8, shadow-lg) inside a dashed white blueprint frame with "+" corner marks; a solid teal 180px square top-right and a coral 120px square bottom-left sit behind it. Caption "FIG. 01 …".
2. **Problem** (`#problem`, white) — eyebrow (coral), H2, indigo subline, intro paragraph; three stat tiles (A 40% coral tint, B 64% steel tint, C indigo-900 solid "No expiry. No inactivity alert. No cleanup."); source line; two columns "Inside the company" / "Outside the organisation"; closing statement.
3. **Approach** (lavender tint band with vertical grid lines) — H2 "You should not have to lock sharing down to get control of it." + two paragraphs.
4. **How it works** (`#how`, indigo field) — H2, intro line, **the video** in a white rounded frame inside a dashed blueprint frame, caption "FIG. 02", then three white step cards (1 Watch steel / 2 Ask indigo / 3 Record teal; 3px coloured top border, radius 0 0 8 8).
5. **Product** (`#product`, white)
   - 04 Shared links: copy left, bot-card screenshot (09) right in a steel-tint frame.
   - 05 Guest access: copy left, quote tile (teal tint) right.
   - **Carousel** "The two apps, as people use them": two `<fieldset>` groups with `<legend>` — "SHARED LINKS APP" (Dashboard, My links, Reports, Auditlog) and "GUEST ACCESS APP" (My guests, Report, Guest detail). Pill tabs; active pill filled with its app colour. Prev/next buttons + "01 / 07" counter. Image area aspect-ratio 1568/595, radius 8, inside a teal-tint frame. Caption under it.
6. **Answerable** (indigo-900) — quote "Counted, not listed…" + link "See it on a guest's page →" (jumps to carousel slide 7 and scrolls to it).
7. **Control** (`#control`, white) — three tinted tiles (Links / Guests / Timing) with pill tags; closing statement.
8. **Connects** (teal tint band) — H2 + paragraph + four pill chips.
9. **Contact** (`#contact`, indigo field) — H2 "Make every share someone's responsibility — starting with the next one." (second half teal-light); button "Contact Anders Dissing" + mailto link `dissing@sharepointkonsulenterne.dk`. Teal + coral squares bottom-right.
10. **Footer** — small colour logo + "Governance for Microsoft 365 — sharing and guest access"; right: "Screenshots use demo data. External addresses are invented."

Exact copy for every section is in `design/Governance Landing v3.dc.html` (search for the section's `data-screen-label`). Important: the product only acts on **new** shares from the day it is switched on — keep copy consistent with that.

## Interactions & behaviour
- **Carousel:** click a pill → show that slide; prev/next wrap around; ←/→ keys work when focus is inside the carousel. Slide data (title, image, caption) is the `SLIDES` array in the design file's logic class.
- **"See it on a guest's page →":** select slide 7 (Guest detail) and smooth-scroll to the carousel (offset −90px).
- **Video:** autoplays muted, once, when ≥ 40% visible; pauses when scrolled away and resumes on return. Show native controls (play/pause/scrub). Respect `prefers-reduced-motion` (don't autoplay).
- **Hover:** links → indigo-700; pills/buttons darken one ramp step; focus-visible = 2px indigo outline, offset 2px.
- **Responsive:** all rows wrap; pills/buttons/chips are `white-space: nowrap; flex: none` so whole items wrap, never their text.

## Video
The design version is a live HTML animation (`design/conversation.jsx` on `design/animations-v3.jsx`). For production, **render it to MP4/WebM** (1600×900, 41 s) and embed with `<video muted playsinline preload="metadata" poster="…">`. Ask the designer for the exported file, or screen-record the design at 1600×900. Story beats: Intro (4s) · March (9s) · Gap (5s) · Ask (10s) · Offboard (7s) · End (6s).

## Design tokens
Fonts (Google Fonts): **Barlow Condensed 600** (headings, eyebrows), **Figtree 400/500/600/700** (body, UI).

Colours (OKLCH, with approximate hex):
| Role | OKLCH | ≈ Hex |
|---|---|---|
| Ink / text | — | #1d1f20 |
| Ground | — | #ffffff |
| Divider | — | #d9dadc |
| Neutral 700 (muted text) | — | #5d6064 |
| Indigo 500 (ask, primary) | oklch(0.5 0.13 280) | #5b55b8 |
| Indigo 700 (hover, links) | oklch(0.44 0.13 280) | #4a439f |
| Indigo 900 (fields) | oklch(0.32 0.1 280) | #2b2a5e |
| Indigo tint | oklch(0.955 0.03 280/285) | #eeeefb |
| Indigo light text on field | oklch(0.85–0.9 0.025–0.07 280) | #c9c8ef / #dedcf2 |
| Teal 500 (record, guests) | oklch(0.5 0.13 175) | #00806f |
| Teal light (CTA on indigo) | oklch(0.84 0.1 175) | #7fd6c6 |
| Teal tint | oklch(0.955 0.03 175) | #e3f4f0 |
| Steel 500 (watch, links app) | oklch(0.5 0.13 245) | #2f6fa8 |
| Steel tint | oklch(0.955 0.03 245) | #e8f0f8 |
| Coral 500 (accent) | oklch(0.5 0.13 35) | #a8473a |
| Coral tint | oklch(0.955 0.03 35) | #f8ebe8 |

Use the OKLCH values as the source of truth (modern browsers support them); hex is a fallback.

Radius: 6px buttons, 8px cards/screenshots/tiles (tiles: 0 0 8 8 with a 3px coloured top border), 999px pills. Section frames and the blueprint frames stay square.
Shadows: sm `0 1px 2px rgba(29,31,32,.08)`, md `0 4px 12px rgba(29,31,32,.10)`, lg `0 12px 32px rgba(29,31,32,.14)` (match `design/industry/styles.css` `--shadow-*`).
Blueprint frame: 1px border (dashed white 40% on indigo, solid tint on white) with "+" corner marks — see `.blueprint` / `.corner` in `design/industry/styles.css`.

## Logo (5d)
A chat bubble with three rounded corners and a square bottom-left corner plus a small triangular tail, containing two small squares (the two answers). On white: indigo bubble, white + teal-light squares. On indigo: white bubble, indigo + teal squares. Build as an SVG for production (bubble 36×28 with 7px radii, tail 8×8, squares 7×7 at x=8/20, y=10 in a 36×36 box). Wordmark: "Governance" (Barlow Condensed 600) over "for Microsoft 365" (Figtree, muted). The name is a **placeholder** — confirm the final product name before launch.

## Assets
- `assets/01…08-*.png` — product screenshots captured inside the Teams web client (demo tenant, invented external addresses).
- `assets/09-bot-card-link-expiring.png`, `assets/10-bot-card-guest-still-needed.png` — bot cards.
- Hero Teams card, avatars and logo are drawn in HTML/CSS (no image files).

## Files
- `design-ref/Governance Landing.html` — self-contained snapshot of the final design (reference).
- `design-ref/Governance Landing v3.dc.html` — the design source: markup, copy, carousel logic.
- `design-ref/conversation.jsx`, `design-ref/animations-v3.jsx` — the video animation.
- `design-ref/industry/styles.css` — base tokens and the blueprint frame classes.
- `docs/assets/` — screenshots.
- `docs/` — the published site (GitHub Pages serves `main` / `/docs`).
- `docs/video/how-it-works.{mp4,webm}` + `-poster.jpg` — the animation exported at 1600×900, 30 fps, 41 s. Re-export with `tools/render-video.js` (instructions in its header).
