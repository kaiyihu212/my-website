import { notFound } from 'next/navigation';
import Store from '@/components/Store';
import { products, articles } from '@/lib/data';
const titles:Record<string,string>={'':'把心之所向，戴在身边','shop':'水晶商店','intentions':'寻找专属心意','chakras':'七脉轮探索','bazi':'八字与水晶','journal':'冥想手记','story':'品牌故事','bag':'购物袋','checkout':'模拟结账','faq':'常见问题'};
export async function generateMetadata({params}:{params:Promise<{slug?:string[]}>}) {const {slug=[]}=await params; return {title:slug[0]==='product'?products.find(p=>p.id===slug[1])?.name:slug[0]==='journal'&&slug[1]?articles.find(a=>a.id===slug[1])?.title:titles[slug[0]||'']};}
export default async function Page({params}:{params:Promise<{slug?:string[]}>}) {const {slug=[]}=await params;const path=slug.join('/');if(!(path in titles)&&!(slug.length===2&&slug[0]==='product'&&products.some(p=>p.id===slug[1]))&&!(slug.length===2&&slug[0]==='journal'&&articles.some(a=>a.id===slug[1]))) notFound();return <Store path={path}/>;}
export function generateStaticParams() {return [...Object.keys(titles).map(key=>({slug:key?key.split('/'):[]})),...products.map(p=>({slug:['product',p.id]})),...articles.map(a=>({slug:['journal',a.id]}))];}

export const dynamicParams = false;
