# Jaybesin Autos Marketplace

Chinese-style used car marketplace for sourcing vehicles from China and importing to Ghana, built on React + Firebase Hosting + Firestore.

## Goal

Refactor and extend the existing Jaybesin Autos platform (without deleting core logic) into a full marketplace experience where users can:

- Browse import-ready cars with transparent landed cost breakdowns.
- View detailed vehicle pages with specs, inspection docs, and import timeline.
- Filter/sort/paginate listings in a compact marketplace grid.
- Interact with import and reservation CTAs.

At the same time, warehouse/admin operators can manage listings from a protected admin portal.

## Current Architecture

- Frontend: React + Vite (single app, expanded page state routing)
- Backend: Firebase services
- Hosting: Firebase Hosting
- Database: Firestore
- Storage: Firebase Storage (existing uploader retained)
- Auth: Firebase Auth (admin login retained)

## Marketplace Features Implemented

### Public Marketplace

- New nav structure:
  - Home
  - Browse Cars
  - Import From China
  - Sell Car
  - Deals
  - Account
- Homepage now uses marketplace browsing layout with:
  - Hero search section
  - Quick category tabs
  - Left filter sidebar
  - Car results grid
- Sorting options:
  - Newest
  - Price (Low to High)
  - Mileage (Low to High)
  - Lowest Total Cost
- Pagination added for listing results.
- Lazy image loading on cards and detail page galleries.

### Car Cards

Each card displays:

- Image
- Brand + Model
- Year
- Mileage
- Fuel
- Transmission
- Vehicle Price (China)
- Shipping estimate
- Total landed cost
- Optional tag badges (hot, verified, new, clearance)

### Car Detail Page

New detailed page (`car-{id}`) includes:

- Image gallery
- Vehicle specifications
- Inspection report links/documents
- Full cost breakdown:
  - Vehicle Price (China)
  - Inspection Fee
  - Shipping Fee
  - Insurance
  - Estimated Clearing
  - Total Estimated Landed Cost (auto)
- Import timeline (~45 days sample breakdown)
- CTAs:
  - Reserve This Car
  - Import For Me
  - Talk To Agent
  - WhatsApp Dealer

### Admin Marketplace Management (Protected)

Inside the existing admin portal, a new `Marketplace Cars` tab is added:

- Add marketplace cars with import-specific pricing fields.
- Set tags and meta fields.
- Add image URLs and inspection document URLs.
- Auto-calculate total landed cost before save.
- Save into Firestore `cars` collection.

## Firestore Model

A dedicated `cars` collection is added for marketplace records.

Reference: [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md)

## Key Files Added/Updated

- `src/marketplace.jsx`
  - Marketplace browse page
  - Marketplace detail page
  - Marketplace utility normalization and cost computation
  - Marketplace admin tab component
- `src/firestore.js`
  - Added `cars` collection helpers:
    - `onCars`
    - `saveCar`
    - `deleteCar`
  - Extended `seedFirestore(...)` to optionally seed `cars`
- `src/App.jsx`
  - Wired marketplace pages into existing page routing
  - Added Firestore `cars` listener
  - Kept legacy modules (`garage`, `charging`, `parts`, `track`, etc.)
  - Added admin marketplace tab integration
  - Updated navigation to marketplace menu structure

## Local Development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

## Deploy (Firebase Hosting)

```bash
firebase deploy
```

## Notes for Continuation

The app now runs as a merged platform:

- Existing Jaybesin logic/components remain available.
- Marketplace UX and data model are layered on top.
- Admin remains protected by Firebase Auth.
- Firestore integration remains active and real-time.

## Next Recommended Enhancements

1. Move page-state routing to `react-router` for URL-based navigation and shareable links.
2. Add server-side/paginated Firestore queries for large inventory scale.
3. Add role-based admin permissions and validation rules for `cars` writes.
4. Add proper document upload pipeline (PDF/image upload to Storage with signed URLs).
5. Add user account flow for watchlists, saved searches, and reservation tracking.
