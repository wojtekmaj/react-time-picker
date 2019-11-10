import React from 'react';
import PropTypes from 'prop-types';
import {
  getHours,
  getHoursMinutes,
  getHoursMinutesSeconds,
} from '@wojtekmaj/date-utils';

import { isTime, isValueType } from '../shared/propTypes';

export default function NativeInput({
  ariaLabel,
  disabled,
  maxTime,
  minTime,
  name,
  onChange,
  required,
  value,
  valueType,
}) {
  const nativeValueParser = (() => {
    switch (valueType) {
      case 'hour':
        return receivedValue => `${getHours(receivedValue)}:00`;
      case 'minute':
        return getHoursMinutes;
      case 'second':
        return getHoursMinutesSeconds;
      default:
        throw new Error('Invalid valueType.');
    }
  })();

  const step = (() => {
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
  })();

  function stopPropagation(event) {
    event.stopPropagation();
  }

  return (
    <input
      aria-label={ariaLabel}
      disabled={disabled}
      max={maxTime ? nativeValueParser(maxTime) : null}
      min={minTime ? nativeValueParser(minTime) : null}
      name={name}
      onChange={onChange}
      onFocus={stopPropagation}
      required={required}
      step={step}
      style={{
        visibility: 'hidden',
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
      }}
      type="time"
      value={value ? nativeValueParser(value) : ''}
    />
  );
}

NativeInput.propTypes = {
  ariaLabel: PropTypes.string,
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
