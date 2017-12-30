import {
  getHours,
  getMinutes,
  getSeconds,
} from 'react-clock/dist/shared/dates';

export {
  getHours,
  getMinutes,
  getSeconds,
};

export const getHoursMinutes = (date) => {
  if (!date) {
    return date;
  }

  const hours = `0${getHours(date)}`.slice(-2);
  const minutes = `0${getMinutes(date)}`.slice(-2);

  return `${hours}:${minutes}`;
};

export const getHoursMinutesSeconds = (date) => {
  if (!date) {
    return date;
  }

  const hours = `0${getHours(date)}`.slice(-2);
  const minutes = `0${getMinutes(date)}`.slice(-2);
  const seconds = `0${getSeconds(date)}`.slice(-2);

  return `${hours}:${minutes}:${seconds}`;
};
