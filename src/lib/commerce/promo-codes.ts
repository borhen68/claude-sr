import { prisma } from '@/lib/prisma';
import { PromoType } from '@prisma/client';
import { PromoCodeValidation } from './types';

export async function validatePromoCode(
  code: string,
  subtotal: number,
  userId?: string
): Promise<PromoCodeValidation> {
  try {
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        orders: userId ? {
          where: { userId },
        } : false,
      },
    });

    if (!promoCode) {
      return { valid: false, error: 'Invalid promo code' };
    }

    if (!promoCode.active) {
      return { valid: false, error: 'This promo code is no longer active' };
    }

    // Check date validity
    const now = new Date();
    if (promoCode.validFrom && promoCode.validFrom > now) {
      return { valid: false, error: 'This promo code is not yet valid' };
    }
    if (promoCode.validUntil && promoCode.validUntil < now) {
      return { valid: false, error: 'This promo code has expired' };
    }

    // Check usage limits
    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return { valid: false, error: 'This promo code has reached its usage limit' };
    }

    // Check per-user limit
    if (userId && promoCode.perUserLimit) {
      const userUsageCount = Array.isArray(promoCode.orders) 
        ? promoCode.orders.length 
        : 0;
      
      if (userUsageCount >= promoCode.perUserLimit) {
        return { valid: false, error: 'You have already used this promo code the maximum number of times' };
      }
    }

    // Check minimum purchase
    if (promoCode.minPurchase && subtotal < promoCode.minPurchase) {
      return { 
        valid: false, 
        error: `Minimum purchase of $${promoCode.minPurchase.toFixed(2)} required` 
      };
    }

    // Calculate discount
    let discountAmount = 0;
    
    switch (promoCode.type) {
      case PromoType.PERCENTAGE:
        discountAmount = subtotal * (promoCode.value / 100);
        if (promoCode.maxDiscount) {
          discountAmount = Math.min(discountAmount, promoCode.maxDiscount);
        }
        break;
      
      case PromoType.FIXED:
        discountAmount = promoCode.value;
        break;
      
      case PromoType.FREE_SHIPPING:
        // Handled separately in checkout
        discountAmount = 0;
        break;
    }

    return {
      valid: true,
      code: promoCode.code,
      type: promoCode.type,
      value: promoCode.value,
      discountAmount,
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return { valid: false, error: 'Error validating promo code' };
  }
}

export async function incrementPromoCodeUsage(code: string): Promise<void> {
  try {
    await prisma.promoCode.update({
      where: { code: code.toUpperCase() },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error('Error incrementing promo code usage:', error);
  }
}

export async function createPromoCode(data: {
  code: string;
  description?: string;
  type: PromoType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  validFrom?: Date;
  validUntil?: Date;
}) {
  return prisma.promoCode.create({
    data: {
      ...data,
      code: data.code.toUpperCase(),
    },
  });
}
