import { getFormatter } from './dateFormatter.js';

const nines = ['9', '٩'];
const ninesRegExp = new RegExp(`[${nines.join('')}]`);
const amPmFormatter = getFormatter({ hour: 'numeric' });

export function getAmPmLabels(locale: string | undefined): [string, string] {
  const amString = amPmFormatter(locale, new Date(2017, 0, 1, 9));
  const pmString = amPmFormatter(locale, new Date(2017, 0, 1, 21));

  const [am1, am2] = amString.split(ninesRegExp) as [string, string];
  const [pm1, pm2] = pmString.split(ninesRegExp) as [string, string];

  if (pm2 !== undefined) {
    // If pm2 is undefined, nine was not found in pmString - this locale is not using 12-hour time
    if (am1 !== pm1) {
      return [am1, pm1].map((el) => el.trim()) as [string, string];
    }

    if (am2 !== pm2) {
      return [am2, pm2].map((el) => el.trim()) as [string, string];
    }
  }

  // Fallback
  return ['AM', 'PM'];
}

function isValidNumber(num: unknown): num is number {
  return num !== null && num !== false && !Number.isNaN(Number(num));
}

export function safeMin(...args: unknown[]) {
  return Math.min(...args.filter(isValidNumber));
}

export function safeMax(...args: unknown[]) {
  return Math.max(...args.filter(isValidNumber));
}
