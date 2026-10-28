import config from './brand.json';
export const brand = config;
const currencyFormatter = new Intl.NumberFormat(brand.locale, { style:'currency', currency:brand.currency, currencyDisplay:'narrowSymbol', minimumFractionDigits:2, maximumFractionDigits:2 });
export const money = (value:number) => currencyFormatter.format(value);
export const intentions = [
 {id:'calm',name:'平静',en:'Calm',color:'#b6a4c0',text:'把片刻安静留给自己，让思绪慢慢沉淀。',ritual:'轻闭双眼，缓慢呼吸五次。无需改变什么，只是留意此刻。'},
 {id:'love',name:'爱与关怀',en:'Love',color:'#d8b5ae',text:'从温柔看待自己开始，练习关怀与联结。',ritual:'写下一件今天感谢自己的小事，把这份善意留在心间。'},
 {id:'clarity',name:'澄明',en:'Clarity',color:'#d6d4c9',text:'为纷繁的日常留白，听见心中真正重要的事。',ritual:'暂时放下手机，写下今天最想专注的一件事。'},
 {id:'grounding',name:'安定',en:'Grounding',color:'#a28b75',text:'回到脚下与呼吸，在日常里找到自己的节奏。',ritual:'双脚落地，感受身体与地面的接触，留意身边三种声音。'},
 {id:'confidence',name:'自信',en:'Confidence',color:'#d8bb7b',text:'相信细小的行动，也值得被认真看见。',ritual:'对自己说一句鼓励的话，再迈出一个可以完成的小步骤。'},
 {id:'balance',name:'平衡',en:'Balance',color:'#aab7a3',text:'在付出与休息之间，为自己找到舒适的位置。',ritual:'伸展双肩，问问自己：此刻，我需要多一点什么？'}
];
export type Product = {
 id:string; name:string; price:number; material:string; intention:string; chakra:string; color:string; description:string;
 image:string; photoIndex:number; sizes:string[]; sizeLabel:string; sizeHelp:string; maxQuantity:number; category:'bracelet'|'sphere'|'ornament'|'accessory';
};
const bracelets: Product[] = [
 {id:'rose',name:'心悦 · 粉晶手链',price:196,material:'粉晶',intention:'love',chakra:'心轮',color:'#dcb7b4',description:'柔和的浅粉色，如同清晨落在肌肤上的光。为日常添一份温柔，也提醒自己值得被善待。'},
 {id:'amethyst',name:'静心 · 紫水晶手链',price:220,material:'紫水晶',intention:'calm',chakra:'顶轮',color:'#a79ab7',description:'轻盈的紫色层次，在举手之间留住安静。把片刻停顿，变成属于自己的小小仪式。'},
 {id:'smoky',name:'安定 · 烟晶手链',price:196,material:'烟晶',intention:'grounding',chakra:'海底轮',color:'#8d7a66',description:'通透的烟茶色，与自然材质自在相配。一件低调的日常饰品，一份回到当下的提醒。'},
 {id:'citrine',name:'微光 · 黄水晶手链',price:236,material:'黄水晶',intention:'confidence',chakra:'太阳神经丛轮',color:'#d7b76e',description:'温润的蜜金色，为简洁穿搭添一束微光。以细微的明亮，陪伴每一次勇敢的开始。'},
 {id:'aquamarine',name:'清语 · 海蓝宝手链',price:260,material:'海蓝宝',intention:'balance',chakra:'喉轮',color:'#a8c5c8',description:'如浅海般清透的蓝，带来视觉上的清新与舒展。留意自己的声音，也为倾听留出空间。'},
 {id:'quartz',name:'澄明 · 白水晶手链',price:196,material:'白水晶',intention:'clarity',chakra:'眉心轮',color:'#dddcd3',description:'清透而克制，在自然光里显出细腻纹理。用简单的佩戴，提醒自己把注意力放回重要的事。'}
].map((p,photoIndex):Product=>({...p,image:'/photos/catalogue-editorial.webp',photoIndex,sizes:['14 厘米','16 厘米','18 厘米'],sizeLabel:'选择手围',sizeHelp:'测量手腕一周，按舒适余量选择',maxQuantity:12,category:'bracelet'}));
export const categoryNames: Record<string,string> = {bracelet:'水晶手链',sphere:'水晶球',ornament:'水晶摆件',accessory:'水晶支架'};
const sphereCollection = [
 {id:'clear-sphere',name:'留白 · 白水晶球',price:356,material:'白水晶',intention:'clarity',chakra:'眉心轮',color:'#dddcd3',description:'清透的球体与细微纹理，让目光在光线间停留。适合安放在书架、玄关或日常静坐的角落。'},
 {id:'rose-sphere',name:'柔光 · 粉晶球',price:316,material:'粉晶',intention:'love',chakra:'心轮',color:'#dcb7b4',description:'柔和的浅粉色，与木质和亚麻自在相配。把喜欢的小物安放在身边，让家多一分温柔。'},
 {id:'amethyst-sphere',name:'暮紫 · 紫水晶球',price:380,material:'紫水晶',intention:'calm',chakra:'顶轮',color:'#a79ab7',description:'深浅相间的紫色，在柔光里显出层次。为书桌或床头留一个安静的视觉重心。'},
 {id:'smoky-sphere',name:'茶境 · 烟晶球',price:356,material:'烟晶',intention:'grounding',chakra:'海底轮',color:'#8d7a66',description:'烟茶色的通透层次，低调融入大地色的空间。在熟悉的一角，慢慢找回自己的节奏。'},
 {id:'citrine-sphere',name:'日暖 · 黄水晶球',price:396,material:'黄水晶',intention:'confidence',chakra:'太阳神经丛轮',color:'#d7b76e',description:'淡蜜金色留住温暖的视觉印象。一点克制的明亮，适合搭配原木、石材与浅色织物。'},
 {id:'aquamarine-sphere',name:'浅海 · 海蓝宝水晶球',price:436,material:'海蓝宝',intention:'balance',chakra:'喉轮',color:'#a8c5c8',description:'浅海般的青蓝色，让空间多一处清新的留白。适合安放在阅读、书写与静坐的日常场景。'}
].map((p,photoIndex):Product=>({...p,image:'/photos/spheres-accessories.webp',photoIndex,category:'sphere',sizes:['直径 45 毫米','直径 55 毫米'],sizeLabel:'选择直径',sizeHelp:'水晶球单独选购，支架另售；尺寸以商品确认信息为准',maxQuantity:12}));
export const products: Product[] = [...bracelets,...sphereCollection,
 {id:'amethyst-cluster',name:'山间 · 紫晶簇摆件',price:396,material:'紫水晶',intention:'calm',chakra:'顶轮',color:'#a79ab7',description:'簇生的晶体与深浅紫色，展现自然形态的灵感。适合书桌、床头或静坐角落。',image:'/photos/catalogue-editorial.webp',photoIndex:8,category:'ornament',sizes:['小号 · 约 6–8 厘米','中号 · 约 9–11 厘米'],sizeLabel:'选择规格',sizeHelp:'每件形态与大小以商品确认信息为准',maxQuantity:12},
 {id:'sphere-stand',name:'栖石 · 木质水晶支架',price:96,material:'木质 · 胡桃木色',intention:'',chakra:'',color:'#73604d',description:'低矮的环形轮廓，配以沉静的胡桃木色。让水晶球安稳陈列，也让空间保持简洁。可单独选购，任选两颗水晶球可获赠一只。',image:'/photos/spheres-accessories.webp',photoIndex:6,category:'accessory',sizes:['环形款 · 适配 45–55 毫米水晶球'],sizeLabel:'选择规格',sizeHelp:'仅含支架，不含水晶球；适配尺寸以确认信息为准',maxQuantity:12},
 {id:'rose-tray',name:'拾光 · 粉晶首饰盘',price:476,material:'粉晶',intention:'love',chakra:'心轮',color:'#dcb7b4',description:'柔粉色的浅盘，留住摘下饰品的片刻。戒指、耳饰与手链，在日常里也有一处妥帖的安放。',image:'/photos/spheres-accessories.webp',photoIndex:7,category:'ornament',sizes:['椭圆浅盘 · 约 10 厘米'],sizeLabel:'选择规格',sizeHelp:'仅含首饰盘，搭配饰品不包含在内；规格以确认信息为准',maxQuantity:12},
 {id:'clear-tray',name:'清屿 · 白水晶首饰盘',price:516,material:'白水晶',intention:'clarity',chakra:'眉心轮',color:'#dddcd3',description:'清透与云雾般的层次，为细小的心爱之物留白。安放在梳妆台或床头，陪伴每一次日常收纳。',image:'/photos/spheres-accessories.webp',photoIndex:8,category:'ornament',sizes:['圆角浅盘 · 约 10 厘米'],sizeLabel:'选择规格',sizeHelp:'仅含首饰盘，搭配饰品不包含在内；规格以确认信息为准',maxQuantity:12}
];

export const chakras = [
 ['海底轮','安定与归属','#a96b61','烟晶','感受双脚与地面的接触。','smoky'],
 ['脐轮','感受与创造','#ca9977','黄水晶','留意一个让你感到愉悦的细节。','citrine'],
 ['太阳神经丛轮','意志与自信','#c7ac6e','黄水晶','为自己今天的一次尝试留一点肯定。','citrine'],
 ['心轮','关怀与联结','#9ba98d','粉晶','将一份善意先送给自己。','rose'],
 ['喉轮','表达与倾听','#94b5bf','海蓝宝','用一句简单的话说出真实感受。','aquamarine'],
 ['眉心轮','觉察与专注','#9295b2','白水晶','留意念头经过，无需立刻回应。','quartz'],
 ['顶轮','联结与沉思','#b0a0bc','紫水晶','留一分钟安静，感受当下。','amethyst']
];
export const articles = [
 {id:'intention',title:'如何为新的一天设定心意',category:'日常仪式',intro:'在打开消息之前，先把这一刻留给自己。',paragraphs:['心意不必是一份需要完成的清单。它可以只是今天想带着的一种态度：耐心、专注，或对自己宽容一点。','给早晨留三分钟。坐在舒服的位置，感受几次自然呼吸，问自己：今天，我希望如何与自己相处？','把答案写成一句简单的话。佩戴饰品时，轻轻想起它。一天中忘记了也没有关系，每一次想起，都是新的开始。']},
 {id:'moon',title:'月相与日常自我觉察仪式',category:'月亮灵感',intro:'借月亮的圆缺，观察生活自己的节奏。',paragraphs:['月相是一种自然的时间标记。这里的练习是生活灵感，不意味着月亮会决定我们的情绪或境遇。','新月时，可以写下一件想开始的事；满月时，回看最近的生活，记下值得感谢的片刻。','不必严格遵循日历。重要的是找到一个愿意停下来、与自己对话的时刻。']},
 {id:'choose',title:'如何选择适合自己的水晶饰品',category:'佩戴灵感',intro:'从喜欢的颜色开始，让选择回归自己。',paragraphs:['先看看哪一种颜色让你愿意多停留一会儿。比起繁复的规则，自己的审美与佩戴舒适度更值得重视。','考虑日常衣着、手腕尺寸与材质偏好。如果喜欢象征故事，也可以选择与当下心意呼应的款式。','水晶是自然材质，其象征意义属于文化与个人表达，不是医疗建议，也不代表可验证的功效。']},
 {id:'meditation',title:'五分钟正念冥想练习',category:'冥想练习',intro:'不追求清空思绪，只练习温柔地回来。',paragraphs:['找一个安全、安静的位置坐好。让双脚自然落地，肩膀放松，眼睛可以闭上，也可以轻轻垂下。','第一分钟，留意身体的支撑；接下来三分钟，关注呼吸自然的进出。走神时，只需轻轻把注意力带回来。','最后一分钟，感受周围的声音，再慢慢睁开眼睛。如果练习让你不舒服，可以随时停止。']},
 {id:'care',title:'水晶饰品的日常保养',category:'饰品护理',intro:'以简单的照顾，留住日常佩戴的美。',paragraphs:['佩戴后用柔软干布轻拭，并单独收纳，减少相互碰撞与摩擦。','洗澡、游泳、运动和使用香水或清洁剂前，建议取下饰品。避免长时间暴晒、高温和浸水。','不同矿物对光、水与化学品的耐受程度不同。正式购买前，请以实际商品的材质说明和护理指引为准。']}
];
