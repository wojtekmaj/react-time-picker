import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import {
  getHours,
  convert24to12,
} from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default function Hour12Input({
  amPm,
  hour,
  maxTime,
  minTime,
  value,
  ...otherProps
}) {
  const maxHour = (() => {
    if (!maxTime) {
      return 12;
    }

    const [maxHourResult, maxAmPm] = convert24to12(getHours(maxTime));

    if (maxAmPm !== amPm) {
      // pm is always after am, so we should ignore validation
      return 12;
    }

    return min(12, maxHourResult);
  })();

  const minHour = (() => {
    if (!minTime) {
      return 1;
    }

    const [minHourResult, minAmPm] = convert24to12(getHours(minTime));

    if (minAmPm !== amPm) {
      // pm is always after am, so we should ignore validation
      return 1;
    }

    if (minHourResult === 12) {
      // If minHour is 12 am/pm, user should be able to enter 12, 1, ..., 11.
      return 1;
    }

    return max(1, minHourResult);
  })();

  const value12 = value !== null ? convert24to12(value)[0] : null;

  return (
    <Input
      max={maxHour}
      min={minHour}
      name="hour12"
      nameForClass="hour"
      value={value12}
      {...otherProps}
    />
  );
}

Hour12Input.propTypes = {
  amPm: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hour: PropTypes.number,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
};
