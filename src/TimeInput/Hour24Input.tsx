import React from 'react';
import PropTypes from 'prop-types';
import { getHours } from '@wojtekmaj/date-utils';

import Input from './Input';

import { isRef, isTime } from '../shared/propTypes';
import { safeMin, safeMax } from '../shared/utils';

type Hour24InputProps = {
  maxTime?: string;
  minTime?: string;
  value?: string | null;
} & Omit<React.ComponentProps<typeof Input>, 'max' | 'min' | 'name' | 'nameForClass'>;

export default function Hour24Input({ maxTime, minTime, ...otherProps }: Hour24InputProps) {
  const maxHour = safeMin(23, maxTime && getHours(maxTime));
  const minHour = safeMax(0, minTime && getHours(minTime));

  return <Input max={maxHour} min={minHour} name="hour24" nameForClass="hour" {...otherProps} />;
}

Hour24Input.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hour: PropTypes.string,
  inputRef: isRef,
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
