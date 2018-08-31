import React, { PureComponent } from 'react';
// eslint-disable-next-line import/no-unresolved
import TimePicker from 'react-time-picker/src/entry.nostyle';
// eslint-disable-next-line import/no-unresolved
import 'react-time-picker/src/TimePicker.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-clock/dist/Clock.css';

import ValidityOptions from './ValidityOptions';
import MaxDetailOptions from './MaxDetailOptions';
import LocaleOptions from './LocaleOptions';
import ValueOptions from './ValueOptions';

import './Test.less';

import { getHoursMinutesSeconds } from '../src/shared/dates';

const now = new Date();

export default class Test extends PureComponent {
  state = {
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
              setState={setState}
              locale={locale}
            />
            <ValueOptions
              setState={setState}
              value={value}
            />
          </aside>
          <main className="Test__container__content">
            <form
              onSubmit={(event) => {
                event.preventDefault();

                /* eslint-disable no-console */
                console.warn('TimePicker triggered submitting the form.');
                console.log(event);
                /* eslint-enable no-console */
              }}
            >
              <TimePicker
                className="myCustomTimePickerClassName"
                clockClassName="myCustomClockClassName"
                disabled={false}
                locale={locale}
                maxDetail={maxDetail}
                maxTime={maxTime}
                minTime={minTime}
                name="myCustomName"
                onChange={this.onChange}
                required={required}
                value={value}
              />
              <br />
              <br />
              <button
                type="submit"
                id="submit"
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
