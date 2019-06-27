import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import {
  getHours,
  getMinutes,
  getSeconds,
} from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default function SecondInput({
  hour,
  maxTime,
  minTime,
  minute,
  secondAriaLabel,
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
      ariaLabel={secondAriaLabel}
      name="second"
      max={maxSecond}
      min={minSecond}
      {...otherProps}
    />
  );
}

SecondInput.propTypes = {
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
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
};

SecondInput.defaultProps = {
  showLeadingZeros: true,
};
