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
    const { maxTime } = this.props;
    return min(
      12,
      maxTime && convert24to12(getHours(maxTime))[0],
    );
  }

  get minHour() {
    const { minTime } = this.props;
    return max(
      1,
      minTime && convert24to12(getHours(minTime))[0],
    );
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
