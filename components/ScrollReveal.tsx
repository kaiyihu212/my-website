'use client';

import { useEffect } from 'react';

const targets = '.section-heading, .intro > *, .product-card, .intention-tile, .feature-copy > *, .ritual-copy > *, .ritual-visual, .brand-quote > *, .journal-card, .newsletter > *, .collection-story, .bazi-intro > *';

export default function ScrollReveal({ page }: { page: string }) {
  useEffect(() => {
    const main = document.querySelector('main');
    if (!main || !('IntersectionObserver' in window)) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;
    let frame = 0;
    const seen = new WeakSet<Element>();
    const touched = new Set<HTMLElement>();
    const clear = () => {
      observer?.disconnect(); mutations?.disconnect(); cancelAnimationFrame(frame);
      touched.forEach(node => node.classList.remove('reveal-pending', 'reveal-visible'));
    };
    const setup = () => {
      clear();
      if (media.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('reveal-visible'); observer?.unobserve(entry.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
      const scan = () => {
        main.querySelectorAll<HTMLElement>(targets).forEach((node, index) => {
          if (seen.has(node)) return;
          seen.add(node); touched.add(node);
          if (node.getBoundingClientRect().top < window.innerHeight - 30) return;
          node.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 70}ms`);
          node.classList.add('reveal-pending');
          observer?.observe(node);
        });
      };
      scan();
      mutations = new MutationObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(scan); });
      mutations.observe(main, { childList: true, subtree: true });
    };
    setup(); media.addEventListener('change', setup);
    return () => { clear(); media.removeEventListener('change', setup); };
  }, [page]);
  return null;
}
