# Print System Quick Reference

## 🚀 Quick Start

```typescript
import { PrintOrchestrator, STANDARD_DIMENSIONS } from '@/lib/print';

const orchestrator = new PrintOrchestrator(config);
const { pdfBuffer } = await orchestrator.producePrintJob();
```

## 📐 Standard Sizes

```typescript
STANDARD_DIMENSIONS.SQUARE_8X8      // 8" × 8" (203mm)
STANDARD_DIMENSIONS.SQUARE_10X10    // 10" × 10" (254mm)
STANDARD_DIMENSIONS.LANDSCAPE_8X10  // 8" × 10"
STANDARD_DIMENSIONS.A4_PORTRAIT     // A4 (210 × 297mm)
```

All sizes: 300 DPI, 3mm bleed

## 🎨 Color Profiles

```typescript
PRINT_COLOR_PROFILES.FOGRA39  // ISO Coated v2 (recommended)
PRINT_COLOR_PROFILES.FOGRA51  // PSO Coated v3
PRINT_COLOR_PROFILES.SWOP     // US Web Coated
PRINT_COLOR_PROFILES.sRGB     // Digital preview only
```

## 🔧 Common Functions

### Color Conversion
```typescript
import { rgbToCmyk, hexToRgb, isInCmykGamut } from '@/lib/print';

const cmyk = rgbToCmyk({ r: 255, g: 0, b: 0 });
const rgb = hexToRgb('#FF0000');
const printable = isInCmykGamut(rgb);
```

### Dimensions
```typescript
import { mmToPixels, pixelsToMm, calculateBleedBox } from '@/lib/print';

const px = mmToPixels(210, 300);  // A4 width at 300 DPI
const mm = pixelsToMm(2480, 300); // Convert back
const bleed = calculateBleedBox(STANDARD_DIMENSIONS.SQUARE_8X8);
```

### Spine Width
```typescript
import { PDFGenerator } from '@/lib/print';

const spine = PDFGenerator.calculateSpineWidth(24, '170gsm');
// Returns width in mm
```

## 📦 Print Providers

### Printful
```typescript
import { PrintfulClient } from '@/lib/print';

const client = new PrintfulClient(process.env.PRINTFUL_API_KEY);
const products = await client.getProducts();
const order = await client.createOrder({ ... });
```

### Gelato
```typescript
import { GelatoClient } from '@/lib/print';

const client = new GelatoClient(process.env.GELATO_API_KEY);
const order = await client.createOrder({ ... });
```

## ✅ Quality Checks

```typescript
import { QualityChecker } from '@/lib/print';

const checker = new QualityChecker(dimensions);
await checker.checkPage(page);
const result = checker.getResult();

console.log(`Score: ${result.score}/100`);
console.log(`Passed: ${result.passed}`);
```

## 🖼️ Print Preview

```typescript
import { PrintSimulator } from '@/lib/print';

const simulator = new PrintSimulator(colorProfile);
const simulated = await simulator.simulateCanvas(canvasData);
// Shows how colors will look when printed
```

## 📄 API Routes

### Generate PDF
```bash
POST /api/print/generate
{
  "projectId": "abc123",
  "pages": [...],
  "cover": { "front": ..., "back": ... }
}
```

### Submit Order
```bash
POST /api/print/order
{
  "provider": "printful",
  "pdfUrl": "https://...",
  "recipient": { ... }
}
```

### Track Order
```bash
GET /api/print/track?orderId=123&provider=printful
```

## 🎯 Common Tasks

### Create a Page
```typescript
import { createBlankPage } from '@/lib/print';

const page = createBlankPage(1, STANDARD_DIMENSIONS.SQUARE_8X8);
```

### Validate Dimensions
```typescript
import { validateCanvasDimensions } from '@/lib/print';

const { valid, errors } = validateCanvasDimensions(
  canvasWidth,
  canvasHeight,
  dimensions
);
```

### Estimate PDF Size
```typescript
import { estimatePDFSize, formatFileSize } from '@/lib/print';

const bytes = estimatePDFSize(24); // 24 pages
const readable = formatFileSize(bytes); // "12.5 MB"
```

## ⚠️ Important Notes

- **Always include bleed**: 3mm on all sides
- **Minimum resolution**: 300 DPI for print
- **Safe margins**: Keep text 10mm from trim edge
- **Color shifts**: Bright colors may shift in CMYK
- **Total ink**: Keep under 300% coverage
- **Test print**: Always order a sample first

## 🐛 Debug Mode

```typescript
const config = {
  ...yourConfig,
  qualityChecks: true,  // Enable checks
  autoFix: true,        // Auto-fix issues
};
```

## 📊 Order Status

```typescript
'draft'      // Not submitted
'pending'    // Awaiting processing
'processing' // Being prepared
'printing'   // At print facility
'shipped'    // In transit
'delivered'  // Complete
'failed'     // Error occurred
'cancelled'  // Order cancelled
```

## 💰 Cost Structure

```typescript
order.cost = {
  subtotal: 29.99,   // Product cost
  shipping: 5.99,    // Shipping fee
  tax: 2.64,         // Sales tax
  total: 38.62,      // Total amount
  currency: 'USD'    // Currency code
}
```

## 🔗 Useful Links

- README.md - Full documentation
- SETUP.md - Setup instructions
- example.ts - Complete examples
- __tests__/ - Test suite
