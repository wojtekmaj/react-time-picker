import React from 'react';
import PropTypes from 'prop-types';

export default function ViewOptions({
  disabled,
  readOnly,
  setState,
}) {
  function onDisabledChange(event) {
    const { checked } = event.target;

    setState({ disabled: checked });
  }

  function onReadOnlyChange(event) {
    const { checked } = event.target;

    setState({ readOnly: checked });
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

      <div>
        <input
          checked={readOnly}
          id="readOnly"
          onChange={onReadOnlyChange}
          type="checkbox"
        />
        <label htmlFor="readOnly">
          Read only
        </label>
      </div>
    </fieldset>
  );
}

ViewOptions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
};
