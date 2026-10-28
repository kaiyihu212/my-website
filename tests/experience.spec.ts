import { test, expect } from '@playwright/test';
import { calculateBazi, resolveBirthInstant } from '../lib/bazi';

test('四柱历法、时区、换日及夏令时边界', async () => {
  // Documented reference date from lunar-typescript README; 甲子日 reference: 2000-01-07.
  const reference = await calculateBazi({ date:'1986-05-29',time:'00:00',zone:'Etc/GMT-8' });
  expect(reference.pillars).toEqual(['丙寅','癸巳','癸酉','壬子']);
  expect(reference.dayElement).toBe('水');
  // China observed DST on this date: local 01:00 equals fixed UTC+8 midnight.
  expect((await calculateBazi({date:'1986-05-29',time:'01:00',zone:'Asia/Shanghai'})).pillars).toEqual(reference.pillars);
  expect((await calculateBazi({date:'2000-01-07',time:'00:00',zone:'Asia/Shanghai'})).pillars[2]).toBe('甲子');
  const before = await calculateBazi({date:'2024-02-04',time:'16:00',zone:'Asia/Shanghai'});
  const after = await calculateBazi({date:'2024-02-04',time:'17:00',zone:'Asia/Shanghai'});
  expect(before.pillars[0]).toBe('癸卯'); expect(after.pillars[0]).toBe('甲辰');
  expect(before.pillars[1]).toBe('乙丑'); expect(after.pillars[1]).toBe('丙寅');
  const same = await calculateBazi({date:'2024-02-04',time:'19:00',zone:'Australia/Melbourne'});
  expect(same.pillars).toEqual(before.pillars);
  const late = await calculateBazi({date:'2000-01-07',time:'23:30',zone:'Asia/Shanghai'});
  const midnight = await calculateBazi({date:'2000-01-08',time:'00:00',zone:'Asia/Shanghai'});
  expect(late.pillars[2]).toBe('甲子'); expect(midnight.pillars[2]).toBe('乙丑');
  expect(() => resolveBirthInstant({date:'2024-10-06',time:'02:30',zone:'Australia/Melbourne'})).toThrow('不存在');
  expect(() => resolveBirthInstant({date:'2024-04-07',time:'02:30',zone:'Australia/Melbourne'})).toThrow('出现两次');
  const first = resolveBirthInstant({date:'2024-04-07',time:'02:30',zone:'Australia/Melbourne',overlap:'earlier'});
  const second = resolveBirthInstant({date:'2024-04-07',time:'02:30',zone:'Australia/Melbourne',overlap:'later'});
  expect(second - first).toBe(3600000);
  expect(() => resolveBirthInstant({date:'2024-02-30',time:'12:00',zone:'Asia/Shanghai'})).toThrow('日期无效');
});

test('首页摄影轮播、自动播放与暂停', async ({page,isMobile}) => {
  await page.clock.install();
  await page.goto('/');
  const hero = page.getByRole('region',{name:'品牌生活场景'});
  await expect(hero).toHaveAttribute('data-scene','jewelry');
  await expect(hero.locator('.hero-photograph img')).toHaveCount(3);
  await page.clock.fastForward(7500);
  await expect(hero).toHaveAttribute('data-scene','home');
  await hero.getByRole('button',{name:'暂停轮播'}).click();
  await page.clock.fastForward(15000);
  await expect(hero).toHaveAttribute('data-scene','home');
  await hero.getByRole('button',{name:'切换到静坐时光'}).click();
  await expect(hero).toHaveAttribute('data-scene','meditation');
  await hero.getByRole('button',{name:'下一张场景'}).click();
  await expect(hero).toHaveAttribute('data-scene','jewelry');
  await hero.getByRole('button',{name:'上一张场景'}).click();
  await expect(hero).toHaveAttribute('data-scene','meditation');
  await hero.getByRole('button',{name:'切换到静坐时光'}).focus();
  await page.keyboard.press('ArrowRight');await expect(hero).toHaveAttribute('data-scene','jewelry');
  if(isMobile){
    const photograph = hero.locator('.photographic-hero');
    await photograph.evaluate(node=>{
      const start = new Touch({identifier:1,target:node,clientX:300,clientY:200});
      const end = new Touch({identifier:1,target:node,clientX:80,clientY:210});
      node.dispatchEvent(new TouchEvent('touchstart',{changedTouches:[start],bubbles:true}));
      node.dispatchEvent(new TouchEvent('touchend',{changedTouches:[end],bubbles:true}));
    });
    await expect(hero).toHaveAttribute('data-scene','home');
    await photograph.evaluate(node=>{
      const start = new Touch({identifier:2,target:node,clientX:200,clientY:200});
      const end = new Touch({identifier:2,target:node,clientX:190,clientY:350});
      node.dispatchEvent(new TouchEvent('touchstart',{changedTouches:[start],bubbles:true}));
      node.dispatchEvent(new TouchEvent('touchend',{changedTouches:[end],bubbles:true}));
    });
    await expect(hero).toHaveAttribute('data-scene','home');
  }
});

test('减少动态效果时不自动轮播，内容仍可阅读', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.clock.install();await page.goto('/');
  const hero = page.getByRole('region',{name:'品牌生活场景'});
  await expect(hero.getByRole('button',{name:'播放轮播'})).toBeDisabled();
  await page.clock.fastForward(20000);
  await expect(hero).toHaveAttribute('data-scene','jewelry');
  await hero.getByRole('button',{name:'切换到自然居所'}).click();
  await expect(hero).toHaveAttribute('data-scene','home');
  const heading = page.getByRole('heading',{name:'随身，也在身边。'});
  await heading.scrollIntoViewIfNeeded();await expect(heading).toBeVisible();
  expect(await heading.evaluate(node => getComputedStyle(node.closest('.reveal-pending')||node).opacity)).toBe('1');
});

test('滚动后文字与图片上移浮现', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
  const target = page.locator('.collection-story').first();
  await expect(target).toHaveClass(/reveal-pending/);
  await expect(target).not.toHaveClass(/reveal-visible/);
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveClass(/reveal-visible/);
  const image = target.locator('img');await expect(image).toBeVisible();
  expect(await image.evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

test('水晶球与摆件筛选、规格与购物袋', async ({page}) => {
  await page.goto('/shop?category=sphere');
  await expect(page.locator('.product-card')).toHaveCount(6);
  await page.getByRole('link',{name:'留白 · 白水晶球',exact:true}).click();
  await expect(page).toHaveURL(/product\/clear-sphere/);
  await page.getByRole('button',{name:'直径 55 毫米',exact:true}).click();
  await page.getByRole('button',{name:'加入购物袋',exact:true}).click();
  await page.goto('/bag');await expect(page.locator('.bag-item')).toContainText('直径 55 毫米');await expect(page.locator('.total')).toContainText('356.00');
  await page.goto('/shop?category=ornament');await expect(page.locator('.product-card')).toHaveCount(3);
  await expect(page.locator('.product-card').first()).toContainText('山间');
});

test('出生时间排盘、色彩推荐与隐私', async ({page}) => {
  const leaked:string[]=[];
  page.on('request',request=>{if(request.method()==='POST'||request.url().includes('1986-05-29'))leaked.push(request.url())});
  await page.goto('/bazi');
  await page.getByLabel('公历出生日期').fill('1986-05-29');
  await page.getByLabel('出生时间',{exact:true}).fill('01:00');
  await page.getByRole('button',{name:'查看八字与水晶灵感'}).click();
  await expect(page.getByRole('region',{name:'八字排盘结果'})).toContainText('日干癸，五行属水。');
  await expect(page.locator('.pillar-grid')).toContainText('癸酉');
  await expect(page.locator('.bazi-result .product-card')).toHaveCount(2);
  await page.getByRole('button',{name:'金',exact:true}).click();
  await expect(page.locator('.bazi-result')).toContainText('留白 · 白水晶球');
  expect(leaked).toEqual([]);
  expect(await page.evaluate(()=>Object.keys(localStorage).some(key=>/birth|bazi|1986/.test(key)))).toBe(false);
  await page.reload();await expect(page.getByLabel('公历出生日期')).toHaveValue('');await expect(page.locator('.bazi-result')).toHaveCount(0);
});

test('夏令时重复出生时间需要主动选择', async ({page}) => {
  await page.goto('/bazi');await page.getByLabel('公历出生日期').fill('2024-04-07');await page.getByLabel('出生时间',{exact:true}).fill('02:30');await page.getByLabel('出生地时区').selectOption('Australia/Melbourne');
  await page.getByRole('button',{name:'查看八字与水晶灵感'}).click();await expect(page.locator('.form-error')).toContainText('出现两次');
  await page.getByLabel('重复时刻的处理').selectOption('earlier');await page.getByRole('button',{name:'查看八字与水晶灵感'}).click();await expect(page.locator('.bazi-result')).toBeVisible();
});
