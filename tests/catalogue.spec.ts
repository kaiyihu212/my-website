import { test, expect } from '@playwright/test';
import { priceCart } from '../lib/cart';
import { products } from '../lib/data';
const item=(id:string,quantity=1)=>({id,quantity,size:products.find(product=>product.id===id)!.sizes[0]});

test('支架赠礼金额、门槛、单独选购与重复赠礼规则',()=>{
 expect(priceCart([item('sphere-stand')])).toMatchObject({total:96,discount:0,giftQuantity:0});
 expect(priceCart([item('clear-sphere')])).toMatchObject({total:356,eligible:false,giftQuantity:0});
 expect(priceCart([item('clear-sphere'),item('rose-sphere')])).toMatchObject({total:672,eligible:true,giftQuantity:1,discount:0});
 expect(priceCart([item('clear-sphere',2)])).toMatchObject({total:712,giftQuantity:1});
 expect(priceCart([item('clear-sphere',4)])).toMatchObject({total:1424,giftQuantity:1});
 expect(priceCart([item('clear-sphere'),item('rose-sphere'),item('sphere-stand')])).toMatchObject({subtotal:768,total:672,discount:96,giftQuantity:0});
 expect(priceCart([item('clear-sphere',2),item('sphere-stand',2)])).toMatchObject({subtotal:904,total:808,discount:96,giftQuantity:0});
 expect(priceCart([item('clear-sphere'),item('sphere-stand')])).toMatchObject({total:452,discount:0,giftQuantity:0});
 expect(priceCart([item('rose'),item('rose-tray')])).toMatchObject({sphereQuantity:0,eligible:false,giftQuantity:0});
 expect(priceCart([{...item('clear-sphere'),quantity:-2},{...item('rose-sphere'),quantity:100},{...item('clear-sphere'),size:'不存在'}])).toMatchObject({total:0,eligible:false});
});

test('混选两颗球自动赠支架，刷新后保留，减少数量后取消赠礼',async({page})=>{
 for(const id of ['clear-sphere','rose-sphere']){await page.goto(`/product/${id}`);await page.getByRole('button',{name:'加入购物袋',exact:true}).click();}
 await page.goto('/bag');await expect(page.getByRole('article',{name:'木质支架赠礼'})).toHaveCount(1);await expect(page.locator('.total')).toContainText('672.00');
 await page.reload();await expect(page.getByRole('article',{name:'木质支架赠礼'})).toHaveCount(1);
 await page.getByRole('button',{name:'移除柔光 · 粉晶球'}).click();await expect(page.getByRole('article',{name:'木质支架赠礼'})).toHaveCount(0);await expect(page.locator('.bag-offer-status')).toContainText('再选 1 颗');await expect(page.locator('.total')).toContainText('356.00');
});

test('已有付费支架时自动减免，取消资格后恢复单买价格',async({page})=>{
 for(const id of ['sphere-stand','clear-sphere']){await page.goto(`/product/${id}`);if(id==='clear-sphere')await page.getByRole('button',{name:'增加购买数量'}).click();await page.getByRole('button',{name:'加入购物袋',exact:true}).click();}
 await page.goto('/bag');await expect(page.locator('.stand-discount')).toContainText('96.00');await expect(page.getByRole('article',{name:'木质支架赠礼'})).toHaveCount(0);await expect(page.locator('.total')).toContainText('712.00');
 await page.getByRole('button',{name:'减少留白 · 白水晶球数量'}).click();await expect(page.locator('.stand-discount')).toHaveCount(0);await expect(page.locator('.total')).toContainText('452.00');
});

test('六色水晶球、支架与首饰盘可浏览',async({page})=>{
 await page.goto('/shop?category=sphere');await expect(page.locator('.product-card')).toHaveCount(6);
 for(const text of ['白水晶球','粉晶球','紫水晶球','烟晶球','黄水晶球','海蓝宝水晶球'])await expect(page.locator('.product-grid')).toContainText(text);
 await page.getByRole('button',{name:'水晶支架',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(1);await expect(page.locator('.product-card')).toContainText('栖石');
 await page.getByRole('button',{name:'水晶摆件',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(3);await expect(page.locator('.product-grid')).toContainText('粉晶首饰盘');await expect(page.locator('.product-grid')).toContainText('白水晶首饰盘');
});

test('脉轮新手说明与折叠内容可阅读',async({page})=>{
 await page.goto('/chakras');await expect(page.getByRole('heading',{name:'脉轮是什么？'})).toBeVisible();await expect(page.locator('.chakra-guide-item')).toHaveCount(7);
 const root=page.locator('.chakra-guide-item').filter({hasText:'海底轮'});await expect(root.locator('.chakra-guide-description')).toBeVisible();await expect(root).toContainText('脊柱底部');
 const heart=page.locator('.chakra-guide-item').filter({has:page.getByText('心轮',{exact:true})});await heart.locator('summary').click();await expect(heart.locator('.chakra-guide-description')).toBeVisible();await expect(heart).toContainText('问问自己');await expect(heart).toContainText('一分钟练习');
});

test('商业展示页面不出现开发阶段文案，支付入口仍诚实关闭',async({page})=>{
 for(const route of ['/','/shop','/story','/journal','/product/clear-sphere','/product/sphere-stand','/faq','/chakras']){
  await page.goto(route);await expect(page.locator('body')).not.toContainText(/品牌提案|品牌体验演示|非真实交易网站|演示数据|演示作品|AI 生成/);
 }
 await page.goto('/product/rose');await page.getByRole('button',{name:'加入购物袋',exact:true}).click();await page.goto('/checkout');await expect(page.getByRole('button',{name:'在线支付暂未开放',exact:true})).toBeDisabled();await expect(page.locator('.checkout-availability')).toContainText('不会创建订单');
});
