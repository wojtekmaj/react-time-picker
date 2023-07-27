import React from 'react';
import { getHours } from '@wojtekmaj/date-utils';

import Input from './Input.js';

import { safeMin, safeMax } from '../shared/utils.js';

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
