import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
      maxTime && hour === getHours(maxTime) && getMinutes(maxTime),
    );
  }

  get minMinute() {
    const { hour, minTime } = this.props;
    return max(
      0,
      minTime && hour === getHours(minTime) && getMinutes(minTime),
    );
  }

  render() {
    const { maxMinute, minMinute } = this;
    const {
      itemRef, onChange, onKeyDown, required, value,
    } = this.props;

    return (
      <input
        className="react-time-picker__button__input__minute"
        name="minute"
        max={maxMinute}
        min={minMinute}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="--"
        ref={(ref) => {
          if (!ref) return;

          updateInputWidth(ref);

          if (itemRef) {
            itemRef(ref);
          }
        }}
        required={required}
        type="number"
        value={value !== null ? value : ''}
      />
    );
  }
}

MinuteInput.propTypes = {
  hour: PropTypes.number,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
};
