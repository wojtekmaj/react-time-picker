import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getHours, getMinutes } from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

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
      hour,
      maxTime,
      minTime,
      ...otherProps
    } = this.props;

    return (
      <Input
        name="minute"
        max={maxMinute}
        min={minMinute}
        {...otherProps}
      />
    );
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
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
};

MinuteInput.defaultProps = {
  showLeadingZeros: true,
};
