/**
 * Print Quality Checker
 * Validates print-ready files for common issues
 */

import { PrintPage, PrintQualityCheck, QualityWarning, QualityError, PrintDimensions } from '../types';
import { isInCmykGamut, hexToRgb } from '../color/converter';

export class QualityChecker {
  private dimensions: PrintDimensions;
  private warnings: QualityWarning[] = [];
  private errors: QualityError[] = [];

  constructor(dimensions: PrintDimensions) {
    this.dimensions = dimensions;
  }

  async checkPage(page: PrintPage): Promise<void> {
    await this.checkResolution(page);
    this.checkBleed(page);
    this.checkMargins(page);
    await this.checkColors(page);
  }

  private async checkResolution(page: PrintPage): Promise<void> {
    const canvasData = JSON.parse(page.canvasData);
    
    for (const obj of canvasData.objects || []) {
      if (obj.type === 'image') {
        const imageWidth = obj.width || 0;
        const imageHeight = obj.height || 0;
        const scaleX = obj.scaleX || 1;
        const scaleY = obj.scaleY || 1;
        
        // Calculate effective DPI
        const effectiveWidth = imageWidth * scaleX;
        const effectiveHeight = imageHeight * scaleY;
        const dpi = Math.min(
          (imageWidth / effectiveWidth) * 72,
          (imageHeight / effectiveHeight) * 72
        );
        
        if (dpi < 300) {
          this.warnings.push({
            type: 'low-resolution',
            severity: dpi < 200 ? 'high' : 'medium',
            message: `Image resolution is ${Math.round(dpi)} DPI (should be 300 DPI)`,
            pageNumber: page.pageNumber,
            autoFixable: false,
          });
        }
      }
    }
  }

  private checkBleed(page: PrintPage): void {
    const requiredBleed = this.dimensions.bleed;
    
    if (!page.bleedBox || page.bleedBox.width === 0) {
      this.errors.push({
        type: 'missing-bleed',
        message: `Page ${page.pageNumber} is missing bleed area`,
        pageNumber: page.pageNumber,
        blocking: true,
      });
      return;
    }
    
    const bleedWidth = (page.bleedBox.width - page.trimBox.width) / 2;
    const bleedHeight = (page.bleedBox.height - page.trimBox.height) / 2;
    
    if (bleedWidth < requiredBleed || bleedHeight < requiredBleed) {
      this.warnings.push({
        type: 'bleed-missing',
        severity: 'high',
        message: `Insufficient bleed: ${bleedWidth}mm x ${bleedHeight}mm (need ${requiredBleed}mm)`,
        pageNumber: page.pageNumber,
        autoFixable: true,
      });
    }
  }

  private checkMargins(page: PrintPage): void {
    const canvasData = JSON.parse(page.canvasData);
    const safeZone = 5; // 5mm safe zone from trim
    
    for (const obj of canvasData.objects || []) {
      if (obj.type === 'text' || obj.type === 'textbox') {
        const left = obj.left || 0;
        const top = obj.top || 0;
        
        if (left < safeZone || top < safeZone) {
          this.warnings.push({
            type: 'margin-violation',
            severity: 'medium',
            message: `Text too close to edge on page ${page.pageNumber}`,
            pageNumber: page.pageNumber,
            autoFixable: false,
          });
        }
      }
    }
  }

  private async checkColors(page: PrintPage): Promise<void> {
    const canvasData = JSON.parse(page.canvasData);
    
    for (const obj of canvasData.objects || []) {
      if (obj.fill && typeof obj.fill === 'string') {
        const rgb = hexToRgb(obj.fill);
        if (!isInCmykGamut(rgb)) {
          this.warnings.push({
            type: 'color-gamut',
            severity: 'medium',
            message: `Color ${obj.fill} may shift when printed`,
            pageNumber: page.pageNumber,
            autoFixable: true,
          });
        }
      }
    }
  }

  getResult(): PrintQualityCheck {
    const score = this.calculateScore();
    
    return {
      passed: this.errors.length === 0,
      warnings: this.warnings,
      errors: this.errors,
      score,
    };
  }

  private calculateScore(): number {
    let score = 100;
    
    score -= this.errors.length * 20;
    score -= this.warnings.filter(w => w.severity === 'high').length * 10;
    score -= this.warnings.filter(w => w.severity === 'medium').length * 5;
    score -= this.warnings.filter(w => w.severity === 'low').length * 2;
    
    return Math.max(0, Math.min(100, score));
  }
}
