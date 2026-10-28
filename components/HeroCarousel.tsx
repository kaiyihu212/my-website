'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';

export const heroScenes = [
  { id: 'jewelry', name: '随身心意', category: '水晶手链', image: '/photos/jewelry-editorial.webp', alt: '自然柔光下，肌肤与亚麻衣袖间的粉晶手链佩戴特写', lines: ['把心之所向，', '戴在身边。'], description: '以自然水晶为灵感，让每一次佩戴，\n都成为与自己温柔相处的时刻。', href: '/shop?category=bracelet', action: '探索水晶手链', note: '一抹自然色泽，一份随身心意。' },
  { id: 'home', name: '自然居所', category: '水晶球与摆件', image: '/photos/home-editorial.webp', alt: '浅色石材上的白水晶球、紫晶簇和贝壳', lines: ['让自然之美，', '住进日常。'], description: '一颗水晶球，一簇自然纹理。\n为熟悉的空间，留一处静静喜欢的角落。', href: '/shop?category=home', action: '探索水晶球与摆件', note: '在光线停留的地方，安放喜欢。' },
  { id: 'meditation', name: '静坐时光', category: '冥想与日常', image: '/photos/meditation-editorial.webp', alt: '一位身着亚麻衣服的人在有水晶摆件的自然光居室中静坐', lines: ['留一段时光，', '与自己相处。'], description: '让呼吸慢下来，让心意有处安放。\n把小小的仪式，带进每一天。', href: '/journal/meditation', action: '开启五分钟冥想', note: '不必去远方，此刻就很好。' },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    motion(); visibility(); setReady(true);
    media.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 }) : null;
    if (root.current) observer?.observe(root.current);
    return () => { media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); observer?.disconnect(); };
  }, []);

  const rotating = ready && !paused && !hovered && !reduced && visible && inView;
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % heroScenes.length), 7000);
    return () => window.clearInterval(timer);
  }, [rotating, active]);

  function select(index: number) {
    setPaused(true);
    setActive((index + heroScenes.length) % heroScenes.length);
  }
  const scene = heroScenes[active];
  return <section ref={root} className="hero editorial-hero" role="region" aria-roledescription="轮播" aria-label="品牌生活场景" data-scene={scene.id}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={event => { if (!(event.target as HTMLElement).closest('[data-rotation-toggle]')) setPaused(true); }}
    onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); select(active + 1); } if (event.key === 'ArrowLeft') { event.preventDefault(); select(active - 1); } }}>
    <div className="hero-copy">
      <div className="hero-scene-copy" key={scene.id} aria-live={paused ? 'polite' : 'off'}>
        <p className="eyebrow">自然水晶 · {scene.category} · 日常仪式</p>
        <h1>{scene.lines.map((line, index) => <span key={line} style={{ animationDelay: `${index * 90}ms` }}>{line}</span>)}</h1>
        <p className="hero-description">{scene.description.split('\n').map(line => <span key={line}>{line}</span>)}</p>
        <div className="hero-buttons"><Link className="button" href={scene.href}>{scene.action}<ArrowRight size={17}/></Link><Link className="text-link" href="/intentions">寻找专属心意<ArrowUpRight size={16}/></Link></div>
      </div>
      <div className="hero-carousel-footer">
        <span className="scene-number" aria-hidden="true">0{active + 1}<span>/ 03</span></span>
        <div className="scene-tabs" aria-label="选择场景">{heroScenes.map((item, index) => <button key={item.id} type="button" aria-label={`切换到${item.name}`} aria-pressed={index === active} onClick={() => select(index)}><span className="scene-tab-line"/>{item.name}</button>)}</div>
        <button className="rotation-toggle" type="button" data-rotation-toggle aria-label={paused || reduced ? '播放轮播' : '暂停轮播'} aria-pressed={paused || reduced} disabled={reduced} onClick={() => setPaused(value => !value)}>{paused || reduced ? <Play size={14}/> : <Pause size={14}/>}</button>
      </div>
    </div>
    <div className="hero-art photographic-hero"
      onTouchStart={event => { touch.current = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }; }}
      onTouchEnd={event => { if (!touch.current) return; const dx = event.changedTouches[0].clientX - touch.current.x; const dy = event.changedTouches[0].clientY - touch.current.y; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) select(active + (dx < 0 ? 1 : -1)); touch.current = null; }}>
      {heroScenes.map((item, index) => <div key={item.id} className={`hero-photograph ${index === active ? 'is-active' : ''}`} aria-hidden={index !== active}><img src={item.image} alt={index === active ? item.alt : ''} width="1448" height="1086" fetchPriority={index === 0 ? 'high' : 'low'} loading={index === 0 ? 'eager' : 'lazy'}/></div>)}
      <div className="photograph-shade"/>
      <span className="photo-caption">{scene.note}</span>
      <div className="photo-arrows"><button type="button" aria-label="上一张场景" onClick={() => select(active - 1)}><ArrowLeft size={18}/></button><button type="button" aria-label="下一张场景" onClick={() => select(active + 1)}><ArrowRight size={18}/></button></div>
    </div>
    <span className="sr-only" role="status" aria-live={rotating ? 'off' : 'polite'}>场景 {active + 1}，共 3 张：{scene.name}</span>
  </section>;
}
