# Frametale Print Production System

Complete print-ready PDF generation and fulfillment system for photobooks.

## Features

- ✅ **300 DPI Print-Ready PDFs** - Professional quality output
- ✅ **RGB to CMYK Conversion** - Accurate color space handling
- ✅ **Bleed & Margin Management** - Proper print specifications
- ✅ **Dual Provider Support** - Printful and Gelato integration
- ✅ **Quality Checks** - Automated pre-flight validation
- ✅ **Print Preview** - Color simulation for accurate preview
- ✅ **Spread Generation** - Proper facing pages for books
- ✅ **Cover Design** - Separate handling for front/back/spine

## Quick Start

### 1. Basic Usage

```typescript
import { PrintOrchestrator, STANDARD_DIMENSIONS, PRINT_COLOR_PROFILES } from '@/lib/print';

// Configure print job
const config = {
  projectId: 'project-123',
  product: {
    id: 'photobook-8x8',
    provider: 'printful',
    productType: 'photobook',
    variant: 'hardcover',
    dimensions: STANDARD_DIMENSIONS.SQUARE_8X8,
    pageCount: 24,
    paperType: '170gsm',
    coverType: 'hardcover',
    binding: 'perfect',
  },
  pages: [...], // Array of PrintPage objects
  cover: {
    front: frontPage,
    back: backPage,
    spineWidth: PDFGenerator.calculateSpineWidth(24, '170gsm'),
  },
  colorProfile: PRINT_COLOR_PROFILES.FOGRA39,
  qualityChecks: true,
  autoFix: true,
  outputPath: './output.pdf',
};

// Generate print-ready PDF
const orchestrator = new PrintOrchestrator(config);
const { pdfBuffer, qualityCheck, preview } = await orchestrator.producePrintJob();

// Save PDF
fs.writeFileSync('photobook.pdf', pdfBuffer);
```

### 2. Submit to Print Provider

```typescript
// Upload PDF to your storage
const pdfUrl = await uploadToS3(pdfBuffer);

// Submit order to Printful
const order = await orchestrator.submitOrder('printful', {
  name: 'John Doe',
  address1: '123 Main St',
  city: 'Los Angeles',
  state_code: 'CA',
  country_code: 'US',
  zip: '90001',
  email: 'john@example.com',
}, pdfUrl);

console.log(`Order submitted: ${order.id}`);
console.log(`Status: ${order.status}`);
console.log(`Total: $${order.cost.total}`);
```

### 3. Track Order

```typescript
const status = await orchestrator.trackOrder(order.id, 'printful');
console.log(`Order status: ${status.status}`);

if (status.tracking) {
  console.log(`Tracking: ${status.tracking.trackingUrl}`);
}
```

## API Reference

### PrintOrchestrator

Main class that coordinates the entire print workflow.

#### Methods

- `producePrintJob()` - Generate print-ready PDF with quality checks
- `submitOrder(provider, recipient, pdfUrl)` - Submit order to print provider
- `trackOrder(orderId, provider)` - Get order status and tracking

### PDFGenerator

Generates print-ready PDFs from Fabric.js canvas data.

#### Methods

- `generatePrintPDF()` - Create complete PDF with cover and spreads
- `static calculateSpineWidth(pageCount, paperType)` - Calculate spine width

### QualityChecker

Validates print files for common issues.

#### Methods

- `checkPage(page)` - Check a single page for issues
- `getResult()` - Get quality check results

### PrintSimulator

Simulates how colors will look when printed.

#### Methods

- `simulateCanvas(canvasData)` - Apply print color simulation to canvas

### Color Converters

```typescript
import { rgbToCmyk, cmykToRgb, hexToRgb, isInCmykGamut } from '@/lib/print';

const cmyk = rgbToCmyk({ r: 255, g: 0, b: 0 });
// { c: 0, m: 100, y: 100, k: 0 }

const rgb = hexToRgb('#FF0000');
// { r: 255, g: 0, b: 0 }

const inGamut = isInCmykGamut({ r: 255, g: 0, b: 0 });
// true
```

## Environment Variables

```bash
# Printful
PRINTFUL_API_KEY=your_api_key

# Gelato
GELATO_API_KEY=your_api_key

# Storage (for PDF uploads)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=your_bucket
```

## Standard Dimensions

Pre-configured dimensions for common photobook sizes:

- `SQUARE_8X8` - 8" × 8" (203.2mm)
- `SQUARE_10X10` - 10" × 10" (254mm)
- `LANDSCAPE_8X10` - 8" × 10" (203.2 × 254mm)
- `A4_PORTRAIT` - A4 portrait (210 × 297mm)

All include 3mm bleed and 300 DPI.

## Color Profiles

Standard print color profiles:

- `FOGRA39` - ISO Coated v2 (Europe, recommended)
- `FOGRA51` - PSO Coated v3 (Modern European)
- `SWOP` - US Web Coated (North America)
- `sRGB` - Digital preview only

## Quality Checks

Automated checks include:

- ✓ Image resolution (must be 300+ DPI)
- ✓ Bleed area presence (3mm minimum)
- ✓ Safe margins (10mm recommended)
- ✓ Color gamut warnings
- ✓ Total ink coverage
- ✓ Transparency issues

## Best Practices

### 1. Always Use Bleed

Extend backgrounds and full-bleed images 3mm beyond trim edge.

### 2. Respect Safe Margins

Keep text and important elements at least 10mm from trim edge.

### 3. Color Mode

Design in RGB, but preview with CMYK simulation before printing.

### 4. Image Quality

Use 300 DPI images. Upscaling low-res images will look pixelated.

### 5. Fonts

Embed all fonts or convert text to outlines/paths.

### 6. Test Print

Order a single copy before bulk printing.

## Troubleshooting

### "Out of CMYK gamut" warnings

Bright, saturated colors (especially bright blues and greens) may shift when printed. Use print preview to see expected results.

### "Low resolution" errors

Images are being scaled up too much. Use higher resolution source images or reduce size on page.

### "High ink coverage" warnings

Very dark colors may cause drying issues. The system auto-reduces saturation slightly.

## Example: Complete Workflow

```typescript
import { PrintOrchestrator, STANDARD_DIMENSIONS, PRINT_COLOR_PROFILES } from '@/lib/print';
import { fabric } from 'fabric';

// 1. Create canvas pages
const createPage = async (imageUrl: string) => {
  const canvas = new fabric.StaticCanvas(null, {
    width: 2480, // 8.27" at 300 DPI
    height: 2480,
  });
  
  const img = await fabric.Image.fromURL(imageUrl);
  canvas.add(img);
  
  return canvas.toJSON();
};

// 2. Build print configuration
const pages = await Promise.all([
  createPage('/photos/1.jpg'),
  createPage('/photos/2.jpg'),
  // ... more pages
]);

const config = {
  projectId: 'my-photobook',
  product: {
    id: 'hardcover-8x8',
    provider: 'printful',
    productType: 'photobook',
    variant: 'hardcover',
    dimensions: STANDARD_DIMENSIONS.SQUARE_8X8,
    pageCount: pages.length,
    paperType: '170gsm',
    coverType: 'hardcover',
    binding: 'perfect',
  },
  pages: pages.map((data, i) => ({
    pageNumber: i + 1,
    type: 'single',
    canvasData: JSON.stringify(data),
    bleedBox: calculateBleedBox(STANDARD_DIMENSIONS.SQUARE_8X8),
    trimBox: calculateTrimBox(STANDARD_DIMENSIONS.SQUARE_8X8),
    artBox: calculateArtBox(STANDARD_DIMENSIONS.SQUARE_8X8),
  })),
  cover: {
    front: await createPage('/cover.jpg'),
    back: await createPage('/back.jpg'),
    spineWidth: 4.2,
  },
  colorProfile: PRINT_COLOR_PROFILES.FOGRA39,
  qualityChecks: true,
  autoFix: true,
  outputPath: './photobook.pdf',
};

// 3. Generate and submit
const orchestrator = new PrintOrchestrator(config);

// Quality check and generate PDF
const { pdfBuffer, qualityCheck } = await orchestrator.producePrintJob();

if (qualityCheck.score < 80) {
  console.warn('Quality issues detected:', qualityCheck.warnings);
}

// Upload and order
const pdfUrl = await uploadToStorage(pdfBuffer);
const order = await orchestrator.submitOrder('printful', recipient, pdfUrl);

console.log(`✅ Order placed: ${order.id} - $${order.cost.total}`);
```

## Architecture

```
print/
├── types.ts              # TypeScript definitions
├── index.ts              # Public exports
├── orchestrator.ts       # Main workflow coordinator
├── utils.ts              # Helper functions
├── pdf/
│   └── generator.ts      # PDF generation from canvas
├── color/
│   └── converter.ts      # RGB ↔ CMYK conversion
├── quality/
│   └── checker.ts        # Pre-flight validation
├── preview/
│   └── simulator.ts      # Print color simulation
└── providers/
    ├── printful.ts       # Printful API client
    └── gelato.ts         # Gelato API client
```

## Future Enhancements

- [ ] ICC profile support for accurate color conversion
- [ ] Advanced PDF/X-1a compliance
- [ ] Automatic image upscaling with AI
- [ ] Batch processing for multiple books
- [ ] Cost estimation before ordering
- [ ] Template library for common layouts
