import React from 'react';
import { getHours } from '@wojtekmaj/date-utils';

import Input from './Input.js';

import { convert24to12 } from '../shared/dates.js';
import { safeMin, safeMax } from '../shared/utils.js';

import type { AmPmType } from '../shared/types.js';

type Hour12InputProps = {
  amPm: AmPmType | null;
  maxTime?: string;
  minTime?: string;
  value?: string | null;
} & Omit<React.ComponentProps<typeof Input>, 'max' | 'min' | 'name' | 'nameForClass'>;

export default function Hour12Input({
  amPm,
  maxTime,
  minTime,
  value,
  ...otherProps
}: Hour12InputProps) {
  const maxHour = safeMin(
    12,
    maxTime &&
      (() => {
        const [maxHourResult, maxAmPm] = convert24to12(getHours(maxTime));

        if (maxAmPm !== amPm) {
          // pm is always after am, so we should ignore validation
          return null;
        }

        return maxHourResult;
      })(),
  );

  const minHour = safeMax(
    1,
    minTime &&
      (() => {
        const [minHourResult, minAmPm] = convert24to12(getHours(minTime));

        if (
          // pm is always after am, so we should ignore validation
          minAmPm !== amPm ||
          // If minHour is 12 am/pm, user should be able to enter 12, 1, ..., 11.
          minHourResult === 12
        ) {
          return null;
        }

        return minHourResult;
      })(),
  );

  const value12 = value ? convert24to12(value)[0].toString() : '';

  return (
    <Input
      max={maxHour}
      min={minHour}
      name="hour12"
      nameForClass="hour"
      value={value12}
      {...otherProps}
    />
  );
}
