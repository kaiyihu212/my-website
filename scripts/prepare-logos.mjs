import { readFileSync, writeFileSync } from 'node:fs';
const brand = JSON.parse(readFileSync(new URL('../lib/brand.json', import.meta.url), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
for (const file of ['primary.svg','primary-dark.svg','horizontal.svg','horizontal-dark.svg']) {
  const path = new URL(`../public/logos/${file}`, import.meta.url);
  let index = 0;
  const svg = readFileSync(path, 'utf8').replace(/(<text\b[^>]*>)[\s\S]*?(<\/text>)/g, (_,open,close) => open + escape(index++ === 0 ? brand.name : brand.subtitle) + close);
  writeFileSync(path, svg);
}
