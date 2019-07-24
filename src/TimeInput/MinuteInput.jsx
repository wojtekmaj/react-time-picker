import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getHours, getMinutes } from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default function MinuteInput({
  hour,
  maxTime,
  minTime,
  ...otherProps
}) {
  const maxMinute = min(
    59,
    maxTime
    && hour === getHours(maxTime)
    && getMinutes(maxTime),
  );

  const minMinute = max(
    0,
    minTime
    && hour === getHours(minTime)
    && getMinutes(minTime),
  );

  return (
    <Input
      max={maxMinute}
      min={minMinute}
      name="minute"
      {...otherProps}
    />
  );
}

MinuteInput.propTypes = {
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

MinuteInput.defaultProps = {
  showLeadingZeros: true,
};
