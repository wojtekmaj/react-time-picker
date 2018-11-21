import { getFormatter } from './dateFormatter';

const isValidNumber = a => typeof a === 'number' && !isNaN(a);

export const min = (...args) => Math.min(...args.filter(isValidNumber));
export const max = (...args) => Math.max(...args.filter(isValidNumber));

export const updateInputWidth = (element) => {
  const span = document.createElement('span');
  span.innerHTML = element.value || element.placeholder;

  const container = element.parentElement;

  container.appendChild(span);

  const { width } = span.getBoundingClientRect();
  element.style.width = `${Math.ceil(width)}px`;

  container.removeChild(span);
};

export const getAmPmLabels = (locale) => {
  const amPmFormatter = getFormatter({ hour: 'numeric' }, locale);
  const amString = amPmFormatter(new Date(2017, 0, 1, 9));
  const pmString = amPmFormatter(new Date(2017, 0, 1, 21));

  const [am1, am2] = amString.split('9');
  const [pm1, pm2] = pmString.split('9');

  if (am1 !== pm1) {
    return [am1, pm1].map(el => el.trim());
  }

  if (am2 !== pm2) {
    return [am2, pm2].map(el => el.trim());
  }

  // Fallback
  return ['am', 'pm'];
};
