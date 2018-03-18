import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

const AmPm = ({
  className, disabled, itemRef, onChange, value,
}) => (
  <select
    className={mergeClassNames(
      `${className}__input`,
      `${className}__amPm`,
    )}
    disabled={disabled}
    name="amPm"
    onChange={onChange}
    ref={(ref) => {
      if (itemRef) {
        itemRef(ref, name);
      }
    }}
    value={value}
  >
    <option>am</option>
    <option>pm</option>
  </select>
);

AmPm.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.oneOf(['am', 'pm']),
};

export default AmPm;
