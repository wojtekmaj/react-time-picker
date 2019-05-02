import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import {
  getHours,
  convert24to12,
} from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default class Hour12Input extends PureComponent {
  get maxHour() {
    const { amPm, maxTime } = this.props;

    if (!maxTime) {
      return 12;
    }

    const [maxHour, maxAmPm] = convert24to12(getHours(maxTime));

    if (maxAmPm !== amPm) {
      // pm is always after am, so we should ignore validation
      return 12;
    }

    return min(12, maxHour);
  }

  get minHour() {
    const { amPm, minTime } = this.props;

    if (!minTime) {
      return 1;
    }

    const [minHour, minAmPm] = convert24to12(getHours(minTime));

    if (minAmPm !== amPm) {
      // pm is always after am, so we should ignore validation
      return 1;
    }

    if (minHour === 12) {
      // If minHour is 12 am/pm, user should be able to enter 12, 1, ..., 11.
      return 1;
    }

    return max(1, minHour);
  }

  render() {
    const { maxHour, minHour } = this;
    const {
      hour,
      maxTime,
      minTime,
      value,
      ...otherProps
    } = this.props;

    const value12 = value !== null ? convert24to12(value)[0] : null;

    return (
      <Input
        name="hour12"
        nameForClass="hour"
        max={maxHour}
        min={minHour}
        value={value12}
        {...otherProps}
      />
    );
  }
}

Hour12Input.propTypes = {
  amPm: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.number,
};
