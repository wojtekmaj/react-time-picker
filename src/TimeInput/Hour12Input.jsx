import React from 'react';
import PropTypes from 'prop-types';
import { getHours } from '@wojtekmaj/date-utils';

import Input from './Input';

import {
  convert24to12,
} from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

export default function Hour12Input({
  amPm,
  hour,
  maxTime,
  minTime,
  value,
  ...otherProps
}) {
  const maxHour = safeMin(12, maxTime && (() => {
    const [maxHourResult, maxAmPm] = convert24to12(getHours(maxTime));

    if (maxAmPm !== amPm) {
      // pm is always after am, so we should ignore validation
      return null;
    }

    return maxHourResult;
  })());

  const minHour = safeMax(1, minTime && (() => {
    const [minHourResult, minAmPm] = convert24to12(getHours(minTime));

    if (
      // pm is always after am, so we should ignore validation
      minAmPm !== amPm
      // If minHour is 12 am/pm, user should be able to enter 12, 1, ..., 11.
      || minHourResult === 12
    ) {
      return null;
    }

    return minHourResult;
  })());

  const value12 = value ? convert24to12(value)[0].toString() : '';

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
  hour: PropTypes.string,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.string,
};
