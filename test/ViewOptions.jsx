import React from 'react';
import PropTypes from 'prop-types';

export default function ViewOptions({ disabled, renderInPortal, setDisabled, setRenderInPortal }) {
  function onDisabledChange(event) {
    const { checked } = event.target;

    setDisabled(checked);
  }

  function onRenderInPortalChange(event) {
    const { checked } = event.target;

    setRenderInPortal(checked);
  }

  return (
    <fieldset>
      <legend>View options</legend>

      <div>
        <input checked={disabled} id="disabled" onChange={onDisabledChange} type="checkbox" />
        <label htmlFor="disabled">Disabled</label>
      </div>

      <div>
        <input
          checked={renderInPortal}
          id="renderInPortal"
          onChange={onRenderInPortalChange}
          type="checkbox"
        />
        <label htmlFor="renderInPortal">Render in portal</label>
      </div>
    </fieldset>
  );
}

ViewOptions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  renderInPortal: PropTypes.bool.isRequired,
  setDisabled: PropTypes.func.isRequired,
  setRenderInPortal: PropTypes.func.isRequired,
};
