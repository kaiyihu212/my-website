import type { Metadata } from 'next';
import './globals.css';
import { brand } from '@/lib/data';
export const metadata: Metadata = { title: {default: `${brand.name} · ${brand.subtitle}`, template: `%s · ${brand.name}`}, description: '以自然水晶为灵感，让每一次佩戴，都成为与自己温柔相处的时刻。探索水晶手链、个人心意与日常冥想。', icons:{icon:'/favicon.svg'} };
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="zh-CN"><body>{children}</body></html>}
