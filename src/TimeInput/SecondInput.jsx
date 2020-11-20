import React from 'react';
import PropTypes from 'prop-types';
import { getHours, getMinutes, getSeconds } from '@wojtekmaj/date-utils';

import Input from './Input';

import { isTime } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

export default function SecondInput({
  hour,
  maxTime,
  minTime,
  minute,
  showLeadingZeros = true,
  ...otherProps
}) {
  function isSameMinute(date) {
    return date && Number(hour) === getHours(date) && Number(minute) === getMinutes(date);
  }

  const maxSecond = safeMin(59, isSameMinute(maxTime) && getSeconds(maxTime));
  const minSecond = safeMax(0, isSameMinute(minTime) && getSeconds(minTime));

  return (
    <Input
      max={maxSecond}
      min={minSecond}
      name="second"
      showLeadingZeros={showLeadingZeros}
      {...otherProps}
    />
  );
}

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

SecondInput.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hour: isValue,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  minute: isValue,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: isValue,
};
