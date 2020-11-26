import React, { useState } from 'react';
import TimePicker from 'react-time-picker';

import './Sample.less';

export default function Sample() {
  const [value, onChange] = useState(new Date());

  return (
    <div className="Sample">
      <header>
        <h1>react-time-picker sample page</h1>
      </header>
      <div className="Sample__container">
        <main className="Sample__container__content">
          <TimePicker
            amPmAriaLabel="Select AM/PM"
            clearAriaLabel="Clear value"
            clockAriaLabel="Toggle clock"
            hourAriaLabel="Hour"
            maxDetail="second"
            minuteAriaLabel="Minute"
            nativeInputAriaLabel="Time"
            onChange={onChange}
            secondAriaLabel="Second"
            value={value}
          />
        </main>
      </div>
    </div>
  );
}
