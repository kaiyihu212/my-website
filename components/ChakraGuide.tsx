import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { chakras } from '@/lib/data';
const guides = [
 {location:'脊柱底部',color:'深红',intro:'像脚下的土地，象征安全感、归属与生活的根基。',question:'此刻，什么能让我感到踏实？'},
 {location:'下腹部',color:'橙',intro:'与感受和创造有关，提醒我们留意喜悦，也接纳变化。',question:'今天，有什么小事让我感到愉悦？'},
 {location:'上腹部',color:'金黄',intro:'象征行动与自主，把关注放在自己的选择和边界上。',question:'今天，我愿意为自己做一个什么选择？'},
 {location:'胸口中央',color:'绿',intro:'与关怀和联结相呼应，练习把善意也留给自己。',question:'我可以怎样更温柔地看待自己？'},
 {location:'喉部',color:'浅蓝',intro:'象征表达与倾听，给真实感受一个清楚、温和的出口。',question:'哪一句心里话，值得被好好说出？'},
 {location:'眉间',color:'靛蓝',intro:'与观察和觉察有关，留一点空间，看见自己的念头。',question:'如果慢一点，我会留意到什么？'},
 {location:'头顶',color:'紫或白',intro:'象征沉思与联结，让忙碌之外也有片刻安静。',question:'此刻，我愿意把注意力放在哪里？'},
];
export default function ChakraGuide() {
 return <div className="section chakra-guide-page"><div className="page-heading"><p className="eyebrow">传统文化，当代表达</p><h1>七脉轮探索</h1><p>从七种颜色、七个生活主题，开始一段与自己的温柔对话。</p></div>
 <div className="chakra-basics">{[['脉轮是什么？','源于南亚瑜伽传统的象征体系，常以沿身体中线的七个位置呈现。'],['颜色代表什么？','每种颜色联想一种生活主题。水晶的关联是文化与审美灵感，不是固定处方。'],['我该怎样开始？','先选一个与你此刻感受相近的主题，再试试一句自问或一分钟静坐。']].map(([title,text])=><div key={title}><h2>{title}</h2><p>{text}</p></div>)}</div>
 <p className="chakra-reading-hint">不必一次了解全部。点击一个主题，看看它与你的日常有什么联系。</p>
 <div className="chakra-guide-list">{chakras.map((chakra,index)=>{const guide=guides[index];return <details className="chakra-guide-item" key={chakra[0]} open={index===0}><summary><span className="chakra-guide-number">0{index+1}</span><span className="chakra-guide-dot" style={{background:chakra[2]}}/><span className="chakra-guide-name"><strong>{chakra[0]}</strong><small>{chakra[1]}</small></span><span className="chakra-guide-location">{guide.location} · {guide.color}</span><ChevronDown size={17}/></summary><div className="chakra-guide-body"><div><p className="chakra-guide-description">{guide.intro}</p><div className="chakra-question"><span>问问自己</span><p>{guide.question}</p></div></div><div className="chakra-practice"><span className="eyebrow">一分钟练习</span><p>{chakra[4]}</p><p className="chakra-crystal">水晶色彩联想：{chakra[3]}</p><Link className="text-link" href={`/product/${chakra[5]}`}>看看相关作品<ArrowUpRight size={15}/></Link></div></div></details>})}</div>
 <p className="chakra-culture-note">以上为传统文化与正念练习灵感，不代表经证实的身体结构或医疗功效。不同传统的颜色与矿物关联可能不同。</p></div>;
}
