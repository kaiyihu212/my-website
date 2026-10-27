export type ElementName = '木' | '火' | '土' | '金' | '水';
export type BirthInput = { date: string; time: string; zone: string; overlap?: 'ask' | 'earlier' | 'later' };
export const elementStories: Record<ElementName, { color: string; tone: string; text: string; productIds: string[] }> = {
  木: { color: '#809078', tone: '青绿与青蓝', text: '以草木的色彩为灵感，在家中留一处自然的角落。', productIds: ['aquamarine'] },
  火: { color: '#aa786c', tone: '暖红、柔粉与紫', text: '用一点温暖的色彩，回应表达与热爱的心意。', productIds: ['rose', 'rose-sphere', 'amethyst'] },
  土: { color: '#b19a6d', tone: '蜜金与大地色', text: '从石材与大地的色泽中，寻找朴素、安定的美感。', productIds: ['citrine', 'smoky'] },
  金: { color: '#a8a396', tone: '白与清透色', text: '清透的纹理与克制的留白，为空间与衣着带来简洁的层次。', productIds: ['quartz', 'clear-sphere'] },
  水: { color: '#71878b', tone: '深色与海蓝', text: '以深浅流动的色泽为灵感，留一段安静观察的时光。', productIds: ['aquamarine', 'smoky'] },
};
const stems = '甲乙丙丁戊己庚辛壬癸';
const stemElements: ElementName[] = ['木','木','火','火','土','土','金','金','水','水'];

/** Resolve civil time using IANA timezone rules. Never guess a nonexistent or repeated DST time. */
export function resolveBirthInstant(input: BirthInput): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !/^\d{2}:\d{2}$/.test(input.time)) throw new Error('请填写完整的公历出生日期与时间。');
  const [year, month, day] = input.date.split('-').map(Number);
  const [hour, minute] = input.time.split(':').map(Number);
  if (year < 1901 || year > 2099 || month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59) throw new Error('日期须在 1901—2099 年之间，时间须为有效的 24 小时制时间。');
  const nominal = Date.UTC(year, month - 1, day, hour, minute);
  const check = new Date(nominal);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) throw new Error('出生日期无效，请检查月份和天数。');
  let format: Intl.DateTimeFormat;
  try { format = new Intl.DateTimeFormat('en-GB', { timeZone: input.zone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23' }); }
  catch { throw new Error('出生地时区无效，请选择正确的时区。'); }
  function wallTime(stamp: number) {
    const parts = Object.fromEntries(format.formatToParts(new Date(stamp)).map(part => [part.type, part.value]));
    return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  }
  const offsets = new Set<number>();
  for (let hours = -36; hours <= 36; hours += 6) {
    const stamp = nominal + hours * 3600000;
    offsets.add(wallTime(stamp) - stamp);
  }
  const candidates = [...offsets].map(offset => nominal - offset).filter(stamp => wallTime(stamp) === nominal).sort((a,b) => a-b);
  if (!candidates.length) throw new Error('该出生地时区的这个时刻因夏令时调整而不存在，请核对出生记录。');
  if (candidates.length > 1 && (!input.overlap || input.overlap === 'ask')) throw new Error('这个时刻因夏令时回拨而出现两次。请在“重复时刻”中选择较早或较晚的一次；不确定时请先核对出生记录。');
  const stamp = input.overlap === 'later' ? candidates[candidates.length - 1] : candidates[0];
  if (stamp > Date.now()) throw new Error('出生时间不能晚于当前时间。');
  return stamp;
}

export async function calculateBazi(input: BirthInput) {
  const stamp = resolveBirthInstant(input);
  const beijing = new Date(stamp + 8 * 3600000);
  const { Solar } = await import('lunar-typescript');
  const solar = Solar.fromYmdHms(beijing.getUTCFullYear(), beijing.getUTCMonth() + 1, beijing.getUTCDate(), beijing.getUTCHours(), beijing.getUTCMinutes(), 0);
  const chart = solar.getLunar().getEightChar();
  chart.setSect(2); // Midnight day change; month and year follow exact solar terms.
  return {
    pillars: [chart.getYear(), chart.getMonth(), chart.getDay(), chart.getTime()],
    fiveElements: [chart.getYearWuXing(), chart.getMonthWuXing(), chart.getDayWuXing(), chart.getTimeWuXing()],
    dayStem: chart.getDayGan(),
    dayElement: stemElements[stems.indexOf(chart.getDayGan())],
    beijing: solar.toYmdHms(),
  };
}
export type BaziResult = Awaited<ReturnType<typeof calculateBazi>>;
