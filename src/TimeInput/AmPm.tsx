import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { getHours } from '@wojtekmaj/date-utils';

import { convert24to12 } from '../shared/dates';
import { isRef, isTime } from '../shared/propTypes';
import { getAmPmLabels } from '../shared/utils';

/* eslint-disable jsx-a11y/no-autofocus */

type AmPmProps = {
  ariaLabel?: string;
  autoFocus?: boolean;
  className: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLSelectElement>;
  locale?: string;
  maxTime?: string;
  minTime?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement> & { target: HTMLSelectElement }) => void;
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLSelectElement> & { target: HTMLSelectElement },
  ) => void;
  required?: boolean;
  value?: string | null;
};

export default function AmPm({
  ariaLabel,
  autoFocus,
  className,
  disabled,
  inputRef,
  locale,
  maxTime,
  minTime,
  onChange,
  onKeyDown,
  required,
  value,
}: AmPmProps) {
  const amDisabled = minTime ? convert24to12(getHours(minTime))[1] === 'pm' : false;
  const pmDisabled = maxTime ? convert24to12(getHours(maxTime))[1] === 'am' : false;

  const name = 'amPm';
  const [amLabel, pmLabel] = getAmPmLabels(locale);

  return (
    <select
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      className={clsx(`${className}__input`, `${className}__${name}`)}
      data-input="true"
      data-select="true"
      disabled={disabled}
      name={name}
      onChange={onChange}
      onKeyDown={onKeyDown}
      ref={inputRef}
      required={required}
      value={value !== null ? value : ''}
    >
      {!value && <option value="">--</option>}
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
  autoFocus: PropTypes.bool,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inputRef: isRef,
  locale: PropTypes.string,
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOf(['am', 'pm']),
};
