# Firestore Schema - Marketplace

## Collection: `cars`

Each document represents one marketplace car listing.

```js
cars/{carId} {
  brand: string,
  model: string,
  year: number,
  mileage: number,
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid" | string,
  transmission: "Manual" | "Automatic" | string,
  bodyType: "SUV" | "Sedan" | "Pickup" | "Truck" | "Hatchback" | string,
  seats: number,
  engine: string,

  priceChina: number,
  inspectionFee: number,
  shippingFee: number,
  insuranceFee: number,
  clearingEstimate: number,
  totalLandedCost: number, // auto-computed in app

  images: string[],
  documents: [
    {
      name: string,
      url: string,
      type: string // e.g. inspection, accident, diagnostics
    }
  ],

  tags: string[], // supports: hot, verified, new, clearance
  description: string,
  locationChina: string,
  dateAdded: string // ISO timestamp
}
```

## Collection: `inquiries`

Used by CTA actions from marketplace detail pages.

```js
inquiries/{inquiryId} {
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  type: string,
  status: "new" | "replied" | string,
  date: string,
  createdAt: serverTimestamp
}
```

## Existing Collections Preserved

- `vehicles`
- `charging`
- `parts`
- `orders`
- `settings/main`

These remain active for backward compatibility with existing modules.
