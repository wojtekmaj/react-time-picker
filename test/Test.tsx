import React, { useRef, useState } from 'react';
import TimePicker from 'react-time-picker/src';
import 'react-time-picker/src/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { getHoursMinutesSeconds } from '@wojtekmaj/date-utils';

import ValidityOptions from './ValidityOptions';
import MaxDetailOptions from './MaxDetailOptions';
import LocaleOptions from './LocaleOptions';
import ValueOptions from './ValueOptions';
import ViewOptions from './ViewOptions';

import './Test.css';

import type { Detail, LooseValue } from './shared/types';

const now = new Date();

const ariaLabelProps = {
  amPmAriaLabel: 'Select AM/PM',
  clearAriaLabel: 'Clear value',
  clockAriaLabel: 'Toggle clock',
  hourAriaLabel: 'Hour',
  minuteAriaLabel: 'Minute',
  nativeInputAriaLabel: 'Time',
  secondAriaLabel: 'Second',
};

const placeholderProps = {
  hourPlaceholder: 'hh',
  minutePlaceholder: 'mm',
  secondPlaceholder: 'ss',
};

/* eslint-disable no-console */

export default function Test() {
  const portalContainer = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = useState(false);
  const [locale, setLocale] = useState<string>();
  const [maxTime, setMaxTime] = useState<string | undefined>();
  const [maxDetail, setMaxDetail] = useState<Detail>('minute');
  const [minTime, setMinTime] = useState<string | undefined>();
  const [renderInPortal, setRenderInPortal] = useState(false);
  const [required, setRequired] = useState(true);
  const [value, setValue] = useState<LooseValue>(getHoursMinutesSeconds(now));

  return (
    <div className="Test">
      <header>
        <h1>react-time-picker test page</h1>
      </header>
      <div className="Test__container">
        <aside className="Test__container__options">
          <MaxDetailOptions maxDetail={maxDetail} setMaxDetail={setMaxDetail} />
          <ValidityOptions
            maxTime={maxTime}
            minTime={minTime}
            required={required}
            setMaxTime={setMaxTime}
            setMinTime={setMinTime}
            setRequired={setRequired}
          />
          <LocaleOptions locale={locale} setLocale={setLocale} />
          <ValueOptions setValue={setValue} value={value} />
          <ViewOptions
            disabled={disabled}
            renderInPortal={renderInPortal}
            setDisabled={setDisabled}
            setRenderInPortal={setRenderInPortal}
          />
        </aside>
        <main className="Test__container__content">
          <form
            onSubmit={(event) => {
              event.preventDefault();

              console.warn('TimePicker triggered submitting the form.');
              console.log(event);
            }}
          >
            <TimePicker
              {...ariaLabelProps}
              {...placeholderProps}
              className="myCustomTimePickerClassName"
              clockClassName="myCustomClockClassName"
              data-testid="myCustomTimePicker"
              disabled={disabled}
              locale={locale}
              maxDetail={maxDetail}
              maxTime={maxTime}
              minTime={minTime}
              name="myCustomName"
              onChange={setValue}
              onClockClose={() => console.log('Clock closed')}
              onClockOpen={() => console.log('Clock opened')}
              portalContainer={renderInPortal ? portalContainer.current : undefined}
              required={required}
              value={value}
            />
            <div ref={portalContainer} />
            <br />
            <br />
            <button id="submit" type="submit">
              Submit
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
