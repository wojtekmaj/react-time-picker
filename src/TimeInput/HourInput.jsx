import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import { getHours } from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max, updateInputWidth } from '../shared/utils';

export default class HourInput extends PureComponent {
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
      className, disabled, itemRef, onChange, onKeyDown, required, value,
    } = this.props;

    return (
      <input
        className={mergeClassNames(
          `${className}__input`,
          `${className}__hour`,
        )}
        disabled={disabled}
        name="hour"
        max={maxHour}
        min={minHour}
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

HourInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
};
