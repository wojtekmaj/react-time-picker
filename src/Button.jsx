import React from 'react';
import PropTypes from 'prop-types';

export default function Button({
  ariaLabel,
  children,
  className,
  disabled,
  ...otherProps
}) {
  return children !== null && (
    <button
      aria-label={ariaLabel}
      className={className}
      disabled={disabled}
      onFocus={event => event.stopPropagation()}
      {...otherProps}
      type="button"
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
