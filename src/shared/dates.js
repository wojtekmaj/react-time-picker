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

export function getHoursMinutes(date) {
  if (!date) {
    return date;
  }

  const hours = `0${getHours(date)}`.slice(-2);
  const minutes = `0${getMinutes(date)}`.slice(-2);

  return `${hours}:${minutes}`;
}

export function getHoursMinutesSeconds(date) {
  if (!date) {
    return date;
  }

  const hours = `0${getHours(date)}`.slice(-2);
  const minutes = `0${getMinutes(date)}`.slice(-2);
  const seconds = `0${getSeconds(date)}`.slice(-2);

  return `${hours}:${minutes}:${seconds}`;
}

export function convert12to24(hour12, amPm) {
  let hour24 = parseInt(hour12, 10);

  if (amPm === 'am' && hour24 === 12) {
    hour24 = 0;
  } else if (amPm === 'pm' && hour24 < 12) {
    hour24 += 12;
  }

  return hour24;
}

export function convert24to12(hour24) {
  const hour12 = hour24 % 12 || 12;

  return [hour12, hour24 < 12 ? 'am' : 'pm'];
}
