import PropTypes from 'prop-types';

import type { Requireable, Validator } from 'prop-types';
import type { Range } from './types.js';

const allViews = ['hour', 'minute', 'second'];
const allValueTypes = [...allViews];

const hourOptionalSecondsRegExp = /^(([0-1])?[0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/;

export const isTime: Validator<string> = function isTime(props, propName, componentName) {
  const { [propName]: time } = props;

  if (time) {
    if (typeof time !== 'string' || !hourOptionalSecondsRegExp.test(time)) {
      return new Error(
        `Invalid prop \`${propName}\` of type \`${typeof time}\` supplied to \`${componentName}\`, expected time in HH:mm(:ss) format.`,
      );
    }
  }

  // Everything is fine
  return null;
};

export const isValueType = PropTypes.oneOf(allValueTypes);

export const isRef = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.exact({
    current: PropTypes.any,
  }),
]);

export const rangeOf = <T>(type: Requireable<T>): Requireable<Range<T>> => {
  return PropTypes.arrayOf(type) as Requireable<Range<T>>;
};
