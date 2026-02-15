# Print System Setup Guide

## Installation

The print system is already integrated into Frametale. No additional packages needed beyond existing dependencies.

### Required Dependencies (already in package.json)
- `fabric` - Canvas manipulation
- `sharp` - Image processing
- `next` - API routes

### Optional Dependencies for Production

```bash
npm install pdf-lib      # For advanced PDF generation
npm install @pdfme/generator  # Alternative PDF engine
npm install icc         # ICC color profile support
```

## Configuration

### 1. Environment Variables

Create `.env.local` in your project root:

```bash
# Printful API
PRINTFUL_API_KEY=your_printful_api_key_here

# Gelato API (backup provider)
GELATO_API_KEY=your_gelato_api_key_here

# File Storage (for PDF uploads)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1

# Or use other storage
STORAGE_TYPE=s3  # or 'local' or 'cloudinary'
```

### 2. API Keys

#### Printful
1. Sign up at https://www.printful.com/
2. Go to Settings → API
3. Generate a new API key
4. Add to `.env.local`

#### Gelato
1. Sign up at https://www.gelato.com/
2. Go to API Settings
3. Create API credentials
4. Add to `.env.local`

### 3. Test the System

```typescript
// test/print-test.ts
import { createPhotobookExample } from '@/lib/print/example';

async function test() {
  const result = await createPhotobookExample();
  console.log('✅ Print system working!', result.qualityCheck.score);
}

test();
```

Run:
```bash
npx ts-node test/print-test.ts
```

## Usage in Your App

### 1. Generate PDF from Editor

```typescript
// In your editor component
import { PrintOrchestrator, STANDARD_DIMENSIONS } from '@/lib/print';

async function handlePrint() {
  // Get canvas data from your Fabric.js editor
  const pages = editorPages.map(page => ({
    pageNumber: page.number,
    type: 'single',
    canvasData: JSON.stringify(page.canvas.toJSON()),
    bleedBox: calculateBleedBox(STANDARD_DIMENSIONS.SQUARE_8X8),
    trimBox: calculateTrimBox(STANDARD_DIMENSIONS.SQUARE_8X8),
    artBox: calculateArtBox(STANDARD_DIMENSIONS.SQUARE_8X8),
  }));

  const config = {
    projectId: currentProject.id,
    product: {
      id: 'photobook',
      provider: 'printful',
      productType: 'photobook',
      variant: 'hardcover',
      dimensions: STANDARD_DIMENSIONS.SQUARE_8X8,
      pageCount: pages.length,
      paperType: '170gsm',
      coverType: 'hardcover',
      binding: 'perfect',
    },
    pages,
    cover: {
      front: coverFront,
      back: coverBack,
      spineWidth: PDFGenerator.calculateSpineWidth(pages.length, '170gsm'),
    },
    colorProfile: PRINT_COLOR_PROFILES.FOGRA39,
    qualityChecks: true,
    autoFix: true,
    outputPath: `/tmp/${currentProject.id}.pdf`,
  };

  const orchestrator = new PrintOrchestrator(config);
  const { pdfBuffer, qualityCheck } = await orchestrator.producePrintJob();

  // Show quality results to user
  if (qualityCheck.warnings.length > 0) {
    showWarnings(qualityCheck.warnings);
  }

  return pdfBuffer;
}
```

### 2. API Integration

Your API routes are already set up:

```typescript
// Client-side code
const response = await fetch('/api/print/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectId: 'abc123',
    pages: canvasPages,
    cover: { front: coverFront, back: coverBack },
  }),
});

const { pdf, quality } = await response.json();
```

### 3. Submit Order

```typescript
// Upload PDF first
const pdfUrl = await uploadPDF(pdfBuffer);

// Submit order
const response = await fetch('/api/print/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'printful',
    pdfUrl,
    recipient: {
      name: 'John Doe',
      address1: '123 Main St',
      city: 'Los Angeles',
      state_code: 'CA',
      country_code: 'US',
      zip: '90001',
      email: 'john@example.com',
    },
  }),
});

const { order } = await response.json();
console.log(`Order ${order.id}: $${order.cost.total}`);
```

## Frontend Components

### Print Preview Modal

Create a component to show print simulation:

```typescript
// components/PrintPreview.tsx
import { useState } from 'react';
import { PrintSimulator } from '@/lib/print/preview/simulator';

export function PrintPreview({ canvasData }) {
  const [view, setView] = useState<'screen' | 'print'>('screen');
  const simulator = new PrintSimulator(PRINT_COLOR_PROFILES.FOGRA39);

  const simulatedCanvas = view === 'print' 
    ? await simulator.simulateCanvas(canvasData)
    : canvasData;

  return (
    <div>
      <button onClick={() => setView('screen')}>Screen Preview</button>
      <button onClick={() => setView('print')}>Print Preview</button>
      <Canvas data={simulatedCanvas} />
    </div>
  );
}
```

### Quality Check Display

```typescript
// components/QualityCheck.tsx
export function QualityCheckDisplay({ qualityCheck }) {
  return (
    <div>
      <h3>Quality Score: {qualityCheck.score}/100</h3>
      {qualityCheck.warnings.map((w, i) => (
        <div key={i} className={`warning-${w.severity}`}>
          {w.message}
        </div>
      ))}
    </div>
  );
}
```

## Production Checklist

Before going live:

- [ ] Set up Printful/Gelato accounts and verify API keys
- [ ] Configure file storage (S3/Cloudinary)
- [ ] Test complete workflow with real photos
- [ ] Order sample print to verify quality
- [ ] Set up error monitoring (Sentry)
- [ ] Implement rate limiting on API routes
- [ ] Add webhook handlers for order status updates
- [ ] Configure CORS for PDF uploads
- [ ] Set up backup provider (Gelato if using Printful)
- [ ] Add cost calculation before order submission
- [ ] Implement payment integration
- [ ] Create order tracking page for users

## Troubleshooting

### "Module not found" errors
Make sure all imports use correct paths. The print system is at `@/lib/print`.

### Quality check fails
- Check image resolution (300 DPI minimum)
- Verify bleed areas are properly set
- Ensure colors are in printable range

### API timeout
PDF generation can take 10-30 seconds. Increase timeout:
```typescript
export const maxDuration = 60; // in route.ts
```

### Color looks different in print
This is normal! Use print simulation preview to show users what to expect.

## Support

For issues specific to:
- **Printful**: https://www.printful.com/help
- **Gelato**: https://www.gelato.com/support
- **Print System**: Check README.md and example.ts

## Next Steps

1. Test the example: `npx ts-node src/lib/print/example.ts`
2. Integrate into your editor workflow
3. Set up API keys and test order submission
4. Create UI for print preview and quality checks
5. Order a test print!
