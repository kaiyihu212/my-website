import type { Product } from '@/lib/data';

/** A shared photography contact sheet, framed in CSS; original images are retained. */
export default function ProductPhoto({ product, eager = false }: { product: Product; eager?: boolean }) {
  return <div className="catalogue-photo"><img src={product.image} alt={`${product.name}款式参考图`} width="1254" height="1254" loading={eager ? 'eager' : 'lazy'} style={{ width: '300%', height: '300%', maxWidth: 'none', left: `${-(product.photoIndex % 3) * 100}%`, top: `${-Math.floor(product.photoIndex / 3) * 100}%` }}/></div>;
}
