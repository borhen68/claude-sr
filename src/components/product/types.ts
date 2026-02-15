export type Size = '8x8' | '8x10' | '10x10' | '11x8.5' | '12x12';
export type CoverType = 'hardcover' | 'softcover' | 'layflat';
export type PaperType = 'matte' | 'glossy' | 'silk';

export interface ProductConfig {
  size: Size;
  coverType: CoverType;
  paperType: PaperType;
  pageCount: number;
}

export interface SizeOption {
  id: Size;
  name: string;
  dimensions: string;
  basePrice: number;
  description: string;
  popular?: boolean;
}

export interface CoverOption {
  id: CoverType;
  name: string;
  description: string;
  priceModifier: number;
  features: string[];
  imageUrl?: string;
  popular?: boolean;
}

export interface PaperOption {
  id: PaperType;
  name: string;
  description: string;
  priceModifier: number;
  features: string[];
  texture: string;
  popular?: boolean;
}

export interface PricingBreakdown {
  basePrice: number;
  sizePrice: number;
  coverPrice: number;
  paperPrice: number;
  pagePrice: number;
  subtotal: number;
  tax: number;
  total: number;
}
