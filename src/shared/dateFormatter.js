import getUserLocale from 'get-user-locale';

export function getFormatter(options) {
  return (locale, date) => date.toLocaleString(locale || getUserLocale(), options);
}
