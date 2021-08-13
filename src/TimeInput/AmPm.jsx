import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';
import { getHours } from '@wojtekmaj/date-utils';

import { convert24to12 } from '../shared/dates';
import { isRef, isTime } from '../shared/propTypes';
import { getAmPmLabels } from '../shared/utils';

export default function AmPm({
  ariaLabel,
  className,
  disabled,
  inputRef,
  locale,
  maxTime,
  minTime,
  onChange,
  required,
  value,
}) {
  const amDisabled = minTime && convert24to12(getHours(minTime))[1] === 'pm';
  const pmDisabled = maxTime && convert24to12(getHours(maxTime))[1] === 'am';

  const name = 'amPm';
  const [amLabel, pmLabel] = getAmPmLabels(locale);

  return (
    <select
      aria-label={ariaLabel}
      className={mergeClassNames(
        `${className}__input`,
        `${className}__${name}`,
      )}
      disabled={disabled}
      name={name}
      onChange={onChange}
      ref={inputRef}
      required={required}
      value={value !== null ? value : ''}
    >
      {!value && (
        <option value="">
          --
        </option>
      )}
      <option disabled={amDisabled} value="am">
        {amLabel}
      </option>
      <option disabled={pmDisabled} value="pm">
        {pmLabel}
      </option>
    </select>
  );
}

AmPm.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inputRef: isRef,
  locale: PropTypes.string,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOf(['am', 'pm']),
};
