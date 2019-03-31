import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

import { getHours } from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max } from '../shared/utils';

export default class Hour24Input extends PureComponent {
  get maxHour() {
    const { maxTime } = this.props;
    return min(
      23,
      maxTime && getHours(maxTime),
    );
  }

  get minHour() {
    const { minTime } = this.props;
    return max(
      0,
      minTime && getHours(minTime),
    );
  }

  render() {
    const { maxHour, minHour } = this;
    const {
      hour,
      maxTime,
      minTime,
      ...otherProps
    } = this.props;

    return (
      <Input
        name="hour24"
        nameForClass="hour"
        max={maxHour}
        min={minHour}
        {...otherProps}
      />
    );
  }
}

Hour24Input.propTypes = {
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
