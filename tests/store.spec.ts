import { test, expect } from '@playwright/test';
test('中文页面、导航和移动布局',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/','/shop','/intentions','/chakras','/journal','/story','/faq','/journal/care','/bazi']){
  await page.goto(route);await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 }
 await page.goto('/missing-page');await expect(page.getByText('换个方向，继续寻找。')).toBeVisible();expect(errors).toEqual([]);
});
test('商品筛选、搜索、排序与心意交互',async({page})=>{
 await page.goto('/shop');await expect(page.locator('.product-card')).toHaveCount(16);
 await page.getByLabel('心意筛选').selectOption('love');await expect(page.locator('.product-card')).toHaveCount(3);await expect(page.locator('.product-card').first()).toContainText('心悦');
 await page.getByLabel('心意筛选').selectOption('all');await page.getByLabel('搜索商品').fill('海蓝宝');await expect(page.locator('.product-card')).toHaveCount(2);
 await page.getByLabel('搜索商品').fill('');await page.getByLabel('排序').selectOption('desc');await expect(page.locator('.product-card').first()).toContainText('清屿');
 await page.getByRole('button',{name:'礼盒系列',exact:true}).click();await expect(page.getByText('礼盒系列，正在酝酿中。')).toBeVisible();
 await page.goto('/intentions');await page.getByRole('button',{name:'爱与关怀 Love'}).click();await expect(page.locator('.intention-result')).toContainText('心悦');
 await page.goto('/');await page.locator('.intention-tile').filter({hasText:'平静'}).click();await expect(page.locator('.product-card')).toHaveCount(3);await expect(page.locator('.product-card').first()).toContainText('静心');
});
test('购物袋增减、刷新保存、移除与未开放支付',async({page})=>{
 await page.goto('/product/rose');await page.getByRole('button',{name:'18 厘米',exact:true}).click();await page.getByRole('button',{name:'增加购买数量'}).click();await page.getByRole('button',{name:'加入购物袋',exact:true}).click();
 await page.goto('/bag');await expect(page.locator('.bag-item')).toContainText('18 厘米');await expect(page.locator('.total')).toContainText('392.00');
 await page.reload();await expect(page.locator('.total')).toContainText('392.00');await page.getByRole('button',{name:'减少心悦 · 粉晶手链数量'}).click();await expect(page.locator('.total')).toContainText('196.00');
 await page.getByRole('button',{name:'移除心悦 · 粉晶手链'}).click();await expect(page.getByText('购物袋还留着一份空白。')).toBeVisible();
 await page.goto('/product/amethyst');await page.getByRole('button',{name:'加入购物袋',exact:true}).click();await page.goto('/bag');await page.getByRole('link',{name:'查看选购清单'}).click();await expect(page.locator('.total')).toContainText('220.00');
 await expect(page.getByRole('button',{name:'在线支付暂未开放',exact:true})).toBeDisabled();await page.reload();await expect(page.locator('.total')).toContainText('220.00');
});
test('订阅未开放时不会收集邮箱',async({page})=>{
 await page.goto('/');await expect(page.getByLabel('你的电子邮箱',{exact:true})).toBeDisabled();await expect(page.getByRole('button',{name:'订阅暂未开放'})).toBeDisabled();
});
test('全站内部链接与产品图片有效',async({page,request})=>{
 await page.goto('/');
 const links = await page.locator('a[href^="/"]').evaluateAll(nodes=>[...new Set(nodes.map(n=>n.getAttribute('href')!))]);
 for(const href of links){const response=await request.get(href);expect(response.status(),href).toBe(200);}
 for(const id of ['rose','amethyst','smoky','citrine','aquamarine','quartz','clear-sphere','rose-sphere','amethyst-sphere','smoky-sphere','citrine-sphere','aquamarine-sphere','amethyst-cluster','sphere-stand','rose-tray','clear-tray']){expect((await request.get(`/product/${id}`)).status()).toBe(200);expect((await request.get('/photos/catalogue-editorial.webp')).status()).toBe(200);}
});
test('手机导航可以展开和收起',async({page,isMobile})=>{
 test.skip(!isMobile,'仅适用于手机导航');await page.goto('/');await page.getByRole('button',{name:'打开导航',exact:true}).click();await expect(page.getByRole('navigation',{name:'移动导航'})).toBeVisible();await page.getByRole('navigation',{name:'移动导航'}).getByRole('link',{name:'水晶商店'}).click();await expect(page).toHaveURL(/\/shop/);await expect(page.getByRole('navigation',{name:'移动导航'})).toHaveCount(0);
});
