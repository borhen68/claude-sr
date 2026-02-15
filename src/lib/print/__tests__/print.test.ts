/**
 * Print System Tests
 */

import { rgbToCmyk, cmykToRgb, hexToRgb, isInCmykGamut } from '../color/converter';
import { calculateBleedBox, calculateTrimBox, mmToPixels, pixelsToMm } from '../utils';
import { STANDARD_DIMENSIONS } from '../orchestrator';

describe('Color Conversion', () => {
  test('RGB to CMYK', () => {
    const red = rgbToCmyk({ r: 255, g: 0, b: 0 });
    expect(red).toEqual({ c: 0, m: 100, y: 100, k: 0 });
  });

  test('CMYK gamut check', () => {
    const red = { r: 255, g: 0, b: 0 };
    expect(isInCmykGamut(red)).toBe(true);
  });
});

describe('Dimensions', () => {
  test('Bleed box calculation', () => {
    const dims = STANDARD_DIMENSIONS.SQUARE_8X8;
    const bleedBox = calculateBleedBox(dims);
    expect(bleedBox.width).toBe(dims.width + dims.bleed * 2);
  });
});
