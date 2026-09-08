# Flowers by Pat — Implementation Plan

## Goal
Build and publish a polished, responsive florist storefront for **Flowers by Pat** using the supplied concepts as visual direction: the warmth and local-business clarity of the first concept, the merchandising structure of the ecommerce concept, and the premium editorial typography of the third concept.

## Product principles
1. **Photography first** — every major shopping and storytelling surface uses real floral photography. Decorative motion may complement photography, never replace it.
2. **Local + premium** — the site should feel handmade and approachable, but with an editorial art-direction layer rather than a generic template.
3. **Fast path to flowers** — visitors can reach best sellers, occasion collections, and the cart within one or two interactions.
4. **Mobile is a first-class layout** — not a scaled-down desktop; cards, navigation, cart, and CTA placement are adapted for touch.
5. **Progressive enhancement** — the core storefront works as HTML/CSS/JavaScript. Three.js is used only for a subtle hero atmosphere and is disabled for reduced-motion users or when WebGL is unavailable.

## Information architecture
- Announcement bar: same-day/local-delivery message.
- Sticky header: brand, Shop / Occasions / Weddings / Our Story, cart.
- Hero: editorial headline, primary CTA, secondary CTA, seasonal real-photo composition.
- Occasion rail: Birthday, Love, Sympathy, Celebration, Just Because, New Baby.
- Best sellers: 6 shoppable bouquet cards with prices and add-to-cart actions.
- Delivery story strip: practical value proposition and CTA.
- Editorial split: “Made by hand, chosen with feeling” + flower-shop photography.
- Wedding section: consultation-focused visual story.
- Testimonials: lightweight rotating customer quotes.
- Newsletter: email capture UI.
- Footer: navigation, contact affordances, photo credits.
- Cart drawer: localStorage-backed quantity management and order summary.

## Visual system
- **Palette:** deep botanical green, warm cream, muted blush, terracotta/coral accent, oxblood editorial accent.
- **Type:** high-contrast serif display font paired with a clean humanist sans-serif.
- **Surface:** warm paper texture created with CSS gradients/noise-like layering; rounded cards used selectively.
- **Photography:** free-to-use Unsplash photographs with responsive crop treatment and lazy loading.
- **Motion:** restrained fades, card lifts, testimonial cycling, and a low-opacity Three.js floating-petal layer in the hero.

## Technical approach
- Static GitHub Pages application: `index.html`, `styles.css`, `script.js`.
- No framework/build step so the published page stays easy to maintain.
- Remote Google Fonts and Unsplash image delivery.
- Three.js loaded from jsDelivr and used as optional progressive enhancement.
- Cart state stored in `localStorage`; checkout is represented as an enquiry/order-review action because GitHub Pages cannot run secure payment processing on its own.
- Accessible interactions: semantic buttons/links, focus states, keyboard-closeable drawers/menu, `aria-live` cart count, reduced-motion support.

## Implementation phases
1. Establish semantic page structure and responsive navigation.
2. Build the visual system and responsive layout.
3. Add real floral imagery and photo credits.
4. Implement interactive cart, mobile menu, testimonial carousel, newsletter feedback, and smooth anchor navigation.
5. Add optional Three.js hero atmosphere with graceful fallback.
6. Add GitHub Pages deployment configuration and `.nojekyll`.
7. Validate HTML/JS structure, review responsive behavior, and verify deployment status.

## GitHub Pages release strategy
- Keep production content on `main`.
- Create a `gh-pages` branch from the finished production commit so GitHub Pages can use a conventional branch-based publishing source with no build step.
- Include `.nojekyll` so GitHub serves the static files directly.
- Verify the repository Pages endpoint and deployment state after the branch is created.
- If GitHub still requires a one-time publishing-source selection in repository settings, document that exact blocker rather than claiming the site is live.

## Definition of done
- Responsive florist storefront implemented and committed.
- Real flower/shop photography present throughout.
- Optional Three.js effect complements rather than obscures photos/content.
- Cart and mobile navigation work without a backend.
- Plan remains in the repository as Markdown.
- GitHub Pages publication is verified where repository settings permit.
