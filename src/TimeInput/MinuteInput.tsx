import React from 'react';
import { getHours, getMinutes } from '@wojtekmaj/date-utils';

import Input from './Input';

import { safeMin, safeMax } from '../shared/utils';

type MinuteInputProps = {
  hour?: string | null;
  maxTime?: string;
  minTime?: string;
  showLeadingZeros?: boolean;
} & Omit<React.ComponentProps<typeof Input>, 'max' | 'min' | 'name'>;

export default function MinuteInput({
  hour,
  maxTime,
  minTime,
  showLeadingZeros = true,
  ...otherProps
}: MinuteInputProps) {
  function isSameHour(date: string | Date) {
    return hour === getHours(date).toString();
  }

  const maxMinute = safeMin(59, maxTime && isSameHour(maxTime) && getMinutes(maxTime));
  const minMinute = safeMax(0, minTime && isSameHour(minTime) && getMinutes(minTime));

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
