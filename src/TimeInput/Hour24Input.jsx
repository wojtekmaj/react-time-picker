import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getHours } from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default function Hour24Input({
  hour,
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
      max={maxHour}
      min={minHour}
      name="hour24"
      nameForClass="hour"
      {...otherProps}
    />
  );
}

Hour24Input.propTypes = {
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
