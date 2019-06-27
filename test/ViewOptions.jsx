import React from 'react';
import PropTypes from 'prop-types';

export default function ViewOptions({
  disabled,
  setState,
}) {
  function onDisabledChange(event) {
    const { checked } = event.target;

    setState({ disabled: checked });
  }

  return (
    <fieldset id="viewoptions">
      <legend htmlFor="viewoptions">
        View options
      </legend>

      <div>
        <input
          id="disabled"
          type="checkbox"
          checked={disabled}
          onChange={onDisabledChange}
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
  setState: PropTypes.func.isRequired,
};
