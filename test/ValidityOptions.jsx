import React from 'react';
import PropTypes from 'prop-types';

import { isTime } from './shared/propTypes';

export default function ValidityOptions({
  maxTime,
  minTime,
  required,
  setMaxTime,
  setMinTime,
  setRequired,
}) {
  function onMinChange(event) {
    const { value } = event.target;

    setMinTime(value || null);
  }

  function onMaxChange(event) {
    const { value } = event.target;

    setMaxTime(value || null);
  }

  return (
    <fieldset id="ValidityOptions">
      <legend htmlFor="ValidityOptions">Minimum and maximum time</legend>

      <div>
        <label htmlFor="minTime">Minimum time</label>
        <input id="minTime" onChange={onMinChange} step="1" type="time" value={minTime || ''} />
        &nbsp;
        <button onClick={() => setMinTime(undefined)} type="button">
          Clear
        </button>
      </div>

      <div>
        <label htmlFor="maxTime">Maximum time</label>
        <input id="maxTime" onChange={onMaxChange} step="1" type="time" value={maxTime || ''} />
        &nbsp;
        <button onClick={() => setMaxTime(undefined)} type="button">
          Clear
        </button>
      </div>

      <div>
        <input
          checked={required}
          id="required"
          onChange={(event) => setRequired(event.target.checked)}
          type="checkbox"
        />
        <label htmlFor="required">Required</label>
      </div>
    </fieldset>
  );
}

ValidityOptions.propTypes = {
  maxTime: isTime,
  minTime: isTime,
  required: PropTypes.bool,
  setMaxTime: PropTypes.func.isRequired,
  setMinTime: PropTypes.func.isRequired,
  setRequired: PropTypes.func.isRequired,
};
