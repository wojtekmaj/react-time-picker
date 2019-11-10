import React from 'react';
import PropTypes from 'prop-types';
import { getHours, getMinutes, getSeconds } from '@wojtekmaj/date-utils';

import Input from './Input';

import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default function SecondInput({
  hour,
  maxTime,
  minTime,
  minute,
  showLeadingZeros = true,
  ...otherProps
}) {
  const maxSecond = min(
    59,
    maxTime
    && hour === getHours(maxTime)
    && minute === getMinutes(maxTime)
    && getSeconds(maxTime),
  );

  const minSecond = max(
    0,
    minTime
    && hour === getHours(minTime)
    && minute === getMinutes(minTime)
    && getSeconds(minTime),
  );

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

SecondInput.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hour: PropTypes.number,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  minute: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
};
