import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import {
  getHours,
  getMinutes,
  getSeconds,
} from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

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
      hour,
      maxTime,
      minTime,
      minute,
      ...otherProps
    } = this.props;

    return (
      <Input
        name="second"
        max={maxSecond}
        min={minSecond}
        {...otherProps}
      />
    );
  }
}

SecondInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hour: PropTypes.number,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  minute: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
};

SecondInput.defaultProps = {
  showLeadingZeros: true,
};
