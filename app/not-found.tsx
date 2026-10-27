import Link from 'next/link';
export default function NotFound(){return <main className="section empty-state"><p className="eyebrow">404 · 暂未找到这一页</p><h1>换个方向，继续寻找。</h1><p>这一页可能已被移动，也可能还在酝酿。</p><Link className="button" href="/">回到首页</Link></main>}
