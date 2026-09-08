# Flowers by Pat

A responsive, editorial florist storefront built as a static GitHub Pages site.

**Live site:** https://prithiraj.github.io/Flowers_By_Pat/

## What is implemented

- Photography-led hero and florist storytelling sections
- Occasion filtering for the bouquet collection
- Six shoppable bouquet cards using real flower photography
- LocalStorage-backed cart with quantity controls and order review
- Mobile navigation and responsive card/layout adaptations
- Rotating testimonials and newsletter feedback UI
- Reduced-motion-friendly reveal effects
- Subtle Three.js floating-petal atmosphere in the desktop hero
- `.nojekyll` for direct static hosting

The design and implementation plan is documented in [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md).

## Running locally

No build step is required. Serve the repository with any static file server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Checkout note

This repository is a static storefront. The cart and order review are functional in-browser, but secure payments are intentionally not wired up because no payment provider or merchant account was supplied. Connect Stripe Checkout, Shopify, Square, or another hosted checkout before accepting live orders.

## Photography

The storefront uses real, free-to-use Unsplash photographs. See [`PHOTO_CREDITS.md`](./PHOTO_CREDITS.md) for source links and photographer credits.

## GitHub Pages

Production lives on `main`. The published static copy lives on `gh-pages` and is available at the live-site URL above while GitHub Pages is enabled for the repository.
