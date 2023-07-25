import React from 'react';
import { getHoursMinutesSeconds } from '@wojtekmaj/date-utils';

import type { LooseValue } from './shared/types';

type ValueOptionsProps = {
  setValue: (value: LooseValue) => void;
  value?: LooseValue;
};

export default function ValueOptions({ setValue, value }: ValueOptionsProps) {
  const [time] = Array.isArray(value) ? value : [value];

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value: nextValue } = event.target;

    setValue(nextValue);
  }

  return (
    <fieldset>
      <legend>Set time externally</legend>

      <div>
        <label htmlFor="time">Time</label>
        <input
          id="time"
          onChange={onChange}
          step="1"
          type="time"
          value={time && time instanceof Date ? getHoursMinutesSeconds(time) : time || undefined}
        />
        &nbsp;
        <button onClick={() => setValue(null)} type="button">
          Clear to null
        </button>
        <button onClick={() => setValue('')} type="button">
          Clear to empty string
        </button>
      </div>
    </fieldset>
  );
}
