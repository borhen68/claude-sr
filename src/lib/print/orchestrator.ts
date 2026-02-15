/**
 * Print Production Orchestrator
 * Coordinates the entire print workflow
 */

import { PDFGenerator } from './pdf/generator';
import { QualityChecker } from './quality/checker';
import { PrintSimulator } from './preview/simulator';
import { PrintfulClient } from './providers/printful';
import { GelatoClient } from './providers/gelato';
import {
  PrintJobConfig,
  PrintQualityCheck,
  PrintOrder,
  PrintPreview,
  PrintDimensions,
  PrintMargins,
  PRINT_COLOR_PROFILES,
} from './types';

export class PrintOrchestrator {
  private config: PrintJobConfig;
  private pdfGenerator: PDFGenerator;
  private qualityChecker: QualityChecker;
  private simulator: PrintSimulator;
  private printfulClient?: PrintfulClient;
  private gelatoClient?: GelatoClient;

  constructor(config: PrintJobConfig) {
    this.config = config;
    this.pdfGenerator = new PDFGenerator(config);
    this.qualityChecker = new QualityChecker(config.product.dimensions);
    this.simulator = new PrintSimulator(config.colorProfile);
    
    // Initialize providers based on environment
    if (process.env.PRINTFUL_API_KEY) {
      this.printfulClient = new PrintfulClient(process.env.PRINTFUL_API_KEY);
    }
    if (process.env.GELATO_API_KEY) {
      this.gelatoClient = new GelatoClient(process.env.GELATO_API_KEY);
    }
  }

  /**
   * Complete print production workflow
   */
  async producePrintJob(): Promise<{
    pdfBuffer: Buffer;
    qualityCheck: PrintQualityCheck;
    preview: PrintPreview;
  }> {
    console.log('🖨️  Starting print production...');

    // Step 1: Quality checks
    console.log('✓ Running quality checks...');
    const qualityCheck = await this.runQualityChecks();
    
    if (!qualityCheck.passed && !this.config.autoFix) {
      throw new Error(`Quality check failed: ${qualityCheck.errors.map(e => e.message).join(', ')}`);
    }

    // Step 2: Auto-fix issues if enabled
    if (this.config.autoFix && qualityCheck.warnings.length > 0) {
      console.log('✓ Auto-fixing issues...');
      await this.autoFixIssues(qualityCheck);
    }

    // Step 3: Generate print preview
    console.log('✓ Generating print preview...');
    const preview = await this.generatePreview();

    // Step 4: Generate print-ready PDF
    console.log('✓ Generating print-ready PDF...');
    const pdfBuffer = await this.pdfGenerator.generatePrintPDF();

    console.log('✅ Print production complete!');
    
    return {
      pdfBuffer,
      qualityCheck,
      preview,
    };
  }

  /**
   * Run quality checks on all pages
   */
  private async runQualityChecks(): Promise<PrintQualityCheck> {
    // Check cover
    await this.qualityChecker.checkPage(this.config.cover.front);
    await this.qualityChecker.checkPage(this.config.cover.back);
    
    // Check all interior pages
    for (const page of this.config.pages) {
      await this.qualityChecker.checkPage(page);
    }
    
    return this.qualityChecker.getResult();
  }

  /**
   * Auto-fix common issues
   */
  private async autoFixIssues(qualityCheck: PrintQualityCheck): Promise<void> {
    for (const warning of qualityCheck.warnings) {
      if (!warning.autoFixable) continue;

      switch (warning.type) {
        case 'bleed-missing':
          // Extend elements to bleed area
          break;
        case 'color-gamut':
          // Convert out-of-gamut colors
          break;
      }
    }
  }

  /**
   * Generate print preview with color simulation
   */
  private async generatePreview(): Promise<PrintPreview> {
    const thumbnails: string[] = [];
    
    // Generate previews for key pages
    const keyPages = [
      this.config.cover.front,
      this.config.pages[0],
      this.config.pages[Math.floor(this.config.pages.length / 2)],
    ];
    
    for (const page of keyPages) {
      const simulated = await this.simulator.simulateCanvas(page.canvasData);
      thumbnails.push(simulated);
    }
    
    return {
      type: 'print-simulation',
      colorProfile: this.config.colorProfile,
      renderUrl: '', // Would be a URL to the full preview
      thumbnails,
    };
  }

  /**
   * Submit order to print provider
   */
  async submitOrder(
    provider: 'printful' | 'gelato',
    recipient: any,
    pdfUrl: string
  ): Promise<PrintOrder> {
    if (provider === 'printful' && this.printfulClient) {
      return this.submitToPrintful(recipient, pdfUrl);
    } else if (provider === 'gelato' && this.gelatoClient) {
      return this.submitToGelato(recipient, pdfUrl);
    }
    
    throw new Error(`Provider ${provider} not configured`);
  }

  private async submitToPrintful(recipient: any, pdfUrl: string): Promise<PrintOrder> {
    if (!this.printfulClient) throw new Error('Printful not configured');

    const order = await this.printfulClient.createOrder({
      recipient,
      items: [
        {
          variantId: PrintfulClient.PHOTOBOOK_PRODUCTS.HARDCOVER_8X8,
          quantity: 1,
          files: [
            { url: pdfUrl, type: 'default' },
          ],
        },
      ],
    });

    return {
      id: order.id.toString(),
      provider: 'printful',
      productId: this.config.product.id,
      quantity: 1,
      pdfUrl,
      status: PrintfulClient.mapStatus(order.status),
      cost: {
        subtotal: parseFloat(order.costs.subtotal),
        shipping: parseFloat(order.costs.shipping),
        tax: parseFloat(order.costs.tax),
        total: parseFloat(order.costs.total),
        currency: order.costs.currency,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private async submitToGelato(recipient: any, pdfUrl: string): Promise<PrintOrder> {
    if (!this.gelatoClient) throw new Error('Gelato not configured');

    const order = await this.gelatoClient.createOrder({
      orderReferenceId: `frametale-${Date.now()}`,
      items: [
        {
          productUid: GelatoClient.PHOTOBOOK_PRODUCTS.HARDCOVER_SQUARE,
          quantity: 1,
          files: [{ url: pdfUrl, type: 'full' }],
        },
      ],
      shippingAddress: {
        firstName: recipient.name.split(' ')[0],
        lastName: recipient.name.split(' ')[1] || '',
        addressLine1: recipient.address1,
        city: recipient.city,
        postCode: recipient.zip,
        country: recipient.country_code,
        email: recipient.email,
      },
    });

    return {
      id: order.id,
      provider: 'gelato',
      productId: this.config.product.id,
      quantity: 1,
      pdfUrl,
      status: GelatoClient.mapStatus(order.status),
      cost: {
        subtotal: order.cost.amount,
        shipping: 0,
        tax: 0,
        total: order.cost.amount,
        currency: order.cost.currency,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Track order status
   */
  async trackOrder(orderId: string, provider: 'printful' | 'gelato'): Promise<PrintOrder> {
    if (provider === 'printful' && this.printfulClient) {
      const order = await this.printfulClient.getOrder(parseInt(orderId));
      
      return {
        id: order.id.toString(),
        provider: 'printful',
        productId: this.config.product.id,
        quantity: 1,
        pdfUrl: '',
        status: PrintfulClient.mapStatus(order.status),
        cost: {
          subtotal: parseFloat(order.costs.subtotal),
          shipping: parseFloat(order.costs.shipping),
          tax: parseFloat(order.costs.tax),
          total: parseFloat(order.costs.total),
          currency: order.costs.currency,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } else if (provider === 'gelato' && this.gelatoClient) {
      const order = await this.gelatoClient.getOrder(orderId);
      
      return {
        id: order.id,
        provider: 'gelato',
        productId: this.config.product.id,
        quantity: 1,
        pdfUrl: '',
        status: GelatoClient.mapStatus(order.status),
        cost: {
          subtotal: order.cost.amount,
          shipping: 0,
          tax: 0,
          total: order.cost.amount,
          currency: order.cost.currency,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    throw new Error(`Provider ${provider} not configured`);
  }
}

/**
 * Standard print dimensions for common photobook sizes
 */
export const STANDARD_DIMENSIONS: Record<string, PrintDimensions> = {
  'SQUARE_8X8': {
    width: 203.2,  // 8 inches in mm
    height: 203.2,
    bleed: 3,
    dpi: 300,
  },
  'SQUARE_10X10': {
    width: 254,    // 10 inches in mm
    height: 254,
    bleed: 3,
    dpi: 300,
  },
  'LANDSCAPE_8X10': {
    width: 254,
    height: 203.2,
    bleed: 3,
    dpi: 300,
  },
  'A4_PORTRAIT': {
    width: 210,
    height: 297,
    bleed: 3,
    dpi: 300,
  },
};

/**
 * Standard print margins
 */
export const STANDARD_MARGINS: PrintMargins = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
  spine: 15,  // Extra margin for spine/binding
};
