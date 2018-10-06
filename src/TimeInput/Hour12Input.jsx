import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  getHours,
  convert24to12,
} from '../shared/dates';
import { isTime } from '../shared/propTypes';
import { min, max, updateInputWidth } from '../shared/utils';

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
      className, disabled, itemRef, onChange, onKeyDown, required, value,
    } = this.props;

    const name = 'hour12';
    const value12 = value !== null && convert24to12(value)[0];

    return (
      <input
        className={mergeClassNames(
          `${className}__input`,
          `${className}__hour`,
        )}
        disabled={disabled}
        name={name}
        max={maxHour}
        min={minHour}
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
        value={value12 !== null ? value12 : ''}
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
  value: PropTypes.number,
};
