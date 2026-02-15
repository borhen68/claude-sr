/**
 * Print Preview with Color Simulation
 */

import { PrintColorProfile } from '../types';
import { rgbToCmyk, cmykToRgb, hexToRgb } from '../color/converter';

export class PrintSimulator {
  private profile: PrintColorProfile;

  constructor(profile: PrintColorProfile) {
    this.profile = profile;
  }

  async simulateCanvas(canvasData: string): Promise<string> {
    const canvas = JSON.parse(canvasData);
    
    const processedObjects = canvas.objects.map((obj: any) => {
      const processed = { ...obj };
      
      if (obj.fill && typeof obj.fill === 'string' && obj.fill.startsWith('#')) {
        processed.fill = this.simulateColor(obj.fill);
      }
      
      return processed;
    });
    
    return JSON.stringify({ ...canvas, objects: processedObjects });
  }

  private simulateColor(hexColor: string): string {
    const rgb = hexToRgb(hexColor);
    
    if (this.profile.colorSpace === 'RGB') {
      return hexColor;
    }
    
    const cmyk = rgbToCmyk(rgb);
    const printRgb = cmykToRgb(cmyk);
    
    const r = printRgb.r.toString(16).padStart(2, '0');
    const g = printRgb.g.toString(16).padStart(2, '0');
    const b = printRgb.b.toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  }
}
