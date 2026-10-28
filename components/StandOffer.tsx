import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { standOffer } from '@/lib/cart';
export default function StandOffer({ compact = false }: { compact?: boolean }) {
  return <aside className={`stand-offer ${compact ? 'compact' : ''}`} aria-label="水晶球与支架搭配礼遇"><div><p className="eyebrow">一份自然的搭配</p><h3>{standOffer.title}</h3><p>{standOffer.terms}</p></div><Link className="text-link" href="/product/sphere-stand">认识这款支架<ArrowRight size={15}/></Link></aside>;
}
