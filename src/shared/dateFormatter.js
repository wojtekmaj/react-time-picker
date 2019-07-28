import getUserLocale from 'get-user-locale';

/* eslint-disable import/prefer-default-export */

export function getFormatter(options) {
  return (locale, date) => date.toLocaleString(locale || getUserLocale(), options);
}
