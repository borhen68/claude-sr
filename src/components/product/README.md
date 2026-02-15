# Frametale Product Catalog System

A complete, professional product configurator for photo books built with React, TypeScript, and Tailwind CSS.

## Features

### 📐 Size Selector
- 5 size options: 8x8, 8x10, 10x10, 11x8.5, 12x12
- Real dimensions displayed in both inches and centimeters
- Individual pricing for each size
- "Popular" badges on best-selling sizes
- Hover states and smooth transitions

### 📕 Cover Type Configurator
- 3 cover options: Hardcover, Softcover, Layflat
- Visual illustrations for each cover type
- Feature lists with checkmarks
- Price modifiers clearly displayed
- Premium "Layflat" option highlighted

### 📄 Paper Type Selector
- 3 paper finishes: Matte, Glossy, Silk (Lustre)
- Texture preview visualizations
- Detailed feature comparisons
- Quote descriptions for each finish
- Professional recommendations

### 📚 Page Count Calculator
- Range: 20-200 pages
- Interactive slider with gradient fill
- Plus/minus buttons for 10-page increments
- Real-time pricing: $0.75 per additional page beyond base 20
- Visual markers at key intervals

### 💰 Dynamic Pricing Calculator
- Real-time price updates
- Itemized breakdown of all selections
- Tax calculation (8%)
- Volume discount badges
- Premium selection notifications
- Sticky sidebar for easy reference
- "Add to Cart" CTA button

### 📊 Product Comparison Table
- Side-by-side comparison of all options
- Feature matrix with checkmarks
- Price comparison
- Best-use recommendations
- Responsive table design

## Usage

```tsx
import { ProductCatalog } from '@/components/product';

function App() {
  return <ProductCatalog />;
}
```

## Component Structure

```
product/
├── ProductCatalog.tsx      # Main container component
├── SizeSelector.tsx        # Size selection with pricing
├── CoverTypeSelector.tsx   # Cover type configuration
├── PaperTypeSelector.tsx   # Paper finish selection
├── PageCountSelector.tsx   # Page count slider
├── PricingCalculator.tsx   # Dynamic pricing sidebar
├── ProductComparison.tsx   # Comparison table
├── types.ts               # TypeScript interfaces
├── index.ts               # Barrel exports
└── README.md              # This file
```

## Design System

### Colors
- **Primary Gradient**: Teal `#28BAAB` → Blue `#0376AD`
- **Accents**: Applied to buttons, headers, highlights
- **Background**: Subtle gray gradients for depth
- **Text**: Gray scale for hierarchy

### Typography
- Headings: Bold, gradient text for impact
- Body: Clear, readable gray text
- Prices: Large, bold, gradient accent

### Interactions
- Smooth transitions (300ms)
- Hover states on all interactive elements
- Scale transforms on primary buttons
- Shadow elevation on selection

### Icons
Using Lucide React:
- `Ruler` - Size selector
- `BookOpen` - Cover type
- `FileText` - Paper type
- `Layers` - Page count
- `ShoppingCart` - Pricing
- `Star` - Popular badges
- `CheckCircle2` - Feature lists

## Pricing Logic

```typescript
Base Price = Size Price
+ Cover Modifier (hardcover: 0, softcover: -10, layflat: +20)
+ Paper Modifier (matte: 0, glossy: +5, silk: +8)
+ Page Price ((count - 20) × 0.75)
= Subtotal
+ Tax (8%)
= Total
```

## Responsive Design

- Mobile: Single column, stacked layout
- Tablet: 2-column grid for options
- Desktop: 3-column layout with sticky sidebar
- Tables: Horizontal scroll on mobile

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Button disabled states
- High contrast text
- Focus states on interactive elements
- ARIA labels where appropriate

## Future Enhancements

- [ ] Image upload preview
- [ ] 3D book preview renderer
- [ ] Save/load configurations
- [ ] Sharing configurations via URL
- [ ] A/B testing different layouts
- [ ] Integration with shopping cart
- [ ] Multi-language support
- [ ] Dark mode variant

## License

Proprietary - Frametale Photo Books
