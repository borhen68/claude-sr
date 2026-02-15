/**
 * Complete Example: Photobook Print Production
 * Demonstrates the full workflow from canvas to printed book
 */

import { fabric } from 'fabric';
import {
  PrintOrchestrator,
  STANDARD_DIMENSIONS,
  PRINT_COLOR_PROFILES,
  PDFGenerator,
  calculateBleedBox,
  calculateTrimBox,
  calculateArtBox,
  mmToPixels,
} from './index';
import { PrintJobConfig, PrintPage } from './types';

/**
 * Example: Create a photobook from images
 */
export async function createPhotobookExample() {
  console.log('📚 Creating Photobook Example\n');

  // Step 1: Define book specifications
  const dimensions = STANDARD_DIMENSIONS.SQUARE_8X8;
  const paperType = '170gsm';
  const pageCount = 24;

  console.log('Book Specifications:');
  console.log(`- Size: 8" × 8" (${dimensions.width}mm × ${dimensions.height}mm)`);
  console.log(`- Pages: ${pageCount}`);
  console.log(`- Paper: ${paperType}`);
  console.log(`- DPI: ${dimensions.dpi}`);
  console.log(`- Bleed: ${dimensions.bleed}mm\n`);

  // Step 2: Create canvas pages
  console.log('Creating pages...');
  const pages: PrintPage[] = [];

  for (let i = 0; i < pageCount; i++) {
    const page = await createPhotoPage(i + 1, dimensions, [
      `/photos/photo-${i + 1}.jpg`,
    ]);
    pages.push(page);
    console.log(`✓ Page ${i + 1}/${pageCount}`);
  }

  // Step 3: Create cover design
  console.log('\nCreating cover...');
  const cover = {
    front: await createCoverPage('front', dimensions, '/covers/front.jpg'),
    back: await createCoverPage('back', dimensions, '/covers/back.jpg'),
    spineWidth: PDFGenerator.calculateSpineWidth(pageCount, paperType),
  };
  console.log(`✓ Cover created (spine: ${cover.spineWidth.toFixed(2)}mm)`);

  // Step 4: Configure print job
  const config: PrintJobConfig = {
    projectId: 'example-photobook-001',
    product: {
      id: 'hardcover-8x8',
      provider: 'printful',
      productType: 'photobook',
      variant: 'hardcover',
      dimensions,
      pageCount,
      paperType,
      coverType: 'hardcover',
      binding: 'perfect',
    },
    pages,
    cover,
    colorProfile: PRINT_COLOR_PROFILES.FOGRA39,
    qualityChecks: true,
    autoFix: true,
    outputPath: './output/example-photobook.pdf',
  };

  // Step 5: Generate print-ready PDF
  console.log('\n🖨️  Generating print-ready PDF...\n');
  const orchestrator = new PrintOrchestrator(config);
  const { pdfBuffer, qualityCheck, preview } = await orchestrator.producePrintJob();

  // Step 6: Review quality results
  console.log('\n📊 Quality Check Results:');
  console.log(`Score: ${qualityCheck.score}/100`);
  console.log(`Status: ${qualityCheck.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Errors: ${qualityCheck.errors.length}`);
  console.log(`Warnings: ${qualityCheck.warnings.length}\n`);

  if (qualityCheck.warnings.length > 0) {
    console.log('Warnings:');
    qualityCheck.warnings.forEach(w => {
      console.log(`  - [${w.severity.toUpperCase()}] ${w.message}`);
    });
    console.log('');
  }

  if (qualityCheck.errors.length > 0) {
    console.log('Errors:');
    qualityCheck.errors.forEach(e => {
      console.log(`  - ${e.message}`);
    });
    console.log('');
  }

  // Step 7: Save PDF
  console.log(`📄 PDF Generated: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Preview thumbnails: ${preview.thumbnails.length}`);

  return {
    pdfBuffer,
    qualityCheck,
    preview,
  };
}

/**
 * Create a photo page with layout
 */
async function createPhotoPage(
  pageNumber: number,
  dimensions: typeof STANDARD_DIMENSIONS.SQUARE_8X8,
  photoUrls: string[]
): Promise<PrintPage> {
  const canvasWidth = mmToPixels(dimensions.width + dimensions.bleed * 2, dimensions.dpi);
  const canvasHeight = mmToPixels(dimensions.height + dimensions.bleed * 2, dimensions.dpi);

  const canvas = new fabric.StaticCanvas(null, {
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor: '#FFFFFF',
  });

  // Add photo (simplified - in production, handle loading properly)
  const photoData = {
    type: 'image',
    version: '5.3.0',
    originX: 'left',
    originY: 'top',
    left: mmToPixels(dimensions.bleed, dimensions.dpi),
    top: mmToPixels(dimensions.bleed, dimensions.dpi),
    width: mmToPixels(dimensions.width, dimensions.dpi),
    height: mmToPixels(dimensions.height, dimensions.dpi),
    src: photoUrls[0],
  };

  canvas.add(new fabric.Rect({
    left: photoData.left,
    top: photoData.top,
    width: photoData.width,
    height: photoData.height,
    fill: '#E0E0E0', // Placeholder
  }));

  return {
    pageNumber,
    type: 'single',
    canvasData: JSON.stringify(canvas.toJSON()),
    bleedBox: calculateBleedBox(dimensions),
    trimBox: calculateTrimBox(dimensions),
    artBox: calculateArtBox(dimensions),
  };
}

/**
 * Create cover page
 */
async function createCoverPage(
  side: 'front' | 'back',
  dimensions: typeof STANDARD_DIMENSIONS.SQUARE_8X8,
  imageUrl: string
): Promise<PrintPage> {
  const canvasWidth = mmToPixels(dimensions.width + dimensions.bleed * 2, dimensions.dpi);
  const canvasHeight = mmToPixels(dimensions.height + dimensions.bleed * 2, dimensions.dpi);

  const canvas = new fabric.StaticCanvas(null, {
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor: '#FFFFFF',
  });

  // Add cover image
  canvas.add(new fabric.Rect({
    left: 0,
    top: 0,
    width: canvasWidth,
    height: canvasHeight,
    fill: side === 'front' ? '#2E5090' : '#1A3050',
  }));

  // Add title (front only)
  if (side === 'front') {
    canvas.add(new fabric.Text('My Photobook', {
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      fontSize: 72,
      fontFamily: 'Arial',
      fill: '#FFFFFF',
      originX: 'center',
      originY: 'center',
    }));
  }

  return {
    pageNumber: side === 'front' ? 0 : -1,
    type: side === 'front' ? 'cover-front' : 'cover-back',
    canvasData: JSON.stringify(canvas.toJSON()),
    bleedBox: calculateBleedBox(dimensions),
    trimBox: calculateTrimBox(dimensions),
    artBox: calculateArtBox(dimensions),
  };
}

/**
 * Example: Submit order to Printful
 */
export async function submitOrderExample(pdfUrl: string) {
  console.log('📦 Submitting Order Example\n');

  const config: PrintJobConfig = {
    projectId: 'example-order',
    product: {
      id: 'hardcover-8x8',
      provider: 'printful',
      productType: 'photobook',
      variant: 'hardcover',
      dimensions: STANDARD_DIMENSIONS.SQUARE_8X8,
      pageCount: 24,
      paperType: '170gsm',
      coverType: 'hardcover',
      binding: 'perfect',
    },
    pages: [],
    cover: { front: {} as any, back: {} as any, spineWidth: 4.2 },
    colorProfile: PRINT_COLOR_PROFILES.FOGRA39,
    qualityChecks: false,
    autoFix: false,
    outputPath: '',
  };

  const orchestrator = new PrintOrchestrator(config);

  const order = await orchestrator.submitOrder('printful', {
    name: 'John Doe',
    address1: '123 Main Street',
    city: 'Los Angeles',
    state_code: 'CA',
    country_code: 'US',
    zip: '90001',
    email: 'john@example.com',
    phone: '+1-555-0100',
  }, pdfUrl);

  console.log('✅ Order Submitted!');
  console.log(`Order ID: ${order.id}`);
  console.log(`Status: ${order.status}`);
  console.log(`Provider: ${order.provider}`);
  console.log(`\nCost Breakdown:`);
  console.log(`  Subtotal: $${order.cost.subtotal.toFixed(2)}`);
  console.log(`  Shipping: $${order.cost.shipping.toFixed(2)}`);
  console.log(`  Tax: $${order.cost.tax.toFixed(2)}`);
  console.log(`  Total: $${order.cost.total.toFixed(2)} ${order.cost.currency}`);

  return order;
}

/**
 * Example: Track order status
 */
export async function trackOrderExample(orderId: string, provider: 'printful' | 'gelato') {
  console.log(`📍 Tracking Order: ${orderId}\n`);

  const config: PrintJobConfig = {
    projectId: 'tracking',
    product: {
      id: 'hardcover-8x8',
      provider,
      productType: 'photobook',
      variant: 'hardcover',
      dimensions: STANDARD_DIMENSIONS.SQUARE_8X8,
      pageCount: 24,
      paperType: '170gsm',
      coverType: 'hardcover',
      binding: 'perfect',
    },
    pages: [],
    cover: { front: {} as any, back: {} as any, spineWidth: 4.2 },
    colorProfile: PRINT_COLOR_PROFILES.FOGRA39,
    qualityChecks: false,
    autoFix: false,
    outputPath: '',
  };

  const orchestrator = new PrintOrchestrator(config);
  const order = await orchestrator.trackOrder(orderId, provider);

  console.log(`Status: ${order.status.toUpperCase()}`);
  if (order.tracking) {
    console.log(`\nTracking Information:`);
    console.log(`  Carrier: ${order.tracking.carrier}`);
    console.log(`  Tracking #: ${order.tracking.trackingNumber}`);
    console.log(`  URL: ${order.tracking.trackingUrl}`);
    if (order.tracking.estimatedDelivery) {
      console.log(`  Estimated Delivery: ${order.tracking.estimatedDelivery.toDateString()}`);
    }
  }

  return order;
}

// Run examples if executed directly
if (require.main === module) {
  (async () => {
    try {
      await createPhotobookExample();
    } catch (error) {
      console.error('Error:', error);
    }
  })();
}
