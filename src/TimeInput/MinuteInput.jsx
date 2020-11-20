import React from 'react';
import PropTypes from 'prop-types';
import { getHours, getMinutes } from '@wojtekmaj/date-utils';

import Input from './Input';

import { isTime } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

export default function MinuteInput({
  hour,
  maxTime,
  minTime,
  showLeadingZeros = true,
  ...otherProps
}) {
  function isSameHour(date) {
    return date && Number(hour) === getHours(date);
  }

  const maxMinute = safeMin(59, isSameHour(maxTime) && getMinutes(maxTime));
  const minMinute = safeMax(0, isSameHour(minTime) && getMinutes(minTime));

  return (
    <Input
      max={maxMinute}
      min={minMinute}
      name="minute"
      showLeadingZeros={showLeadingZeros}
      {...otherProps}
    />
  );
}

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

MinuteInput.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hour: isValue,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: isValue,
};
