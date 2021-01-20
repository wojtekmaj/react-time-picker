import React from 'react';
import PropTypes from 'prop-types';

export default function ViewOptions({
  disabled,
  setDisabled,
}) {
  function onDisabledChange(event) {
    const { checked } = event.target;

    setDisabled(checked);
  }

  return (
    <fieldset id="viewoptions">
      <legend htmlFor="viewoptions">
        View options
      </legend>

      <div>
        <input
          checked={disabled}
          id="disabled"
          onChange={onDisabledChange}
          type="checkbox"
        />
        <label htmlFor="disabled">
          Disabled
        </label>
      </div>
    </fieldset>
  );
}

ViewOptions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  setDisabled: PropTypes.func.isRequired,
};
