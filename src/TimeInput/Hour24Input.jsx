import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getHours } from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default function Hour24Input({
  hour,
  hourAriaLabel,
  maxTime,
  minTime,
  ...otherProps
}) {
  const maxHour = min(
    23,
    maxTime && getHours(maxTime),
  );

  const minHour = max(
    0,
    minTime && getHours(minTime),
  );

  return (
    <Input
      name="hour24"
      nameForClass="hour"
      ariaLabel={hourAriaLabel}
      max={maxHour}
      min={minHour}
      {...otherProps}
    />
  );
}

Hour24Input.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hour: PropTypes.number,
  hourAriaLabel: PropTypes.string,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
};
