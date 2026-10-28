import { products } from './data';
export type CartItem = { id: string; size: string; quantity: number };
export const standOffer = { minimumSpheres: 2, standId: 'sphere-stand', maxGifts: 1, title: '任选两颗水晶球，赠木质支架一只', terms: '颜色与尺寸可混选；每份选购清单限赠一只，仅计算水晶球。' };

/** Gift entitlement is derived, never stored; a paid stand is waived before adding a separate gift. */
export function priceCart(items: CartItem[]) {
  let subtotal = 0, sphereQuantity = 0, standQuantity = 0, quantity = 0;
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    if (!product || !product.sizes.includes(item.size) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > product.maxQuantity) continue;
    subtotal += product.price * item.quantity;
    quantity += item.quantity;
    if (product.category === 'sphere') sphereQuantity += item.quantity;
    if (product.id === standOffer.standId) standQuantity += item.quantity;
  }
  const eligible = sphereQuantity >= standOffer.minimumSpheres;
  const stand = products.find(p => p.id === standOffer.standId)!;
  const discountedStands = eligible ? Math.min(standQuantity,standOffer.maxGifts) : 0;
  const discount = discountedStands * stand.price;
  return { subtotal, total: subtotal - discount, discount, quantity, sphereQuantity, eligible, giftQuantity: eligible && standQuantity === 0 ? standOffer.maxGifts : 0, remainingSpheres: Math.max(0, standOffer.minimumSpheres-sphereQuantity), stand };
}
