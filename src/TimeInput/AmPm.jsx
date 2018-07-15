import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  getHours,
  convert24to12,
} from '../shared/dates';
import { isTime } from '../shared/propTypes';

class AmPm extends PureComponent {
  get amDisabled() {
    const { minTime } = this.props;

    return minTime && convert24to12(getHours(minTime))[1] === 'pm';
  }

  get pmDisabled() {
    const { maxTime } = this.props;

    return maxTime && convert24to12(getHours(maxTime))[1] === 'am';
  }

  render() {
    const {
      className, disabled, itemRef, onChange, required, value,
    } = this.props;

    const name = 'amPm';

    return (
      <select
        className={mergeClassNames(
          `${className}__input`,
          `${className}__amPm`,
        )}
        disabled={disabled}
        name={name}
        onChange={onChange}
        ref={(ref) => {
          if (itemRef) {
            itemRef(ref, name);
          }
        }}
        required={required}
        value={value !== null ? value : ''}
      >
        {!value && (
          <option value="">
            --
          </option>
        )}
        <option disabled={this.amDisabled} value="am">
          am
        </option>
        <option disabled={this.pmDisabled} value="pm">
          pm
        </option>
      </select>
    );
  }
}

AmPm.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOf(['am', 'pm']),
};

export default AmPm;
