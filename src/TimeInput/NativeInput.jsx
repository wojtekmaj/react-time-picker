import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  getHoursMinutes,
  getHoursMinutesSeconds,
} from '../shared/dates';
import { isTime, isValueType } from '../shared/propTypes';

export default class NativeInput extends PureComponent {
  get nativeValueParser() {
    switch (this.props.valueType) {
      case 'hour':
      case 'minute':
        return getHoursMinutes;
      case 'second':
        return getHoursMinutesSeconds;
      default:
        throw new Error('Invalid valueType.');
    }
  }

  stopPropagation = event => event.stopPropagation();

  render() {
    const { nativeValueParser } = this;

    const {
      disabled, maxTime, minTime, name, onChange, required, value, valueType,
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
        step={valueType === 'second' ? 1 : null}
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
