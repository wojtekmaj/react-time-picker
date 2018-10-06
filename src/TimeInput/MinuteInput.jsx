import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  getHours,
  getMinutes,
} from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max, updateInputWidth } from '../shared/utils';

export default class MinuteInput extends PureComponent {
  get maxMinute() {
    const { hour, maxTime } = this.props;
    return min(
      59,
      maxTime
      && hour === getHours(maxTime)
      && getMinutes(maxTime),
    );
  }

  get minMinute() {
    const { hour, minTime } = this.props;
    return max(
      0,
      minTime
      && hour === getHours(minTime)
      && getMinutes(minTime),
    );
  }

  render() {
    const { maxMinute, minMinute } = this;
    const {
      className, disabled, itemRef, onChange, onKeyDown, required, value,
    } = this.props;

    const name = 'minute';
    const hasLeadingZero = value !== null && value < 10;

    return [
      (hasLeadingZero ? '0' : null),
      <input
        key="minute"
        className={mergeClassNames(
          `${className}__input`,
          `${className}__minute`,
          hasLeadingZero && `${className}__input--hasLeadingZero`,
        )}
        disabled={disabled}
        name={name}
        max={maxMinute}
        min={minMinute}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={event => updateInputWidth(event.target)}
        placeholder="--"
        ref={(ref) => {
          if (ref) {
            updateInputWidth(ref);
          }

          if (itemRef) {
            itemRef(ref, name);
          }
        }}
        required={required}
        type="number"
        value={value !== null ? value : ''}
      />,
    ];
  }
}

MinuteInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hour: PropTypes.number,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
};
