import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  getHours,
  getMinutes,
  getSeconds,
} from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max, updateInputWidth } from '../shared/utils';

export default class SecondInput extends PureComponent {
  get maxSecond() {
    const { hour, minute, maxTime } = this.props;
    return min(
      59,
      maxTime
      && hour === getHours(maxTime)
      && minute === getMinutes(maxTime)
      && getSeconds(maxTime),
    );
  }

  get minSecond() {
    const { hour, minute, minTime } = this.props;
    return max(
      0,
      minTime
      && hour === getHours(minTime)
      && minute === getMinutes(minTime)
      && getSeconds(minTime),
    );
  }

  render() {
    const { maxSecond, minSecond } = this;
    const {
      className, disabled, itemRef, onChange, onKeyDown, required, value,
    } = this.props;

    const name = 'second';
    const hasLeadingZero = value !== null && value < 10;

    return [
      (hasLeadingZero ? '0' : null),
      <input
        key="second"
        className={mergeClassNames(
          `${className}__input`,
          `${className}__second`,
          hasLeadingZero && `${className}__input--hasLeadingZero`,
        )}
        disabled={disabled}
        name={name}
        max={maxSecond}
        min={minSecond}
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

SecondInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hour: PropTypes.number,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minute: PropTypes.number,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
};
