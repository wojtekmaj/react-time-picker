import { getFormatter } from './dateFormatter';

/**
 * Calls a function, if it's defined, with specified arguments
 * @param {Function} fn
 * @param {Object} args
 */
export const callIfDefined = (fn, ...args) => {
  if (fn && typeof fn === 'function') {
    fn(...args);
  }
};

const nines = ['9', '٩'];
const ninesRegExp = new RegExp(`[${nines.join('')}]`);
const amPmFormatter = getFormatter({ hour: 'numeric' });

export function getAmPmLabels(locale) {
  const amString = amPmFormatter(locale, new Date(2017, 0, 1, 9));
  const pmString = amPmFormatter(locale, new Date(2017, 0, 1, 21));

  const [am1, am2] = amString.split(ninesRegExp);
  const [pm1, pm2] = pmString.split(ninesRegExp);

  if (pm2 !== undefined) {
    // If pm2 is undefined, nine was not found in pmString - this locale is not using 12-hour time
    if (am1 !== pm1) {
      return [am1, pm1].map(el => el.trim());
    }

    if (am2 !== pm2) {
      return [am2, pm2].map(el => el.trim());
    }
  }

  // Fallback
  return ['AM', 'PM'];
}

function isValidNumber(num) {
  return num !== null && num !== false && !Number.isNaN(Number(num));
}

export function safeMin(...args) {
  return Math.min(...args.filter(isValidNumber));
}

export function safeMax(...args) {
  return Math.max(...args.filter(isValidNumber));
}
