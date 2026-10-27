'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { calculateBazi, elementStories, type BaziResult, type BirthInput, type ElementName } from '@/lib/bazi';
import { money, products } from '@/lib/data';
import ProductPhoto from './ProductPhoto';

const zones = [ ['Asia/Shanghai','中国大陆 · 北京时间'], ['Asia/Hong_Kong','中国香港'], ['Asia/Taipei','中国台湾'], ['Asia/Singapore','新加坡'], ['Australia/Melbourne','澳大利亚 · 墨尔本'], ['Australia/Sydney','澳大利亚 · 悉尼'], ['Australia/Perth','澳大利亚 · 珀斯'], ['Pacific/Auckland','新西兰 · 奥克兰'], ['Asia/Tokyo','日本 · 东京'], ['Europe/London','英国 · 伦敦'], ['Europe/Paris','法国 · 巴黎'], ['America/New_York','美国 · 纽约'], ['America/Los_Angeles','美国 · 洛杉矶'], ['Etc/UTC','协调世界时 · UTC'] ];
export default function BaziExperience() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [result, setResult] = useState<BaziResult | null>(null);
  const [element, setElement] = useState<ElementName>('金');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const story = elementStories[element];
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(''); setBusy(true); setResult(null);
    try {
      const chart = await calculateBazi({ date: String(form.get('date')), time: String(form.get('time')), zone: String(form.get('zone')), overlap: String(form.get('overlap')) as BirthInput['overlap'] });
      setResult(chart); setElement(chart.dayElement);
    } catch (cause) { setError(cause instanceof Error ? cause.message : '暂时无法排盘，请核对信息后重试。'); }
    finally { setBusy(false); }
  }
  return <div className="section bazi-page">
    <div className="page-heading bazi-intro"><p className="eyebrow">传统文化 · 个人心意</p><h1>从八字，遇见一种色彩。</h1><p>用出生日期与时间了解四柱，以五行的传统色彩，开启一段属于自己的水晶探索。</p></div>
    <div className="bazi-layout"><div><form className="birth-form" onSubmit={submit} onChange={() => { setResult(null); setError(''); }}>
      <fieldset disabled={!hydrated || busy}><h2>你的出生时刻</h2><p>请输入出生地当时的公历日期与钟表时间。</p>
      <div className="birth-fields"><label>公历出生日期<input type="date" name="date" min="1901-01-01" max="2099-12-31" required/></label><label>出生时间<input type="time" name="time" required/></label></div>
      <label>出生地时区<select name="zone" defaultValue="Asia/Shanghai">{zones.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>重复时刻的处理<select name="overlap" defaultValue="ask"><option value="ask">自动识别，遇到重复时刻时提醒</option><option value="earlier">夏令时回拨中的第一次（较早）</option><option value="later">夏令时回拨中的第二次（较晚）</option></select></label>
      <p className="small muted">若出生地不在列表，请先换算为北京时间，再选择“中国大陆”。不要填写农历日期；不确定出生时间时，不建议猜测。</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button" type="submit" disabled={busy}>{busy ? '正在本地排盘…' : '查看八字与水晶灵感'}<ArrowRight size={16}/></button>
      <p className="privacy-note">出生信息仅在当前浏览器计算，不保存、不上传。刷新页面即清除。</p>
    </fieldset></form></div><aside className="bazi-method"><p className="eyebrow">先了解，我们如何解读</p><h2>以文化为灵感，<br/>让选择回到自己。</h2><p>四柱按出生时刻统一换算至北京时间（UTC+8）后计算：以立春换年、节气换月、午夜零点换日。不作出生地经度或真太阳时校正。</p><p>海外出生者请先选择当地时区，系统会按时区规则换算；临近节气、换日或时辰边界时，不同排盘流派与校正规则可能得到不同结果。</p><p>这里以日干所属五行的传统色彩联想展示商品，不计算喜用神，也不以五行数量判断“缺什么、补什么”。这是一种文化与审美探索，不是命运判断、功效承诺或购买必要性的判断。</p><p className="small muted">排盘引擎：lunar-typescript（MIT）。历史时区规则以浏览器 IANA 时区数据为准。</p></aside></div>
    {result && <section className="bazi-result" aria-label="八字排盘结果" aria-live="polite"><div className="section-heading"><div><p className="eyebrow">你的四柱 · 文化参考</p><h2>日干{result.dayStem}，五行属{result.dayElement}。</h2><p className="muted">排盘使用的北京时间：{result.beijing}</p></div></div><div className="pillar-grid">{result.pillars.map((pillar,index) => <div key={index}><span>{['年柱','月柱','日柱','时柱'][index]}</span><strong>{pillar}</strong><small>{result.fiveElements[index]}</small></div>)}</div><div className="element-story"><p className="eyebrow">五行色彩灵感 · 可自由切换</p><div className="element-tabs">{(Object.keys(elementStories) as ElementName[]).map(name => <button key={name} type="button" aria-pressed={element === name} onClick={() => setElement(name)}><span style={{ background: elementStories[name].color }}/>{name}</button>)}</div><h2>{story.tone}</h2><p>{story.text}</p><p className="small muted">下面的作品根据这一色彩主题关联，并不表示它们是你命理上的“喜用”水晶。</p></div><div className="product-grid">{products.filter(product => story.productIds.includes(product.id)).map(product => <article className="product-card" key={product.id}><Link className="product-image" href={`/product/${product.id}`}><ProductPhoto product={product}/></Link><div className="product-info"><Link href={`/product/${product.id}`}><h3>{product.name}</h3></Link><span>{money(product.price)}</span></div></article>)}</div></section>}
  </div>;
}
