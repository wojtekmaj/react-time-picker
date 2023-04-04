import PropTypes from 'prop-types';

const allViews = ['hour', 'minute', 'second'];
const allValueTypes = [...allViews];

const hourOptionalSecondsRegExp = /^(([0-1])?[0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/;

export function isTime(props: Record<string, unknown>, propName: string, componentName: string) {
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
}

export const isValueType = PropTypes.oneOf(allValueTypes);

export const isRef = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({
    current: PropTypes.any,
  }),
]);
