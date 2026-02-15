/**
 * Print Production System Types
 * Comprehensive type definitions for print-ready PDF generation
 */

export interface PrintDimensions {
  width: number;  // in mm
  height: number; // in mm
  bleed: number;  // in mm (typically 3mm)
  dpi: number;    // dots per inch (300 for print)
}

export interface PrintMargins {
  top: number;    // in mm
  bottom: number; // in mm
  left: number;   // in mm
  right: number;  // in mm
  spine: number;  // in mm (for spreads)
}

export interface CMYKColor {
  c: number; // Cyan 0-100
  m: number; // Magenta 0-100
  y: number; // Yellow 0-100
  k: number; // Black 0-100
}

export interface RGBColor {
  r: number; // Red 0-255
  g: number; // Green 0-255
  b: number; // Blue 0-255
}

export interface PrintColorProfile {
  name: string;
  iccProfile?: string;
  colorSpace: 'CMYK' | 'RGB';
  renderingIntent: 'perceptual' | 'relative' | 'saturation' | 'absolute';
}

export interface BleedBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PrintPage {
  pageNumber: number;
  type: 'cover-front' | 'cover-back' | 'spread' | 'single';
  canvasData: string; // Fabric.js JSON
  bleedBox: BleedBox;
  trimBox: BleedBox;
  artBox: BleedBox;
}

export interface SpreadPage {
  leftPage: PrintPage;
  rightPage: PrintPage;
  spreadNumber: number;
}

export interface CoverDesign {
  front: PrintPage;
  back: PrintPage;
  spine?: PrintPage;
  fullCover?: PrintPage; // Complete wrap-around
  spineWidth: number; // calculated from page count
}

export interface PrintQualityCheck {
  passed: boolean;
  warnings: QualityWarning[];
  errors: QualityError[];
  score: number; // 0-100
}

export interface QualityWarning {
  type: 'low-resolution' | 'color-gamut' | 'bleed-missing' | 'margin-violation' | 'transparency';
  severity: 'low' | 'medium' | 'high';
  message: string;
  pageNumber?: number;
  autoFixable: boolean;
}

export interface QualityError {
  type: 'missing-bleed' | 'invalid-dimensions' | 'color-mode' | 'font-missing' | 'corrupt-image';
  message: string;
  pageNumber?: number;
  blocking: boolean;
}

export interface PrintProduct {
  id: string;
  provider: 'printful' | 'gelato';
  productType: 'photobook' | 'hardcover' | 'softcover' | 'magazine';
  variant: string;
  dimensions: PrintDimensions;
  pageCount: number;
  paperType: string;
  coverType: string;
  binding: string;
}

export interface PrintOrder {
  id: string;
  provider: 'printful' | 'gelato';
  productId: string;
  quantity: number;
  pdfUrl: string;
  status: OrderStatus;
  tracking?: TrackingInfo;
  cost: OrderCost;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'draft'
  | 'pending'
  | 'processing'
  | 'printing'
  | 'shipped'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery?: Date;
}

export interface OrderCost {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface PrintPreview {
  type: 'screen' | 'print-simulation';
  colorProfile: PrintColorProfile;
  renderUrl: string;
  thumbnails: string[];
}

export interface PrintJobConfig {
  projectId: string;
  product: PrintProduct;
  pages: PrintPage[];
  cover: CoverDesign;
  colorProfile: PrintColorProfile;
  qualityChecks: boolean;
  autoFix: boolean;
  outputPath: string;
}

// Provider-specific types
export interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  variants: PrintfulVariant[];
  sync_product_id?: number;
}

export interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  price: string;
  in_stock: boolean;
}

export interface PrintfulOrder {
  id: number;
  external_id: string;
  status: string;
  shipping: string;
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  costs: PrintfulCosts;
}

export interface PrintfulRecipient {
  name: string;
  address1: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  email?: string;
  phone?: string;
}

export interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: PrintfulFile[];
}

export interface PrintfulFile {
  url: string;
  type: 'default' | 'preview' | 'back' | 'front' | 'inside';
  filename: string;
}

export interface PrintfulCosts {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  currency: string;
}

export interface GelatoProduct {
  uid: string;
  productUid: string;
  title: string;
  description: string;
  pages: number;
  coverType: string;
  binding: string;
}

export interface GelatoOrder {
  id: string;
  orderReferenceId: string;
  status: string;
  items: GelatoOrderItem[];
  shippingAddress: GelatoAddress;
  cost: GelatoCost;
}

export interface GelatoOrderItem {
  productUid: string;
  quantity: number;
  files: GelatoFile[];
}

export interface GelatoFile {
  url: string;
  type: 'cover' | 'interior' | 'full';
}

export interface GelatoAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  city: string;
  postCode: string;
  country: string;
  email?: string;
}

export interface GelatoCost {
  amount: number;
  currency: string;
}
