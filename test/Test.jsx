import React, { PureComponent } from 'react';
import TimePicker from 'react-time-picker/src/entry.nostyle';
import 'react-time-picker/src/TimePicker.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-clock/dist/Clock.css';

import ValidityOptions from './ValidityOptions';
import MaxDetailOptions from './MaxDetailOptions';
import LocaleOptions from './LocaleOptions';
import ValueOptions from './ValueOptions';
import ViewOptions from './ViewOptions';

import './Test.less';

import { getHoursMinutesSeconds } from '../src/shared/dates';

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

export default class Test extends PureComponent {
  state = {
    disabled: false,
    locale: null,
    maxTime: null,
    maxDetail: 'minute',
    minTime: null,
    required: true,
    value: getHoursMinutesSeconds(now),
  }

  onChange = value => this.setState({ value })

  render() {
    const {
      disabled,
      locale,
      maxTime,
      maxDetail,
      minTime,
      required,
      value,
    } = this.state;

    const setState = state => this.setState(state);

    return (
      <div className="Test">
        <header>
          <h1>
            react-time-picker test page
          </h1>
        </header>
        <div className="Test__container">
          <aside className="Test__container__options">
            <MaxDetailOptions
              maxDetail={maxDetail}
              setState={setState}
            />
            <ValidityOptions
              maxTime={maxTime}
              minTime={minTime}
              required={required}
              setState={setState}
            />
            <LocaleOptions
              locale={locale}
              setState={setState}
            />
            <ValueOptions
              setState={setState}
              value={value}
            />
            <ViewOptions
              disabled={disabled}
              setState={setState}
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
                disabled={disabled}
                locale={locale}
                maxDetail={maxDetail}
                maxTime={maxTime}
                minTime={minTime}
                name="myCustomName"
                onChange={this.onChange}
                onClockClose={() => console.log('Clock closed')}
                onClockOpen={() => console.log('Clock opened')}
                required={required}
                value={value}
              />
              <br />
              <br />
              <button
                id="submit"
                type="submit"
              >
                Submit
              </button>
            </form>
          </main>
        </div>
      </div>
    );
  }
}
