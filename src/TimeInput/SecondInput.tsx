import React from 'react';
import PropTypes from 'prop-types';
import { getHours, getMinutes, getSeconds } from '@wojtekmaj/date-utils';

import Input from './Input';

import { isRef, isTime } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

type SecondInputProps = {
  hour?: string | null;
  maxTime?: string;
  minTime?: string;
  minute?: string | null;
  showLeadingZeros?: boolean;
} & Omit<React.ComponentProps<typeof Input>, 'max' | 'min' | 'name'>;

export default function SecondInput({
  hour,
  maxTime,
  minTime,
  minute,
  showLeadingZeros = true,
  ...otherProps
}: SecondInputProps) {
  function isSameMinute(date: string | Date) {
    return hour === getHours(date).toString() && minute === getMinutes(date).toString();
  }

  const maxSecond = safeMin(59, maxTime && isSameMinute(maxTime) && getSeconds(maxTime));
  const minSecond = safeMax(0, minTime && isSameMinute(minTime) && getSeconds(minTime));

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
  hour: PropTypes.string,
  inputRef: isRef,
  maxTime: isTime,
  minTime: isTime,
  minute: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.string,
};
