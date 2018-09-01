import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  getHours,
  getHoursMinutes,
  getHoursMinutesSeconds,
} from '../shared/dates';
import { isTime, isValueType } from '../shared/propTypes';

export default class NativeInput extends PureComponent {
  get nativeValueParser() {
    const { valueType } = this.props;

    switch (valueType) {
      case 'hour':
        return value => `${getHours(value)}:00`;
      case 'minute':
        return getHoursMinutes;
      case 'second':
        return getHoursMinutesSeconds;
      default:
        throw new Error('Invalid valueType.');
    }
  }

  get step() {
    const { valueType } = this.props;

    switch (valueType) {
      case 'hour':
        return 3600;
      case 'minute':
        return 60;
      case 'second':
        return 1;
      default:
        throw new Error('Invalid valueType.');
    }
  }

  stopPropagation = event => event.stopPropagation();

  render() {
    const { nativeValueParser, step } = this;
    const {
      disabled, maxTime, minTime, name, onChange, required, value,
    } = this.props;

    return (
      <input
        type="time"
        disabled={disabled}
        max={maxTime ? nativeValueParser(maxTime) : null}
        min={minTime ? nativeValueParser(minTime) : null}
        name={name}
        onChange={onChange}
        onFocus={this.stopPropagation}
        required={required}
        step={step}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
        }}
        value={value ? nativeValueParser(value) : ''}
      />
    );
  }
}

NativeInput.propTypes = {
  disabled: PropTypes.bool,
  maxTime: isTime,
  minTime: isTime,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  valueType: isValueType,
};
